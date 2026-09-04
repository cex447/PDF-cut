# Extractor PDF — v1.2 privada

Aplicación web para extraer un intervalo de páginas de un PDF, por ejemplo de la 9 a la 21, ambas incluidas.

## Privacidad

- El PDF se procesa en el navegador.
- No se sube a GitHub ni a un servidor de procesamiento.
- La versión publicada usa `vendor/pdf-lib.min.js` desde el mismo sitio.
- `connect-src 'none'` bloquea conexiones salientes de la aplicación durante el uso.
- No utiliza CDN en tiempo de ejecución.

## Primera publicación

El workflow `.github/workflows/pages.yml` obtiene `pdf-lib` 1.17.1 una sola vez durante la construcción, comprueba su SHA-512, guarda la copia verificada en `vendor/pdf-lib.min.js` dentro del repositorio y publica GitHub Pages.

Hay una copia visible del workflow en `GITHUB-PAGES-WORKFLOW.yml` para facilitar su creación desde iPhone/iPad si la carpeta oculta `.github` no se conserva al subir archivos.

Consulta `INSTALAR-EN-GITHUB.md` para los pasos exactos.
