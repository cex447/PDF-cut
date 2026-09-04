# Privacidad del Extractor PDF

## Qué ocurre con el PDF

El PDF seleccionado se abre mediante la API local de archivos del navegador (`File.arrayBuffer()`).
El documento original y el PDF generado permanecen en la memoria del navegador del dispositivo.
La aplicación no contiene código para subir esos bytes a GitHub, a un CDN, a una API ni a un servidor propio.

## Bloqueo de red en tiempo de uso

`index.html` aplica una Content Security Policy (CSP) restrictiva:

- `connect-src 'none'`: bloquea `fetch`, XMLHttpRequest, WebSocket y conexiones equivalentes.
- `script-src 'self'`: sólo permite JavaScript servido desde el mismo sitio.
- `object-src 'none'`, `frame-src 'none'` y `form-action 'none'`: cierran vías adicionales de envío o carga.

El motor `pdf-lib` se sirve como `vendor/pdf-lib.min.js` desde el mismo sitio que la aplicación.

## Publicación

El flujo de GitHub Actions obtiene una versión fijada de `pdf-lib` (1.17.1) únicamente durante la construcción del sitio, verifica su huella SHA-512 y la copia a `vendor/pdf-lib.min.js`.
Esa operación ocurre antes de que el usuario visite la aplicación y no tiene acceso a los PDFs que se seleccionen después en el navegador.

## GitHub Pages

Como cualquier web alojada en GitHub Pages, GitHub recibe las peticiones HTTP necesarias para entregar los archivos estáticos de la aplicación. El PDF que el usuario selecciona no forma parte de esas peticiones y no se envía a GitHub.
