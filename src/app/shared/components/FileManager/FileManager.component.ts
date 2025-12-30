// ============================================
// file-manager.component.ts
// ============================================

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadConfig, FileUploadService } from '../../service/FileUpload.service';
import { Tools } from '../../service/Tools.service';
import { FormsModule } from '@angular/forms';

export interface FileItem {
  id: string;
  fileName: string;
  fileHint?: string;
  fileSizeKB: number;
  filePath: string;
  uploadDate: Date;
}

@Component({
  selector: 'app-file-manager',
  templateUrl: './FileManager.component.html',
  styleUrls: ['./FileManager.component.css'],
  imports: [CommonModule, FormsModule]
})
export class FileManagerComponent implements OnInit {
  @Input() label: string = 'Upload Files';
  @Input() fileType: 'all' | 'pdf' | 'xlsx' | 'docx' | 'image' = "all"
  @Input() maxFileSizeMB: number = 5;
  @Input() urlPath: string = 'Files';
  @Input() allowMultiple: boolean = true;
  @Input() mode: 'view' | 'edit' = 'edit'; // view or edit mode

  @Output() onFilesChanged = new EventEmitter<FileItem[]>();
  @Input() FileObjectJson: string = "";
  @Output() FileObjectJsonChange: EventEmitter<string> = new EventEmitter()
  files: FileItem[] = [];
  uploadProgress = 0;
  isUploading = false;

  constructor(private fileUploadService: FileUploadService, private _myTools: Tools) { }

  ngOnInit() {
    this.start()
  }
  start() {
    if (this.FileObjectJson == "" && this.FileObjectJson != null) {
      this.FileObjectJson = "[]"
    }
    this.files = JSON.parse(this.FileObjectJson || "[]")
    this.files.forEach((fn, dx) => {
      if (fn.fileHint) {
        if (fn.fileHint == "") {
          fn.fileHint = " image  " + (dx + 1)
        }
      }
    })
  }
  ngOnChanges() {
    this.start()
  }

  /**
   * Get accept attribute for file input based on fileType
   */
  getAcceptAttribute(): string {
    const acceptMap: Record<string, string> = {
      all: '*',
      pdf: '.pdf',
      xlsx: '.xlsx',
      docx: '.docx',
      doc: '.doc',
      xls: '.xls',
      image: 'image/jpeg,image/png,image/svg+xml,image/webp',
      word: '.doc,.docx',
      excel: '.xls,.xlsx',
    };

    return acceptMap[this.fileType] || '*';
  }

  /**
   * Handle file selection and upload
   */
  async onFileSelected(event: any) {
    if (this.mode === 'view') {
      return; // Don't allow uploads in view mode
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    const config: FileUploadConfig = {
      fileType: this.fileType,
      maxFileSizeMB: this.maxFileSizeMB,
      urlPath: this.urlPath,
      multipleOrSingle: this.allowMultiple ? 'multiple' : 'single',
      insertAutomatic: true,
    };

    const result = await this.fileUploadService.uploadFile(
      event.target,
      config,
      (progress) => {
        this.uploadProgress = progress;
      }
    );

    this.isUploading = false;
    this.uploadProgress = 0;

    if (result) {
      const newFile: FileItem = {
        id: this.generateId(),
        fileName: result.fileName,
        fileSizeKB: result.fileSizeKB,
        filePath: result.filePath,
        uploadDate: new Date(),
      };
      debugger
      if (this.allowMultiple) {
        this.files.push(newFile);
        this.FileObjectJson = JSON.stringify(this.files);
        this.FileObjectJsonChange.emit(this.FileObjectJson)
      } else {
        this.files = [newFile];
        this.FileObjectJson = JSON.stringify(this.files);
        this.FileObjectJsonChange.emit(this.FileObjectJson)
      }
      this.onFilesChanged.emit(this.files);
    }
  }

  /**
   * Remove file from list
   */
  removeFile(fileId: string) {
    this.files = this.files.filter(f => f.id !== fileId);
    this.FileObjectJson = JSON.stringify(this.files);
    this.FileObjectJsonChange.emit(this.FileObjectJson)
    this.onFilesChanged.emit(this.files);
  }

  /**
   * Download file
   */
  downloadFile(file: FileItem) {
    try {
      const link = document.createElement('a');
      link.href = `${this._myTools.Network.baseUrl}/Resources/${this.urlPath}/${file.fileName}`;
      link.download = `${this._myTools.Network.baseUrl}/Resources/${this.urlPath}/${file.fileName}`;
      link.target = '_blank';
      link.click();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  }

  /**
   * Preview file
   */
  previewFile(file: FileItem) {
    try {
      // For PDFs and images
      const ext = file.fileName.split('.').pop()?.toLowerCase();
      if (['pdf', 'jpg', 'jpeg', 'png', 'svg'].includes(ext || '')) {
        window.open(`${this._myTools.Network.baseUrl}/Resources/${this.urlPath}/${file.fileName}`, '_blank');
      } else {
        alert('Preview not available for this file type. Please download to view.');
      }
    } catch (error) {
      console.error('Preview error:', error);
      alert('Failed to preview file');
    }
  }

  /**
   * Get file size with appropriate unit
   */
  getFileSize(sizeKB: number): string {
    if (sizeKB > 1024) {
      return (sizeKB / 1024).toFixed(2) + ' MB';
    }
    return sizeKB + ' KB';
  }

  /**
   * Get file icon based on extension
   */
  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const iconMap: Record<string, string> = {
      pdf: 'pi-file-pdf',
      doc: 'pi-file-word',
      docx: 'pi-file-word',
      xls: 'pi-file-excel',
      xlsx: 'pi-file-excel',
      jpg: 'pi-image',
      jpeg: 'pi-image',
      png: 'pi-image',
      svg: 'pi-image',
      zip: 'pi-file-archive',
      rar: 'pi-file-archive',
    };
    return iconMap[ext] || 'pi-file';
  }

  /**
   * Set files programmatically (for loading existing files)
   */
  setFiles(filesList: FileItem[]) {
    this.files = filesList;
  }

  /**
   * Get all files
   */
  getFiles(): FileItem[] {
    return this.files;
  }

  /**
   * Clear all files
   */
  clearFiles() {
    this._myTools.Confermation.show("Are you sure you want to clear all files?").then(e => {
      if (e) {
        this.files = [];
        this.FileObjectJson = JSON.stringify(this.files);
        this.FileObjectJsonChange.emit(this.FileObjectJson)
        this.onFilesChanged.emit(this.files);
      }
    });
  }

  EditHint() {
    this.FileObjectJson = JSON.stringify(this.files);
    this.FileObjectJsonChange.emit(this.FileObjectJson)
    this._myTools.Toaster.showInfo("saved")
  }
  /**
   * Generate unique ID for file
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}