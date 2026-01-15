import { PDFParse } from 'pdf-parse';
import fs from 'fs/promises';

/**
 * Este es un ejemplo de cómo usar directamente las funciones del servidor
 * sin necesidad de ejecutarlo como servidor MCP
 */

async function example() {
  console.log('=== Ejemplo de uso de MCP PDF Reader ===\n');

  // Ruta al PDF de ejemplo (actualiza esto con tu PDF)
  const pdfPath = './test-files/sample.pdf';

  try {
    // 1. Leer metadata
    console.log('1. Leyendo metadatos del PDF...');
    const dataBuffer = await fs.readFile(pdfPath);
    const parser = new PDFParse({ data: dataBuffer });
    const info = await parser.getInfo();
    
    console.log('Metadata:');
    console.log('  Título:', info.info?.Title || 'N/A');
    console.log('  Autor:', info.info?.Author || 'N/A');
    console.log('  Total páginas:', info.total);
    console.log('');

    // 2. Extraer texto completo
    console.log('2. Extrayendo texto completo...');
    const textResult = await parser.getText();
    console.log('Primeros 200 caracteres:');
    console.log(textResult.text.substring(0, 200));
    console.log('...\n');

    // 3. Extraer texto de páginas específicas
    console.log('3. Extrayendo texto de la página 1...');
    const page1Result = await parser.getText({ partial: [1] });
    console.log('Texto página 1 (primeros 150 caracteres):');
    console.log(page1Result.text.substring(0, 150));
    console.log('...\n');

    await parser.destroy();

  } catch (error) {
    if (error instanceof Error && error.message.includes('ENOENT')) {
      console.error('Error: No se encontró el archivo PDF.');
      console.error('Por favor, coloca un archivo PDF en ./test-files/sample.pdf');
    } else {
      console.error('Error:', error);
    }
  }
}

// Ejecutar el ejemplo
example().catch(console.error);
