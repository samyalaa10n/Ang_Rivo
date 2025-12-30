import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';
import * as JSZip from 'jszip';
import { Tools } from './Tools.service';
import { v4 as uuidv4 } from 'uuid';
export interface FileUploadConfig {
  fileType: string; // 'all' | 'pdf' | 'xlsx' | 'docx' | 'image' | etc
  maxFileSizeMB: number; // default 5
  urlPath: string;
  multipleOrSingle: 'single' | 'multiple';
  insertAutomatic: boolean;
}

export interface FileUploadResult {
  fileName: string;
  fileSizeKB: number;
  filePath: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private http: HttpClient,
    public _myTools: Tools
  ) { }

  /**
   * Verify file signature and extension match
   */
  async verifyFileSignature(base64: string, extension: string): Promise<string> {
    try {
      const cleaned = (base64 || '').replace(/^data:.*;base64,/, '');
      if (!cleaned) return 'File is empty';

      // base64 → Uint8Array
      const byteChars = atob(cleaned);
      const bytes = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        bytes[i] = byteChars.charCodeAt(i);
      }

      const startsWith = (arr: Uint8Array, sig: number[]) =>
        sig.every((b, i) => arr[i] === b);
      const endsWith = (arr: Uint8Array, sig: number[]) =>
        sig.every((b, i) => arr[arr.length - sig.length + i] === b);

      const FILE_SIGNATURES: Record<string, { header?: number[][]; footer?: number[][] }> = {
        bmp: { header: [[0x42, 0x4D]] },
        doc: { header: [[0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]] },
        xls: { header: [[0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]] },
        ppt: { header: [[0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]] },
        docx: { header: [[0x50, 0x4B, 0x03, 0x04]] },
        xlsx: { header: [[0x50, 0x4B, 0x03, 0x04]] },
        pptx: { header: [[0x50, 0x4B, 0x03, 0x04]] },
        jpeg: { header: [[0xFF, 0xD8, 0xFF]], footer: [[0xFF, 0xD9]] },
        jpg: { header: [[0xFF, 0xD8, 0xFF]], footer: [[0xFF, 0xD9]] },
        png: { header: [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]] },
        pdf: { header: [[0x25, 0x50, 0x44, 0x46]] },
        rar: {
          header: [[0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x00], [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x01, 0x00]]
        },
      };

      const ext = (extension || '').toLowerCase().replace(/^\./, '');

      // Verify XLSX doesn't have macros
      if (ext === 'xlsx') {
        return await this.verifyXlsxNoMacros(bytes);
      }

      if (!FILE_SIGNATURES[ext]) {
        this._myTools.Toaster.showError('File type not supported');
        return 'File type not supported';
      }

      const { header = [], footer = [] } = FILE_SIGNATURES[ext];
      const headerOk = header.length === 0 || header.some(sig => startsWith(bytes, sig));
      const footerOk = footer.length === 0 || footer.some(sig => endsWith(bytes, sig));

      return (headerOk && footerOk) ? 'Success' : 'File content is invalid';
    } catch (error) {
      console.error('File verification error:', error);
      return 'File verification failed';
    }
  }

  /**
   * Verify XLSX file doesn't contain macros
   */
  private async verifyXlsxNoMacros(bytes: Uint8Array): Promise<string> {
    try {
      const zip = await JSZip.loadAsync(bytes.buffer as any);
      const contentXml = await zip.file('[Content_Types].xml')?.async('string');

      if (!contentXml) {
        return 'Invalid file content';
      }

      // Reject macro-enabled Excel sheets
      if (contentXml.includes('application/vnd.ms-excel.sheet.macroEnabled.main+xml')) {
        return 'Macro-enabled files are not allowed';
      }

      return 'Success';
    } catch (error) {
      console.error('XLSX verification error:', error);
      return 'File content is invalid';
    }
  }

  /**
   * Extract file extension from filename
   */
  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Get file name without extension
   */
  private getFileNameWithoutExtension(fileName: string): string {
    return fileName.split('.')[0];
  }

  /**
   * Validate file type against allowed types
   */
  private validateFileType(extension: string, allowedType: string): boolean {
    if (allowedType === 'all') return true;

    const extensionMap: Record<string, string[]> = {
      pdf: ['pdf'],
      xlsx: ['xlsx'],
      docx: ['docx'],
      doc: ['doc'],
      xls: ['xls'],
      image: ['jpg', 'jpeg', 'png', 'svg'],
    };

    const allowedExtensions = extensionMap[allowedType] || [];
    return allowedExtensions.includes(extension);
  }

  /**
   * Convert base64 string to Uint8Array
   */
  private base64ToUint8Array(base64: string): Uint8Array {
    const byteChars = atob(base64);
    const bytes = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      bytes[i] = byteChars.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Read file as base64 and convert to File object
   */
  private async fileToBase64AndUint8(file: File): Promise<{ base64: string; uint8: Uint8Array }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let base64 = reader.result?.toString() || '';
        base64 = base64.split(',')[1] || base64;
        const uint8 = this.base64ToUint8Array(base64);
        resolve({ base64, uint8 });
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Generate unique filename with timestamp
   */
  private generateFileName(originalName: string): string {
    const ext = this.getFileExtension(originalName);
    const timestamp = (new Date().toLocaleDateString().trim()+uuidv4()).replaceAll("/", "_");
    return `${timestamp}.${ext}`;
  }

  /**
   * Upload file with progress tracking
   */
  uploadFile(
    inputFile: any,
    config: FileUploadConfig,
    onProgressChange: (progress: number) => void
  ): Promise<FileUploadResult | null> {
    return new Promise(async (resolve) => {
      try {
        const files = inputFile.files;

        // Validate file selection
        if (!files || files.length === 0) {
          this._myTools.Toaster.showError('Please select a file');
          resolve(null);
          return;
        }

        const file = files[0] as File;

        // Validate file size
        if (file.size === 0) {
          this._myTools.Toaster.showError('File is empty');
          resolve(null);
          return;
        }

        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > config.maxFileSizeMB) {
          this._myTools.Toaster.showError(
            `File size must not exceed ${config.maxFileSizeMB} MB`
          );
          resolve(null);
          return;
        }

        // Validate file type
        const extension = this.getFileExtension(file.name);
        if (!this.validateFileType(extension, config.fileType)) {
          this._myTools.Toaster.showError('File type is not supported');
          resolve(null);
          return;
        }

        // Convert file to base64 and Uint8Array
        const { base64, uint8 } = await this.fileToBase64AndUint8(file);

        // Verify file signature
        const verifyResult = await this.verifyFileSignature(base64, extension);
        if (verifyResult !== 'Success') {
          this._myTools.Toaster.showError(verifyResult);
          resolve(null);
          return;
        }

        // Create file from Uint8Array
        const verifiedFile = new File([uint8 as any], file.name, {
          lastModified: file.lastModified,
          type: file.type,
        });

        // Generate unique filename
        const uniqueFileName = this.generateFileName(file.name);

        // Create FormData
        const formData = new FormData();
        formData.append('file', verifiedFile, uniqueFileName);
        formData.append('pathSave', config.urlPath);

        // Create HTTP request
        const uploadRequest = new HttpRequest('POST', this._myTools.environment.APIUrl, formData, {
          reportProgress: true,
        });

        // Send request
        this.http.request(uploadRequest).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              const progress = Math.round((100 * event.loaded) / event.total);
              onProgressChange(progress);
            } else if (event.type === HttpEventType.Response) {
              if (event?.body?.SUCCESS) {
                this._myTools.Toaster.showSuccess('File uploaded successfully');
                onProgressChange(0);

                const result: FileUploadResult = {
                  fileName: uniqueFileName,
                  fileSizeKB: Math.round(file.size / 1024),
                  filePath: `${config.urlPath}/${uniqueFileName}`,
                };

                resolve(result);
              } else {
                this._myTools.Toaster.showError(event?.body?.MESSAGE || 'Upload failed');
                onProgressChange(0);
                resolve(null);
              }
            }
          },
          error: (error) => {
            console.error('Upload error:', error);
            this._myTools.Toaster.showError('Upload failed');
            onProgressChange(0);
            resolve(null);
          },
        });

        // Clear input
        inputFile.value = null;
      } catch (error) {
        console.error('File upload error:', error);
        this._myTools.Toaster.showError('An error occurred during upload');
        resolve(null);
      }
    });
  }
}