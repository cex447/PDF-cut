(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const fileInput = $('fileInput');
  const dropZone = $('dropZone');
  const fileInfo = $('fileInfo');
  const fileName = $('fileName');
  const pageCount = $('pageCount');
  const fileSize = $('fileSize');
  const fromPage = $('fromPage');
  const toPage = $('toPage');
  const rangeSummary = $('rangeSummary');
  const extractButton = $('extractButton');
  const progress = $('progress');
  const progressText = $('progressText');
  const errorMessage = $('errorMessage');
  const resultCard = $('resultCard');
  const resultName = $('resultName');
  const resultDetails = $('resultDetails');
  const downloadLink = $('downloadLink');
  const shareButton = $('shareButton');

  let sourceFile = null;
  let sourceBytes = null;
  let totalPages = 0;
  let resultUrl = null;
  let resultFile = null;
  function getPdfLib() {
    if (!window.PDFLib?.PDFDocument) {
      throw new Error('El motor PDF local no está disponible. Publica esta versión mediante el flujo de GitHub Pages incluido en el proyecto.');
    }
    return window.PDFLib;
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, i);
    return `${value >= 10 || i === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[i]}`;
  }

  function baseName(name) {
    return name.replace(/\.pdf$/i, '') || 'documento';
  }

  function outputName(from, to) {
    return `${baseName(sourceFile?.name || 'documento')}_p${from}-${to}.pdf`;
  }

  function clearError() {
    errorMessage.hidden = true;
    errorMessage.textContent = '';
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
  }

  function clearResult() {
    resultCard.hidden = true;
    resultFile = null;
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      resultUrl = null;
    }
    downloadLink.removeAttribute('href');
  }

  function validateRange() {
    if (!sourceFile || !totalPages) {
      extractButton.disabled = true;
      rangeSummary.textContent = 'Selecciona primero un PDF.';
      return null;
    }

    const from = Number(fromPage.value);
    const to = Number(toPage.value);

    if (!Number.isInteger(from) || !Number.isInteger(to)) {
      extractButton.disabled = true;
      rangeSummary.textContent = 'Introduce números de página enteros.';
      return null;
    }
    if (from < 1 || to < 1) {
      extractButton.disabled = true;
      rangeSummary.textContent = 'La primera página es la 1.';
      return null;
    }
    if (from > to) {
      extractButton.disabled = true;
      rangeSummary.textContent = '“Desde” no puede ser posterior a “Hasta”.';
      return null;
    }
    if (to > totalPages) {
      extractButton.disabled = true;
      rangeSummary.textContent = `Este PDF tiene ${totalPages} ${totalPages === 1 ? 'página' : 'páginas'}.`;
      return null;
    }

    const count = to - from + 1;
    extractButton.disabled = false;
    rangeSummary.textContent = `Se extraerán ${count} ${count === 1 ? 'página' : 'páginas'}: de la ${from} a la ${to}.`;
    return { from, to, count };
  }

  async function readSelectedFile(file) {
    clearError();
    clearResult();

    if (!file) return;
    if (file.type && file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
      showError('Selecciona un archivo PDF.');
      return;
    }

    sourceFile = file;
    sourceBytes = null;
    totalPages = 0;
    fileName.textContent = file.name;
    fileSize.textContent = formatBytes(file.size);
    pageCount.textContent = 'Leyendo…';
    fileInfo.hidden = false;
    fromPage.disabled = true;
    toPage.disabled = true;
    extractButton.disabled = true;
    rangeSummary.textContent = 'Leyendo el documento…';

    try {
      const PDFLib = getPdfLib();
      sourceBytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFLib.PDFDocument.load(sourceBytes, { updateMetadata: false });
      totalPages = doc.getPageCount();

      if (!totalPages) throw new Error('El PDF no contiene páginas.');

      pageCount.textContent = totalPages.toLocaleString('es-ES');
      fromPage.min = '1';
      toPage.min = '1';
      fromPage.max = String(totalPages);
      toPage.max = String(totalPages);
      fromPage.value = '1';
      toPage.value = String(totalPages);
      fromPage.disabled = false;
      toPage.disabled = false;
      validateRange();
    } catch (error) {
      console.error(error);
      sourceBytes = null;
      totalPages = 0;
      pageCount.textContent = '—';
      showError(error?.message?.toLowerCase().includes('encrypt')
        ? 'Este PDF está protegido o cifrado y no puede procesarse con esta versión.'
        : (error?.message || 'No se ha podido leer el PDF.'));
      rangeSummary.textContent = 'No se ha podido preparar el documento.';
    }
  }

  async function extractPdf() {
    clearError();
    clearResult();
    const range = validateRange();
    if (!range || !sourceBytes) return;

    extractButton.disabled = true;
    progress.hidden = false;
    progressText.textContent = `Extrayendo páginas ${range.from}–${range.to}…`;

    try {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const PDFLib = getPdfLib();
      const sourceDoc = await PDFLib.PDFDocument.load(sourceBytes, { updateMetadata: false });
      const outputDoc = await PDFLib.PDFDocument.create();

      const indices = Array.from({ length: range.count }, (_, i) => range.from - 1 + i);
      const copiedPages = await outputDoc.copyPages(sourceDoc, indices);
      copiedPages.forEach((page) => outputDoc.addPage(page));

      const pdfBytes = await outputDoc.save({ useObjectStreams: true });
      const name = outputName(range.from, range.to);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      resultFile = new File([blob], name, { type: 'application/pdf' });
      resultUrl = URL.createObjectURL(blob);

      downloadLink.href = resultUrl;
      downloadLink.download = name;
      resultName.textContent = name;
      resultDetails.textContent = `${range.count} ${range.count === 1 ? 'página' : 'páginas'} · ${formatBytes(blob.size)}`;

      const canShare = !!(navigator.share && navigator.canShare && navigator.canShare({ files: [resultFile] }));
      shareButton.hidden = !canShare;
      resultCard.hidden = false;
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
      console.error(error);
      showError('No se ha podido generar el nuevo PDF. El archivo podría estar protegido o usar una estructura no compatible.');
    } finally {
      progress.hidden = true;
      validateRange();
    }
  }

  async function shareResult() {
    if (!resultFile || !navigator.share) return;
    try {
      await navigator.share({ files: [resultFile], title: resultFile.name });
    } catch (error) {
      if (error?.name !== 'AbortError') showError('No se ha podido abrir el menú para compartir.');
    }
  }

  fileInput.addEventListener('change', () => readSelectedFile(fileInput.files?.[0]));
  fromPage.addEventListener('input', () => { clearResult(); clearError(); validateRange(); });
  toPage.addEventListener('input', () => { clearResult(); clearError(); validateRange(); });
  extractButton.addEventListener('click', extractPdf);
  shareButton.addEventListener('click', shareResult);

  ['dragenter', 'dragover'].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add('dragging');
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove('dragging');
    });
  });

  dropZone.addEventListener('drop', (event) => {
    const file = event.dataTransfer?.files?.[0];
    if (file) readSelectedFile(file);
  });

  window.addEventListener('beforeunload', () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  });
})();
