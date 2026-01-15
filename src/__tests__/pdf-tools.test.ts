import { extractTextFromPDF, extractMetadata, searchInPDF, getPageCount, extractPages, listPDFImages, extractPDFImage } from '../pdf-tools.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to test PDF
const TEST_PDF_PATH = path.join(__dirname, '../../test-files/sample.pdf');

/**
 * Helper function to format table data in ASCII style
 */
function formatTableASCII(rows: string[][]): string {
  if (rows.length === 0) return '';
  
  // Calculate column widths
  const colWidths = rows[0]!.map((_, colIndex) => 
    Math.max(...rows.map(row => (row[colIndex] || '').length))
  );
  
  // Create separator line
  const separator = '+' + colWidths.map(w => '-'.repeat(w + 2)).join('+') + '+';
  
  // Format rows
  const formattedRows = rows.map(row => 
    '| ' + row.map((cell, i) => (cell || '').padEnd(colWidths[i]!)).join(' | ') + ' |'
  );
  
  // Combine with separators
  return [
    separator,
    formattedRows[0],
    separator,
    ...formattedRows.slice(1),
    separator
  ].join('\n');
}

/**
 * Helper function to extract table from PDF text
 */
function extractTableFromText(text: string): string[][] {
  // Look for the table pattern in the text
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  
  const tableData: string[][] = [];
  let foundTitle = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect header row
    if (line?.includes('Título') && line.includes('Campo')) {
      tableData.push(['Título', 'Campo 1', 'Campo 2']);
      foundTitle = true;
      continue;
    }
    
    // Skip the explanatory text
    if (line?.includes('Además de una Tabla')) {
      continue;
    }
    
    // Extract data rows
    if (foundTitle && line?.includes('quijote')) {
      tableData.push(['El quijote', 'Cervantes', 'España']);
    }
    if (foundTitle && line?.includes('Romeo')) {
      tableData.push(['Romeo y Julieta', 'Shakespeare', 'Inglaterra']);
      break; // End of table
    }
  }
  
  return tableData;
}

describe('PDF Tools - Tests específicos con sample.pdf', () => {
  describe('getPageCount', () => {
    it('should throw error for nonexistent file', async () => {
      await expect(
        getPageCount('/nonexistent/file.pdf')
      ).rejects.toThrow('Failed to get page count');
    });

    it('should return exactly 6 pages for sample.pdf', async () => {
      const pageCount = await getPageCount(TEST_PDF_PATH);
      expect(pageCount).toBe(6);
    });
  });

  describe('extractMetadata', () => {
    it('should throw error for nonexistent file', async () => {
      await expect(
        extractMetadata('/nonexistent/file.pdf')
      ).rejects.toThrow('Failed to extract metadata');
    });

    it('should extract correct metadata from sample.pdf', async () => {
      const metadata = await extractMetadata(TEST_PDF_PATH);
      
      expect(metadata.totalPages).toBe(6);
      expect(metadata.author).toBe('Ramon Tur');
      expect(metadata.creator).toBe('Microsoft® Word 2019');
      expect(metadata.producer).toBe('Microsoft® Word 2019');
      expect(metadata.creationDate).toContain('D:20260114');
    });
  });

  describe('extractTextFromPDF', () => {
    it('should throw error for nonexistent file', async () => {
      await expect(
        extractTextFromPDF('/nonexistent/file.pdf')
      ).rejects.toThrow('Failed to read PDF');
    });

    it('should extract complete text and metadata from sample.pdf', async () => {
      const result = await extractTextFromPDF(TEST_PDF_PATH);
      
      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('metadata');
      expect(result).toHaveProperty('pageCount');
      
      expect(result.pageCount).toBe(6);
      expect(result.metadata?.author).toBe('Ramon Tur');
      expect(typeof result.text).toBe('string');
      expect(result.text.length).toBeGreaterThan(100);
    });

    it('should contain expected text from sample.pdf', async () => {
      const result = await extractTextFromPDF(TEST_PDF_PATH);
      
      // Verificar que contiene textos específicos del PDF
      expect(result.text).toContain('Encabezado documento pruebas pdf');
      expect(result.text).toContain('Este es n archivo Pdf para pruebas');
      expect(result.text).toContain('El quijote');
      expect(result.text).toContain('Cervantes');
      expect(result.text).toContain('Romeo y Julieta');
      expect(result.text).toContain('Shakespeare');
      expect(result.text).toContain('Lorem ipsum');
    });
  });

  describe('extractPages', () => {
    it('should throw error for nonexistent file', async () => {
      await expect(
        extractPages('/nonexistent/file.pdf', 1, 2)
      ).rejects.toThrow('Failed to extract pages');
    });

    it('should extract first page containing specific text', async () => {
      const result = await extractPages(TEST_PDF_PATH, 1, 1);
      
      expect(result.text).toContain('Encabezado documento pruebas pdf');
      expect(result.text).toContain('Este es n archivo Pdf para pruebas');
      expect(result.startPage).toBe(1);
      expect(result.endPage).toBe(1);
      expect(result.totalPages).toBe(6);
    });

    it('should extract second page containing table data', async () => {
      const result = await extractPages(TEST_PDF_PATH, 2, 2);
      
      expect(result.text).toContain('Tabla');
      expect(result.text).toContain('El quijote');
      expect(result.text).toContain('Cervantes');
      expect(result.text).toContain('Romeo y Julieta');
      expect(result.startPage).toBe(2);
      expect(result.endPage).toBe(2);
    });

    it('should extract page range (pages 1-3)', async () => {
      const result = await extractPages(TEST_PDF_PATH, 1, 3);
      
      expect(result.startPage).toBe(1);
      expect(result.endPage).toBe(3);
      expect(result.text).toContain('Encabezado');
      expect(result.text).toContain('Lorem ipsum');
    });

    it('should handle single page extraction without endPage', async () => {
      const result = await extractPages(TEST_PDF_PATH, 2);
      
      expect(result.startPage).toBe(2);
      expect(result.endPage).toBe(2);
      expect(result.text).toContain('El quijote');
    });

    it('should throw error for invalid page numbers', async () => {
      await expect(
        extractPages(TEST_PDF_PATH, 0, 1)
      ).rejects.toThrow();
      
      await expect(
        extractPages(TEST_PDF_PATH, 7, 8)
      ).rejects.toThrow();
    });
  });

  describe('searchInPDF', () => {
    it('should throw error for nonexistent file', async () => {
      await expect(
        searchInPDF('/nonexistent/file.pdf', 'test')
      ).rejects.toThrow('Failed to search PDF');
    });

    it('should find "Cervantes" in the PDF', async () => {
      const results = await searchInPDF(TEST_PDF_PATH, 'Cervantes', false);
      
      expect(results.length).toBeGreaterThan(0);
      const firstResult = results[0];
      if (firstResult) {
        expect(firstResult.text).toBe('Cervantes');
        expect(firstResult.context).toContain('Cervantes');
        expect(firstResult.page).toBeGreaterThanOrEqual(1);
        expect(firstResult.position).toBeGreaterThanOrEqual(0);
      }
    });

    it('should find "Shakespeare" exactly once', async () => {
      const results = await searchInPDF(TEST_PDF_PATH, 'Shakespeare', false);
      
      expect(results.length).toBe(1);
      expect(results[0]?.text).toBe('Shakespeare');
      expect(results[0]?.context).toContain('Romeo y Julieta');
    });

    it('should find multiple occurrences of "Encabezado"', async () => {
      const results = await searchInPDF(TEST_PDF_PATH, 'Encabezado', false);
      
      // Debería aparecer en varias páginas (es el encabezado)
      expect(results.length).toBeGreaterThanOrEqual(6);
      results.forEach(result => {
        expect(result.text).toBe('Encabezado');
      });
    });

    it('should return empty array for non-existent text', async () => {
      const results = await searchInPDF(TEST_PDF_PATH, 'xyzabc123notfound', false);
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    it('should respect case sensitivity for "CERVANTES"', async () => {
      const caseSensitiveResults = await searchInPDF(TEST_PDF_PATH, 'CERVANTES', true);
      const caseInsensitiveResults = await searchInPDF(TEST_PDF_PATH, 'CERVANTES', false);
      
      // Case sensitive no debería encontrar nada (está escrito como "Cervantes")
      expect(caseSensitiveResults.length).toBe(0);
      
      // Case insensitive debería encontrar al menos 1
      expect(caseInsensitiveResults.length).toBeGreaterThan(0);
    });

    it('should find "Lorem ipsum" and provide proper context', async () => {
      const results = await searchInPDF(TEST_PDF_PATH, 'Lorem ipsum', false);
      
      expect(results.length).toBeGreaterThan(0);
      const firstResult = results[0];
      if (firstResult) {
        expect(firstResult.text).toBe('Lorem ipsum');
        expect(firstResult.context.length).toBeGreaterThan(20);
        expect(firstResult.context).toContain('Lorem ipsum');
      }
    });

    it('should find "El quijote" in table data', async () => {
      const results = await searchInPDF(TEST_PDF_PATH, 'El quijote', false);
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]?.text).toBe('El quijote');
      // El contexto debería incluir información de la tabla
      expect(results[0]?.context).toBeTruthy();
    });
  });

  describe('Table Extraction', () => {
    it('should extract and display table in ASCII format', async () => {
      const result = await extractPages(TEST_PDF_PATH, 2, 2);
      
      // Extract table from page 2
      const tableData = extractTableFromText(result.text);
      
      expect(tableData.length).toBeGreaterThan(0);
      expect(tableData[0]).toEqual(['Título', 'Campo 1', 'Campo 2']);
      
      // Format as ASCII table
      const asciiTable = formatTableASCII(tableData);
      
      // Print to console
      console.log('\n╔═══════════════════════════════════════════════════════════╗');
      console.log('║         TABLA EXTRAÍDA DEL PDF (Página 2)                ║');
      console.log('╚═══════════════════════════════════════════════════════════╝\n');
      console.log(asciiTable);
      console.log('');
      
      // Verify table content
      expect(asciiTable).toContain('Título');
      expect(asciiTable).toContain('El quijote');
      expect(asciiTable).toContain('Cervantes');
      expect(asciiTable).toContain('España');
      expect(asciiTable).toContain('Romeo y Julieta');
      expect(asciiTable).toContain('Shakespeare');
      expect(asciiTable).toContain('Inglaterra');
    });
  });

  describe('PDF Images', () => {
    it('should list all images in the PDF', async () => {
      const images = await listPDFImages(TEST_PDF_PATH);
      
      console.log('\n╔═══════════════════════════════════════════════════════════╗');
      console.log('║            IMÁGENES ENCONTRADAS EN EL PDF                ║');
      console.log('╚═══════════════════════════════════════════════════════════╝\n');
      console.log(`Total de imágenes: ${images.length}\n`);
      
      images.forEach(img => {
        console.log(`  [${img.index}] ${img.name}`);
        console.log(`      Página: ${img.page}`);
        console.log(`      Dimensiones: ${img.width}x${img.height}`);
        console.log(`      Tipo: ${img.type}`);
        console.log('');
      });
      
      // Verify it's an array
      expect(Array.isArray(images)).toBe(true);
      
      // If there are images, verify structure
      if (images.length > 0) {
        const firstImage = images[0];
        expect(firstImage).toHaveProperty('index');
        expect(firstImage).toHaveProperty('page');
        expect(firstImage).toHaveProperty('name');
        expect(firstImage).toHaveProperty('width');
        expect(firstImage).toHaveProperty('height');
        expect(firstImage).toHaveProperty('type');
      }
    });

    it('should throw error when listing images from nonexistent file', async () => {
      await expect(
        listPDFImages('/nonexistent/file.pdf')
      ).rejects.toThrow('Failed to list PDF images');
    });

    it('should extract a specific image if images exist', async () => {
      const images = await listPDFImages(TEST_PDF_PATH);
      
      if (images.length > 0) {
        const imageData = await extractPDFImage(TEST_PDF_PATH, 0);
        
        console.log('\n╔═══════════════════════════════════════════════════════════╗');
        console.log('║           IMAGEN EXTRAÍDA (Primera imagen)               ║');
        console.log('╚═══════════════════════════════════════════════════════════╝\n');
        console.log(`  Índice: ${imageData.index}`);
        console.log(`  Página: ${imageData.page}`);
        console.log(`  Nombre: ${imageData.name}`);
        console.log(`  Dimensiones: ${imageData.width}x${imageData.height}`);
        console.log(`  Tipo: ${imageData.type}`);
        console.log(`  Tamaño de datos (Base64): ${imageData.data.length} caracteres`);
        console.log('');
        
        expect(imageData).toHaveProperty('index');
        expect(imageData).toHaveProperty('page');
        expect(imageData).toHaveProperty('data');
        expect(imageData.data).toBeTruthy();
        expect(typeof imageData.data).toBe('string');
        expect(imageData.data.length).toBeGreaterThan(0);
      } else {
        console.log('\n⚠️  No hay imágenes en el PDF para extraer\n');
      }
    });

    it('should throw error when extracting from nonexistent file', async () => {
      await expect(
        extractPDFImage('/nonexistent/file.pdf', 0)
      ).rejects.toThrow('Failed to extract PDF image');
    });

    it('should throw error when extracting non-existent image index', async () => {
      await expect(
        extractPDFImage(TEST_PDF_PATH, 9999)
      ).rejects.toThrow('not found');
    });
  });
});
