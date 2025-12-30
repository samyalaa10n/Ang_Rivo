import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileUploadConfig, FileUploadService } from '../../service/FileUpload.service';

@Component({
  selector: 'app-UpLoadFile',
  templateUrl: './UpLoadFile.component.html',
  styleUrls: ['./UpLoadFile.component.css'],
  imports: [NgIf]
})
export class UpLoadFileComponent {

 
  @Input() Header: string = "";
  @Input() pathFile: string | null = null;
  @Output() pathFileChange: EventEmitter<any> = new EventEmitter();
  uploadProgress = 0;

  constructor(private uploadService: FileUploadService) { }

  async onFileSelected(event: any) {
    const config: FileUploadConfig = {
      fileType: 'xlsx', // 'all' | 'pdf' | 'xlsx' | 'docx' | 'image'
      maxFileSizeMB: 5,
      urlPath: '/uploads/documents',
      multipleOrSingle: 'single',
      insertAutomatic: true,
    };

    const result = await this.uploadService.uploadFile(
      event.target,
      config,
      (progress) => {
        this.uploadProgress = progress;
      }
    );

    if (result) {
      console.log('File uploaded:', result.fileName);
      console.log('Size:', result.fileSizeKB, 'KB');
      console.log('Path:', result.filePath);
    }
  }

}
