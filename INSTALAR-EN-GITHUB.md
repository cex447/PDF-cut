# Publicar Extractor PDF en GitHub Pages

## Por qué aparece “El motor PDF local no está disponible”

La aplicación necesita el archivo `vendor/pdf-lib.min.js`. En el paquete fuente inicial ese archivo se incorporaba durante el despliegue, pero si el workflow `.github/workflows/pages.yml` no llega al repositorio, GitHub no puede crearlo y aparece ese mensaje.

## Solución

El flujo incluido en esta versión hace tres cosas automáticamente:

1. Obtiene `pdf-lib` 1.17.1 durante la construcción.
2. Verifica su SHA-512 antes de usarlo.
3. Guarda `vendor/pdf-lib.min.js` en el propio repositorio y publica GitHub Pages.

Después de la primera ejecución, el motor PDF queda físicamente dentro del repositorio. Durante el uso normal de la aplicación no se descarga ninguna librería externa y los PDF no salen del dispositivo.

## Desde iPhone / iPad

La carpeta `.github` puede no verse en algunas vistas de Archivos. Si al subir el proyecto esa carpeta no aparece en GitHub, haz lo siguiente en github.com:

1. Abre el repositorio `PDF-cut`.
2. Pulsa **Add file → Create new file**.
3. Como nombre completo del archivo escribe exactamente:

   `.github/workflows/pages.yml`

4. Abre `GITHUB-PAGES-WORKFLOW.yml` de este paquete, copia todo su contenido y pégalo en el editor de GitHub.
5. Pulsa **Commit changes**.

Antes de la primera publicación, comprueba una sola vez **Settings → Pages → Build and deployment → Source → GitHub Actions**. GitHub exige habilitar esa fuente de publicación en el repositorio. Después, al guardar el workflow, GitHub Actions arrancará automáticamente. El flujo se llama **Publicar Extractor PDF**.

Durante la propia construcción se crea `vendor/pdf-lib.min.js`, por lo que la web publicada ya funcionará en esa primera ejecución. El flujo intentará además conservar ese archivo físicamente en el repositorio; si GitHub bloquea ese commit automático, la publicación seguirá funcionando igualmente porque el motor ya forma parte del artefacto de Pages.

## Privacidad

El PDF seleccionado se lee mediante las APIs locales del navegador y se procesa en memoria. El `Content-Security-Policy` de la aplicación incluye `connect-src 'none'`, por lo que la página publicada no puede realizar conexiones salientes mediante fetch/XHR/WebSocket durante su funcionamiento.
