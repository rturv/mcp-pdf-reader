import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';
import { PDFDocument } from 'pdf-lib';
import type { PDFMetadata, PDFExtractionResult, SearchResult, PageRange, PDFImageInfo, PDFImageResult } from './types.js';

/**
 * Read and extract all text from a PDF file
 */
export async function extractTextFromPDF(filePath: string): Promise<PDFExtractionResult> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const textResult = await parser.getText();
    const infoResult = await parser.getInfo();
    await parser.destroy();

    const metadata: PDFMetadata = {
      title: infoResult.info?.Title,
      author: infoResult.info?.Author,
      subject: infoResult.info?.Subject,
      creator: infoResult.info?.Creator,
      producer: infoResult.info?.Producer,
      creationDate: infoResult.info?.CreationDate,
      modificationDate: infoResult.info?.ModDate,
      keywords: infoResult.info?.Keywords,
      totalPages: infoResult.total,
    };

    return {
      text: textResult.text,
      metadata,
      pageCount: infoResult.total,
    };
  } catch (error) {
    throw new Error(`Failed to read PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract metadata from a PDF file
 */
export async function extractMetadata(filePath: string): Promise<PDFMetadata> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getInfo();
    await parser.destroy();

    return {
      title: result.info?.Title,
      author: result.info?.Author,
      subject: result.info?.Subject,
      creator: result.info?.Creator,
      producer: result.info?.Producer,
      creationDate: result.info?.CreationDate,
      modificationDate: result.info?.ModDate,
      keywords: result.info?.Keywords,
      totalPages: result.total,
    };
  } catch (error) {
    throw new Error(`Failed to extract metadata: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get the number of pages in a PDF
 */
export async function getPageCount(filePath: string): Promise<number> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getInfo();
    await parser.destroy();
    return result.total;
  } catch (error) {
    throw new Error(`Failed to get page count: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract text from specific pages of a PDF
 */
export async function extractTextFromPages(
  filePath: string,
  pageRange: PageRange
): Promise<string> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    
    // Get text from specific pages
    const start = pageRange.start;
    const end = pageRange.end || pageRange.start;
    
    // Create array of page numbers
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    const result = await parser.getText({ partial: pages });
    await parser.destroy();
    
    return result.text;
  } catch (error) {
    throw new Error(`Failed to extract pages: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract text from specific pages with metadata
 */
export async function extractPages(
  filePath: string,
  startPage: number,
  endPage?: number
): Promise<{ text: string; startPage: number; endPage: number; totalPages: number }> {
  try {
    const totalPages = await getPageCount(filePath);
    const actualEndPage = endPage || startPage;
    
    if (startPage < 1 || startPage > totalPages) {
      throw new Error(`Invalid start page: ${startPage}. Must be between 1 and ${totalPages}`);
    }
    if (actualEndPage < 1 || actualEndPage > totalPages) {
      throw new Error(`Invalid end page: ${actualEndPage}. Must be between 1 and ${totalPages}`);
    }
    if (startPage > actualEndPage) {
      throw new Error(`Start page (${startPage}) must be less than or equal to end page (${actualEndPage})`);
    }
    
    const text = await extractTextFromPages(filePath, { start: startPage, end: actualEndPage });
    
    return {
      text,
      startPage,
      endPage: actualEndPage,
      totalPages
    };
  } catch (error) {
    throw new Error(`Failed to extract pages: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Search for text in a PDF and return matches with context
 */
export async function searchInPDF(
  filePath: string,
  searchTerm: string,
  caseSensitive: boolean = false
): Promise<SearchResult[]> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const info = await parser.getInfo();
    
    const results: SearchResult[] = [];
    const searchRegex = new RegExp(
      searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      caseSensitive ? 'g' : 'gi'
    );

    // Search through each page
    for (let pageNo = 1; pageNo <= info.total; pageNo++) {
      const pageResult = await parser.getText({ partial: [pageNo] });
      const pageText = pageResult.text;
      
      let match;
      while ((match = searchRegex.exec(pageText)) !== null) {
        const contextStart = Math.max(0, match.index - 50);
        const contextEnd = Math.min(pageText.length, match.index + match[0].length + 50);
        const context = pageText.substring(contextStart, contextEnd).replace(/\n/g, ' ');

        results.push({
          page: pageNo,
          text: match[0],
          context: `...${context}...`,
          position: match.index,
        });
      }
    }
    
    await parser.destroy();
    return results;
  } catch (error) {
    throw new Error(`Failed to search PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * List all images embedded in a PDF
 */
export async function listPDFImages(filePath: string): Promise<PDFImageInfo[]> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(dataBuffer);
    
    const images: PDFImageInfo[] = [];
    const pages = pdfDoc.getPages();
    
    let imageIndex = 0;
    
    // Iterate through all embedded images using pdf-lib's embedded images
    const embeddedImages = [];
    
    // Try to extract images from pages
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      const page = pages[pageIndex];
      if (!page) continue;
      
      try {
        // Get page resources
        const resources = page.node.Resources();
        if (!resources) continue;
        
        // Look up XObject dictionary
        const xObjectsRef = resources.lookup(pdfDoc.context.obj('XObject'));
        if (!xObjectsRef) continue;
        
        // Get the dictionary entries
        const dict = pdfDoc.context.lookup(xObjectsRef);
        if (!dict) continue;
        
        // Cast to any to access internal properties
        const dictObj = dict as any;
        if (!dictObj.dict) continue;
        
        // Iterate through XObjects
        for (const [nameRef, objRef] of dictObj.dict.entries()) {
          const name = nameRef.toString().replace(/^\//, '');
          const obj = pdfDoc.context.lookup(objRef);
          if (!obj) continue;
          
          const objAny = obj as any;
          if (!objAny.dict) continue;
          
          const subtypeRef = objAny.dict.get(pdfDoc.context.obj('Subtype'));
          if (!subtypeRef || subtypeRef.toString() !== '/Image') continue;
          
          // It's an image
          const widthRef = objAny.dict.get(pdfDoc.context.obj('Width'));
          const heightRef = objAny.dict.get(pdfDoc.context.obj('Height'));
          const filterRef = objAny.dict.get(pdfDoc.context.obj('Filter'));
          
          let imageType = 'Unknown';
          if (filterRef) {
            const filterStr = filterRef.toString();
            if (filterStr.includes('DCTDecode')) imageType = 'JPEG';
            else if (filterStr.includes('FlateDecode')) imageType = 'PNG';
            else if (filterStr.includes('JPXDecode')) imageType = 'JPEG2000';
            else if (filterStr.includes('CCITTFaxDecode')) imageType = 'TIFF';
          }
          
          images.push({
            index: imageIndex++,
            page: pageIndex + 1,
            name,
            width: widthRef ? Number(widthRef.toString()) : 0,
            height: heightRef ? Number(heightRef.toString()) : 0,
            type: imageType,
          });
        }
      } catch (err) {
        // Skip page if error
        continue;
      }
    }
    
    return images;
  } catch (error) {
    throw new Error(`Failed to list PDF images: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract a specific image from a PDF by index
 */
export async function extractPDFImage(filePath: string, imageIndex: number): Promise<PDFImageResult> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(dataBuffer);
    
    const pages = pdfDoc.getPages();
    let currentIndex = 0;
    let foundImage: PDFImageResult | null = null;
    
    // Search for the image by index
    for (let pageIndex = 0; pageIndex < pages.length && !foundImage; pageIndex++) {
      const page = pages[pageIndex];
      if (!page) continue;
      
      try {
        const resources = page.node.Resources();
        if (!resources) continue;
        
        const xObjectsRef = resources.lookup(pdfDoc.context.obj('XObject'));
        if (!xObjectsRef) continue;
        
        const dict = pdfDoc.context.lookup(xObjectsRef);
        if (!dict) continue;
        
        const dictObj = dict as any;
        if (!dictObj.dict) continue;
        
        for (const [nameRef, objRef] of dictObj.dict.entries()) {
          const name = nameRef.toString().replace(/^\//, '');
          const obj = pdfDoc.context.lookup(objRef);
          if (!obj) continue;
          
          const objAny = obj as any;
          if (!objAny.dict) continue;
          
          const subtypeRef = objAny.dict.get(pdfDoc.context.obj('Subtype'));
          if (!subtypeRef || subtypeRef.toString() !== '/Image') continue;
          
          if (currentIndex === imageIndex) {
            // Found the target image
            const widthRef = objAny.dict.get(pdfDoc.context.obj('Width'));
            const heightRef = objAny.dict.get(pdfDoc.context.obj('Height'));
            const filterRef = objAny.dict.get(pdfDoc.context.obj('Filter'));
            
            let imageType = 'Unknown';
            if (filterRef) {
              const filterStr = filterRef.toString();
              if (filterStr.includes('DCTDecode')) imageType = 'JPEG';
              else if (filterStr.includes('FlateDecode')) imageType = 'PNG';
              else if (filterStr.includes('JPXDecode')) imageType = 'JPEG2000';
              else if (filterStr.includes('CCITTFaxDecode')) imageType = 'TIFF';
            }
            
            // Extract image data
            let imageData: Buffer;
            if (objAny.contents) {
              imageData = Buffer.from(objAny.contents);
            } else {
              throw new Error('Unable to extract image data');
            }
            
            const base64Data = imageData.toString('base64');
            
            foundImage = {
              index: imageIndex,
              page: pageIndex + 1,
              name,
              width: widthRef ? Number(widthRef.toString()) : 0,
              height: heightRef ? Number(heightRef.toString()) : 0,
              type: imageType,
              data: base64Data,
            };
            break;
          }
          currentIndex++;
        }
      } catch (err) {
        continue;
      }
    }
    
    if (!foundImage) {
      throw new Error(`Image with index ${imageIndex} not found in PDF`);
    }
    
    return foundImage;
  } catch (error) {
    throw new Error(`Failed to extract PDF image: ${error instanceof Error ? error.message : String(error)}`);
  }
}
