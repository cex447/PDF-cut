Este directorio contiene el motor PDF servido por la propia aplicación.

En GitHub Pages, el flujo .github/workflows/pages.yml obtiene pdf-lib 1.17.1 durante la construcción, verifica su SHA-512 y lo copia aquí como pdf-lib.min.js ANTES de publicar el sitio.

Durante el uso de la aplicación no se consulta ningún CDN ni servidor para procesar el PDF.
