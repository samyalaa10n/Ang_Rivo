import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class Excel {

  constructor() { }

  exportAsExcelFile(json: any[], fileName: string): void {
    // تحويل JSON إلى ورقة عمل
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

    // إنشاء ملف Excel يحتوي على الورقة
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data']
    };

    // تحويل الملف إلى بايت
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // حفظ الملف
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }
  ExcelFileChange(evt: any,OnLoadExcelFileCallback:(json:any)=>void) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) {
      console.error('من فضلك اختر ملف Excel واحد فقط');
      return;
    }
  
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
  
      const wsname: string = wb.SheetNames[0]; // أول شيت
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  
      let json = XLSX.utils.sheet_to_json(ws); // تحويله إلى JSON
      OnLoadExcelFileCallback(json);
      evt.target.value = null;
    };
    reader.readAsBinaryString(target.files[0]);
  }
}
