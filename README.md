# MirarCE — Sitio web (borrador)

Observatorio de Centros de Estudiantes del Paraguay.

## Estructura

```
web/
├── index.html          Landing page (presentación + misión + teaser de resultados)
├── explorador.html     Explorador de datos (ranking 2025, scroll-driven)
├── css/styles.css      Sistema de diseño (colores, tipografía, componentes)
├── js/
│   ├── data.js         Dataset embebido (window.MIRARCE_DATA)
│   └── explorador.js   Lógica del ranking interactivo
└── data/centros.json   Fuente de datos legible (mismo contenido que data.js)
```

## Cómo verlo

Abrí `index.html` directamente en el navegador (doble clic). No requiere servidor:
los datos están embebidos en `js/data.js` para evitar problemas de CORS con `file://`.

## Marca

- Colores: coral `#F36F60`, oro `#FFC53D`, turquesa `#60C8D3`, azul profundo `#003E56`, crema `#EDECED`
- Tipografías: Anton (títulos), Poppins (subtítulos), Inter (texto)
- Interactividad: revelado al hacer scroll, barras animadas, panel de detalle por centro

## Datos

Generados desde `RESULTADOS 2025.xlsx` (hoja `PARA LANZAMIENTO`): 30 centros, 5
universidades, 7 ejes sobre 100 puntos. Un dato faltante se marca como *pendiente*,
no como cero.

Para regenerar `data/centros.json` y `js/data.js` a partir del Excel, volvé a correr
el script de extracción.

## Pendientes (assets)

- Exportar del Tablero de Marca y colocar en `assets/`: logotipo, mascota y texturas.
  Actualmente el wordmark y las texturas están recreados en CSS como placeholder.

## Mascota (listo)

El personaje fue extraído del Tablero de Marca (página 2, 300 dpi, fondo transparente):
`assets/personaje-teal.png`, `assets/personaje-gold.png`, `assets/personaje-coral.png`.
Animaciones reutilizables en `css/mascota.css` (flotar, saludo, festejo, espiar, entrada).
Demo interno: `mascota.html`.

### Saludo con la mano (capas)

`assets/personaje-teal-cuerpo.png` + `assets/personaje-teal-brazo.png`: el brazo
derecho es una capa separada que rota desde el hombro (clase `.mcw`, animación
`mc-ola`). Los porcentajes de posición en `mascota.css` corresponden al sprite
274x476 — regenerar las capas si se cambia el recorte.
