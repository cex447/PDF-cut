# Extractor PDF

Aplicación web estática para extraer un intervalo de páginas de un PDF.

## Funcionamiento

1. Selecciona un PDF.
2. Indica la página inicial y final (ambas incluidas).
3. Pulsa **EXTRAER PDF**.
4. Guarda o comparte el PDF generado.

Ejemplo: `Desde 9` y `Hasta 21` genera un nuevo documento con las páginas 9–21.

## Privacidad

El archivo PDF se lee y procesa dentro del navegador. No se envía a GitHub ni a un servidor propio.

La aplicación carga `pdf-lib` 1.17.1 desde jsDelivr, con un segundo origen de respaldo en unpkg. Esa descarga contiene únicamente el motor JavaScript: el PDF seleccionado por el usuario no se transmite al CDN.

## Publicar con GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube el contenido de esta carpeta a la raíz del repositorio.
3. En **Settings → Pages**, selecciona **Deploy from a branch**.
4. Selecciona la rama `main` y la carpeta `/ (root)`.
5. Guarda los cambios.

No requiere servidor, base de datos ni proceso de compilación.

## Archivos

- `index.html` — interfaz.
- `styles.css` — diseño responsive, modo claro/oscuro.
- `app.js` — lectura, validación y extracción del PDF.
- `.nojekyll` — evita el procesamiento Jekyll de GitHub Pages.

## Compatibilidad

Diseñada para navegadores modernos, incluido Safari en iPhone/iPad, Chrome, Edge y Firefox. Los PDFs muy grandes pueden quedar limitados por la memoria disponible del dispositivo.
