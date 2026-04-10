"""
Perfil vertical de Presiones y Concentraciones desde resultados de ModelMuse
=============================================================================
Lee archivos CSV exportados desde ModelMuse (MODFLOW/PHAST) y genera una
gráfica de perfil vertical en un solo punto (X, Y), con:
  - Presiones (o carga hidráulica) graficadas hacia la IZQUIERDA
  - Concentraciones graficadas hacia la DERECHA

Uso:
    python perfil_presiones_concentraciones.py \
        --presiones ruta/presiones.csv \
        --concentraciones ruta/concentraciones.csv \
        --x 652000 --y 9610000 \
        --tolerancia 50 \
        --tiempo_paso 1 \
        --output perfil.png

    Si no se proporcionan archivos, se usa datos de demostración.

Formato esperado de los CSV de ModelMuse:
    X, Y, Z, Time, valor
    (los nombres de columna se configuran abajo con las constantes COL_*)
"""

import argparse

import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import numpy as np
import pandas as pd

# ---------------------------------------------------------------------------
# Configuración de nombres de columnas en los CSV de ModelMuse
# Ajusta estos valores si tus exportaciones usan nombres distintos.
# ---------------------------------------------------------------------------
COL_X = "X"           # Columna de coordenada X
COL_Y = "Y"           # Columna de coordenada Y
COL_Z = "Z"           # Columna de profundidad / elevación (m)
COL_TIEMPO = "Time"   # Columna del paso de tiempo (número o valor)
COL_PRESION = "Head"  # Columna de presión o carga hidráulica en el CSV de presiones
# Para concentraciones se detectan automáticamente todas las columnas
# que no sean X, Y, Z, Time.


# ---------------------------------------------------------------------------
# Función auxiliar: leer y filtrar el CSV para el punto (x0, y0)
# ---------------------------------------------------------------------------
def leer_perfil(ruta_csv, x0, y0, tolerancia, paso_tiempo=None):
    """Lee un CSV de ModelMuse y devuelve el perfil en el punto (x0, y0).

    Parameters
    ----------
    ruta_csv : str
        Ruta al archivo CSV exportado desde ModelMuse.
    x0, y0 : float
        Coordenadas del punto de interés.
    tolerancia : float
        Radio de búsqueda alrededor del punto (mismas unidades que X, Y).
    paso_tiempo : int | float | None
        Paso de tiempo a extraer. Si es None se usa el primero disponible.

    Returns
    -------
    pd.DataFrame
        Datos filtrados, ordenados por Z descendente (de la superficie al fondo).
    """
    df = pd.read_csv(ruta_csv)

    # Filtrar por proximidad espacial
    mask = (
        (np.abs(df[COL_X] - x0) <= tolerancia) &
        (np.abs(df[COL_Y] - y0) <= tolerancia)
    )
    df = df[mask].copy()

    if df.empty:
        raise ValueError(
            f"No se encontraron datos cerca de ({x0}, {y0}) con "
            f"tolerancia={tolerancia}. Verifica las coordenadas o aumenta la tolerancia."
        )

    # Filtrar por paso de tiempo
    if COL_TIEMPO in df.columns:
        pasos_disponibles = sorted(df[COL_TIEMPO].unique())
        if paso_tiempo is None:
            paso_tiempo = pasos_disponibles[0]
            print(f"  [INFO] paso_tiempo no especificado. Usando: {paso_tiempo}")
            print(f"  [INFO] Pasos disponibles: {pasos_disponibles}")
        df = df[df[COL_TIEMPO] == paso_tiempo].copy()

    # Ordenar por Z (de mayor elevación a menor → de superficie a fondo)
    df = df.sort_values(COL_Z, ascending=False).reset_index(drop=True)
    return df


# ---------------------------------------------------------------------------
# Datos de demostración (se usan si no se pasan archivos reales)
# ---------------------------------------------------------------------------
def datos_demo():
    """Genera datos sintéticos de un acuífero amazónico a modo de ejemplo."""
    elevaciones = np.array([110, 105, 100, 95, 90, 85, 80, 75, 70, 65, 60], dtype=float)

    # Presión / carga hidráulica (m)
    presiones = np.array([108, 106, 104, 102, 100, 98, 95, 91, 86, 78, 68], dtype=float)

    # Concentraciones de tres especies (mg/L)
    conc_cl = np.array([12, 14, 18, 22, 30, 45, 62, 80, 95, 110, 130], dtype=float)
    conc_no3 = np.array([5, 4, 3, 3, 2, 2, 1, 1, 0.5, 0.3, 0.1], dtype=float)
    conc_so4 = np.array([20, 22, 25, 28, 33, 40, 50, 65, 80, 95, 110], dtype=float)

    df_pres = pd.DataFrame({
        COL_X: [652000] * len(elevaciones),
        COL_Y: [9610000] * len(elevaciones),
        COL_Z: elevaciones,
        COL_PRESION: presiones,
    })

    df_conc = pd.DataFrame({
        COL_X: [652000] * len(elevaciones),
        COL_Y: [9610000] * len(elevaciones),
        COL_Z: elevaciones,
        "Cl": conc_cl,
        "NO3": conc_no3,
        "SO4": conc_so4,
    })

    return df_pres, df_conc


# ---------------------------------------------------------------------------
# Función principal de graficación
# ---------------------------------------------------------------------------
def graficar_perfil(
    df_presiones,
    df_concentraciones,
    col_presion=COL_PRESION,
    label_presion="Carga hidráulica (m)",
    label_conc="Concentración (mg/L)",
    titulo="Perfil vertical — Leticia / Tabatinga",
    output_path=None,
):
    """Genera la gráfica de doble perfil (presiones ← | → concentraciones).

    Parameters
    ----------
    df_presiones : pd.DataFrame
        DataFrame con columnas Z y col_presion, ya filtrado para el punto.
    df_concentraciones : pd.DataFrame
        DataFrame con columna Z y una o más columnas de concentración.
    col_presion : str
        Nombre de la columna de presión en df_presiones.
    label_presion, label_conc : str
        Etiquetas para los ejes.
    titulo : str
        Título de la figura.
    output_path : str | None
        Ruta donde guardar la figura (PNG/PDF). Si es None, muestra en pantalla.
    """
    # Columnas de concentración = todo menos X, Y, Z, Time
    cols_meta = {COL_X, COL_Y, COL_Z, COL_TIEMPO}
    cols_conc = [c for c in df_concentraciones.columns if c not in cols_meta]

    z_pres = df_presiones[COL_Z].values
    presion = df_presiones[col_presion].values

    z_conc = df_concentraciones[COL_Z].values

    # Paleta de colores para concentraciones
    colores_conc = plt.cm.tab10(np.linspace(0, 0.8, max(len(cols_conc), 1)))

    # -----------------------------------------------------------------------
    # Figura: eje principal compartido para la profundidad (Y).
    # ax_left  → eje X de presiones (valores negativos = barras hacia la izquierda)
    # ax_right → eje X superior de concentraciones (valores positivos = derecha)
    # -----------------------------------------------------------------------
    fig, ax_left = plt.subplots(figsize=(10, 9))
    ax_right = ax_left.twiny()  # comparte el eje Y

    # --- Presiones (barras hacia la izquierda usando valores negativos) ---
    altura_capa = _altura_capas(z_pres)
    ax_left.barh(
        z_pres,
        -presion,
        height=altura_capa,
        color="#1f77b4",
        alpha=0.45,
        label=label_presion,
        align="center",
    )
    ax_left.plot(
        -presion, z_pres,
        color="#1f77b4", linewidth=2, marker="o", markersize=5,
        label="_nolegend_",
    )

    # --- Concentraciones (líneas hacia la derecha) ---
    for i, col in enumerate(cols_conc):
        conc_vals = df_concentraciones[col].values
        ax_right.plot(
            conc_vals, z_conc,
            color=colores_conc[i], linewidth=2, marker="s",
            markersize=5, label=col,
        )

    # -----------------------------------------------------------------------
    # Rango del eje X izquierdo (presiones)
    # -----------------------------------------------------------------------
    max_pres = float(presion.max()) if len(presion) > 0 else 100.0
    ax_left.set_xlim(-max_pres * 1.25, max_pres * 0.05)

    # Mostrar valores absolutos en el eje inferior
    ax_left.xaxis.set_major_formatter(
        ticker.FuncFormatter(lambda val, _: f"{abs(val):.0f}")
    )
    ax_left.set_xlabel(label_presion, color="#1f77b4", fontsize=11)
    ax_left.tick_params(axis="x", colors="#1f77b4")
    ax_left.spines["bottom"].set_color("#1f77b4")

    # -----------------------------------------------------------------------
    # Rango del eje X derecho (concentraciones)
    # -----------------------------------------------------------------------
    max_conc = (
        max(df_concentraciones[c].max() for c in cols_conc)
        if cols_conc else 1.0
    )
    ax_right.set_xlim(-max_conc * 0.05, max_conc * 1.25)
    ax_right.set_xlabel(label_conc, color="#555555", fontsize=11)
    ax_right.tick_params(axis="x", colors="#555555")
    ax_right.spines["top"].set_color("#555555")

    # -----------------------------------------------------------------------
    # Eje Y — elevación/profundidad
    # -----------------------------------------------------------------------
    ax_left.set_ylabel("Elevación (m s.n.m.)", fontsize=12)
    # La superficie queda arriba: el eje Y va de max→min visualmente
    all_z = np.concatenate([z_pres, z_conc])
    margen_z = (all_z.max() - all_z.min()) * 0.08 if all_z.max() != all_z.min() else 5
    ax_left.set_ylim(all_z.min() - margen_z, all_z.max() + margen_z)

    # Línea central (separador presiones | concentraciones)
    ax_left.axvline(0, color="black", linewidth=1.2, linestyle="--", alpha=0.5)

    # -----------------------------------------------------------------------
    # Etiquetas flotantes "PRESIONES ◄" y "► CONCENTRACIONES"
    # -----------------------------------------------------------------------
    y_top = ax_left.get_ylim()[1] - margen_z * 0.3
    ax_left.text(
        -max_pres * 0.62, y_top,
        "◄  PRESIONES",
        color="#1f77b4", fontsize=10, ha="center", va="bottom",
        fontweight="bold",
    )
    ax_right.text(
        max_conc * 0.62, y_top,
        "CONCENTRACIONES  ►",
        color="#333333", fontsize=10, ha="center", va="bottom",
        fontweight="bold",
    )

    # -----------------------------------------------------------------------
    # Leyendas
    # -----------------------------------------------------------------------
    handles_left = [
        plt.Line2D(
            [0], [0], color="#1f77b4", linewidth=2,
            marker="o", markersize=5, label=label_presion,
        )
    ]
    legend_left = ax_left.legend(
        handles=handles_left,
        loc="lower left",
        fontsize=9,
        framealpha=0.8,
    )
    ax_left.add_artist(legend_left)

    ax_right.legend(
        loc="lower right",
        fontsize=9,
        framealpha=0.8,
        title="Especies",
    )

    ax_left.set_title(titulo, fontsize=14, fontweight="bold", pad=15)
    ax_left.grid(axis="y", linestyle=":", alpha=0.5)

    plt.tight_layout()

    if output_path:
        plt.savefig(output_path, dpi=150, bbox_inches="tight")
        print(f"[OK] Figura guardada en: {output_path}")
    else:
        plt.show()

    plt.close(fig)


def _altura_capas(z_array):
    """Calcula alturas para las barras horizontales a partir del vector de elevaciones."""
    if len(z_array) < 2:
        return np.array([4.0] * len(z_array))
    diffs = np.abs(np.diff(z_array))
    # Repetir el último intervalo para la última capa
    heights = np.append(diffs, diffs[-1]) * 0.8
    return heights


# ---------------------------------------------------------------------------
# Punto de entrada
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="Perfil de presiones y concentraciones desde ModelMuse"
    )
    parser.add_argument(
        "--presiones", default=None,
        help="CSV de ModelMuse con datos de presión/carga hidráulica",
    )
    parser.add_argument(
        "--concentraciones", default=None,
        help="CSV de ModelMuse con datos de concentraciones",
    )
    parser.add_argument("--x", type=float, default=652000.0,
                        help="Coordenada X del punto de interés")
    parser.add_argument("--y", type=float, default=9610000.0,
                        help="Coordenada Y del punto de interés")
    parser.add_argument("--tolerancia", type=float, default=50.0,
                        help="Tolerancia espacial para buscar el punto (m)")
    parser.add_argument(
        "--tiempo_paso", default=None,
        help="Paso de tiempo a extraer (si no se especifica, se usa el primero)",
    )
    parser.add_argument(
        "--col_presion", default=COL_PRESION,
        help=f"Nombre de la columna de presión (default: {COL_PRESION})",
    )
    parser.add_argument("--label_presion", default="Carga hidráulica (m)",
                        help="Etiqueta del eje de presiones")
    parser.add_argument("--label_conc", default="Concentración (mg/L)",
                        help="Etiqueta del eje de concentraciones")
    parser.add_argument(
        "--titulo", default="Perfil vertical — Leticia / Tabatinga",
        help="Título de la figura",
    )
    parser.add_argument(
        "--output", default=None,
        help="Ruta de salida (PNG/PDF). Si se omite, muestra en pantalla",
    )

    args = parser.parse_args()

    # ------------------------------------------------------------------
    # Cargar datos (reales o de demostración)
    # ------------------------------------------------------------------
    if args.presiones is None or args.concentraciones is None:
        print("[INFO] No se proporcionaron archivos. Usando datos de demostración.")
        df_pres, df_conc = datos_demo()
    else:
        print(f"[INFO] Leyendo presiones desde: {args.presiones}")
        try:
            tiempo = float(args.tiempo_paso) if args.tiempo_paso else None
        except ValueError:
            tiempo = args.tiempo_paso

        df_pres = leer_perfil(
            args.presiones, args.x, args.y, args.tolerancia, tiempo
        )
        print(f"  → {len(df_pres)} capas encontradas para presiones.")

        print(f"[INFO] Leyendo concentraciones desde: {args.concentraciones}")
        df_conc = leer_perfil(
            args.concentraciones, args.x, args.y, args.tolerancia, tiempo
        )
        print(f"  → {len(df_conc)} capas encontradas para concentraciones.")

    # ------------------------------------------------------------------
    # Graficar
    # ------------------------------------------------------------------
    graficar_perfil(
        df_presiones=df_pres,
        df_concentraciones=df_conc,
        col_presion=args.col_presion,
        label_presion=args.label_presion,
        label_conc=args.label_conc,
        titulo=args.titulo,
        output_path=args.output,
    )


if __name__ == "__main__":
    main()
