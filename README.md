# Extractor PDF — versión privada

Aplicación web estática para extraer un intervalo de páginas de un PDF.

## Funcionamiento

1. Selecciona un PDF.
2. Indica la página inicial y final (ambas incluidas).
3. Pulsa **EXTRAER PDF**.
4. Guarda o comparte el PDF generado.

Ejemplo: `Desde 9` y `Hasta 21` genera un nuevo documento con las páginas 9–21.

## Privacidad

El PDF se lee y procesa dentro del navegador. No se sube a GitHub ni a ningún servidor.

Esta versión elimina los CDN **durante el uso**. `pdf-lib` 1.17.1 se incorpora al artefacto publicado como `vendor/pdf-lib.min.js` durante la construcción de GitHub Pages y, desde ese momento, se sirve desde el mismo origen que la aplicación. El flujo verifica además la huella SHA-512 de la librería antes de publicar.

Además, `index.html` incluye una Content Security Policy con `connect-src 'none'`, por lo que la propia página bloquea `fetch`, XMLHttpRequest, WebSocket y conexiones similares.

Consulta `PRIVACIDAD.md` para los detalles técnicos.

## Publicar con GitHub Pages

1. Crea un repositorio nuevo en GitHub y sube todo el contenido de esta carpeta.
2. Asegúrate de que la rama principal se llame `main`.
3. En **Settings → Pages → Build and deployment → Source**, selecciona **GitHub Actions**.
4. Haz un `push` a `main` o ejecuta manualmente el flujo **Publicar Extractor PDF**.
5. GitHub construirá el sitio, incorporará `pdf-lib` al propio artefacto, comprobará su integridad y publicará la página.

El PDF del usuario nunca interviene en este proceso de construcción.

## Archivos

- `index.html` — interfaz y política CSP.
- `styles.css` — diseño responsive y modo claro/oscuro.
- `app.js` — lectura, validación y extracción local del PDF.
- `vendor/` — ubicación del motor PDF local en la web publicada y licencia de `pdf-lib`.
- `.github/workflows/pages.yml` — construcción y publicación segura en GitHub Pages.
- `PRIVACIDAD.md` — explicación técnica del tratamiento de datos.
- `.nojekyll` — evita el procesamiento Jekyll.

## Compatibilidad

Diseñada para navegadores modernos, incluido Safari en iPhone/iPad, Chrome, Edge y Firefox. Los PDFs muy grandes pueden quedar limitados por la memoria disponible del dispositivo.
