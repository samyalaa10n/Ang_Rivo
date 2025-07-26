import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PrintOptions } from '../../interface/PrintOptions ';
import { DatePipe, NgIf } from '@angular/common';
import { PrintService } from '../../service/Print.service';
import { Tools } from '../../service/Tools.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css'],
})
export class PrintComponent implements OnInit {
  @Input() showControls: boolean = true;
  @Input() showOptions: boolean = true;
  @Input() options: PrintOptions = {};

  @ViewChild('printContent', { static: true }) printContent!: ElementRef;

  isLoading: boolean = false;
  currentDate: Date = new Date();
  previewContent: string = '';

  // Default options
  defaultOptions: PrintOptions = {
    title: '',
    orientation: 'portrait',
    paperSize: 'A4',
    margins: '1cm',
    showDate: true,
    showPageNumbers: false,
    customStyles: '',
    headerContent: '',
    footerContent: ''
  };
  constructor(public _sevicePrint: PrintService, private _tools: Tools) {
    _sevicePrint.printComponent = this;
    _tools.printService.printComponent = this;
  }
  ngOnInit() {
    this.options = { ...this.defaultOptions, ...this.options };
  }

  print(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.applyPrintStyles();
      window.print();
      this.removePrintStyles();
      this.isLoading = false;
    }, 100);
  }

  preview(): void {
    this.previewContent = this.printContent.nativeElement.innerHTML;
    // Open modal (requires Bootstrap JS)
    const modal = document.getElementById('printPreviewModal');
    if (modal) {
      const bsModal = new (window as any).bootstrap.Modal(modal);
      bsModal.show();
    }
  }





  private applyPrintStyles(): void {
    const existingStyle = document.getElementById('dynamic-print-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    const style = document.createElement('style');
    style.id = 'dynamic-print-styles';
    style.innerHTML = `
      @media print {
        @page {
          size: ${this.options.paperSize} ${this.options.orientation};
          margin: ${this.options.margins};
        }
        
        .print-content {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
        }
        
        .print-title h1 {
          page-break-after: avoid;
        }
        
        .print-body {
          page-break-inside: avoid;
        }
        
        ${this.options.customStyles || ''}
      }
    `;

    document.head.appendChild(style);
  }

  private removePrintStyles(): void {
    const style = document.getElementById('dynamic-print-styles');
    if (style) {
      style.remove();
    }
  }

  // Service methods for external use
  printElement(element: HTMLElement, options?: PrintOptions): void {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = element.innerHTML;
    tempDiv.className = 'print-content';

    document.body.appendChild(tempDiv);

    if (options) {
      this.options = { ...this.defaultOptions, ...options };
      this.applyPrintStyles();
    }

    window.print();
    document.body.removeChild(tempDiv);
    this.removePrintStyles();
  }

  printHTML(html: string, inMyWindow: boolean, options?: PrintOptions): void {
    var printWindow: any = null;
    if (inMyWindow) {
      printWindow = window;
    }
    else {
      printWindow = window.open('', '_blank');
    }
    if (printWindow) {
      const printOptions = { ...this.defaultOptions, ...options };
      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>${printOptions.title || 'Print'}</title>
            <style>
              @media print {
                @page {
                  size: ${printOptions.paperSize} ${printOptions.orientation};
                  margin: ${printOptions.margins};
                }
              }
              body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 20px;
              }
              ${printOptions.customStyles || ''}
            </style>
          </head>
          <body>
            ${printOptions.headerContent || ''}
            ${printOptions.title ? `<h1 style="text-align: center;">${printOptions.title}</h1>` : ''}
            ${printOptions.showDate ? `<p style="text-align: left; color: #666;">تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}</p>` : ''}
            ${html}
            ${printOptions.footerContent || ''}
          </body>
        </html>
      `);
      this._tools.waitExecuteFunction(100, () => {
        printWindow.document.close();
        printWindow.print();
      })

    }
  }
}
