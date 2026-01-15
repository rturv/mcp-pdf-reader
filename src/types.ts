/**
 * PDF metadata information
 */
export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  keywords?: string;
  totalPages?: number;
}

/**
 * Page range specification
 */
export interface PageRange {
  start: number;
  end?: number | undefined;
}

/**
 * PDF extraction result
 */
export interface PDFExtractionResult {
  text: string;
  metadata?: PDFMetadata;
  pageCount: number;
}

/**
 * Search result in PDF
 */
export interface SearchResult {
  page: number;
  text: string;
  context: string;
  position: number;
}

/**
 * PDF image information
 */
export interface PDFImageInfo {
  index: number;
  page: number;
  name: string;
  width: number;
  height: number;
  type: string;
}

/**
 * PDF image extraction result
 */
export interface PDFImageResult {
  index: number;
  page: number;
  name: string;
  width: number;
  height: number;
  type: string;
  data: string; // Base64 encoded image data
}
