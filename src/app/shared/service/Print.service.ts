import { Injectable } from '@angular/core';
import { PrintComponent } from '../components/print/print.component';
import { PrintOptions } from '../interface/PrintOptions ';
import { RequestOrder } from '../Types/Request';
import { RealItem } from '../Types/RealItem';
import { OperationOrder } from '../Types/OperationOrder';
import { Tools } from './Tools.service';
import { InvoiceOrder } from '../Types/InvoiceOrder';

@Injectable({
    providedIn: 'root'
})

export class PrintService {
    constructor(private _Tools: Tools) { }
    Open: boolean = false;
    OpenPrint() {
        this.Open = true;
    }
    ClosPrint() {
        this.Open = false;
    }
    printComponent!: PrintComponent
    printElement(element: HTMLElement, options?: PrintOptions): void {
        this.printComponent.printElement(element, options);
    }

    async printHTML(html: string, inMyWindow: boolean, options?: PrintOptions): Promise<void> {
        this.OpenPrint();
        await this.printComponent.printHTML(html, inMyWindow, options);
    }

    async printTable(data: any[], Source: string[], columns: string[], title?: string): Promise<void> {
        let html = `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            ${columns.map(col => `<th style="border: 1px solid #ddd; padding: 12px; text-align: right;">${col}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${Source.map(col => `<td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${row[col] || ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

        await this.printHTML(html, window.screen.width < 800, { title: title || 'تقرير' });
    }

    printInvoice(_Invoice: InvoiceOrder, InMyWindow = false, showPrice = true): string {
        var htmlRes = "";
        console.log(_Invoice)
        if (showPrice) {
            const html = `<div class="invoice-container" style="width: 300px; margin: auto; font-family: monospace; font-size: 12px; border: 0.5px solid #ccc; border-radius: 4px; overflow: hidden;">

  <!-- Header -->
  <div style="background: #444; color: white; padding: 14px 10px; text-align: center;">
    <div style="font-size: 16px; letter-spacing: 2px;">Rivo</div>
    <div style="font-size: 11px; opacity: 0.7; margin-top: 3px;">01018325475</div>
  </div>

  <!-- Invoice Info -->
  <div style="padding: 8px 12px; text-align: center; border-bottom: 1px dashed #ccc; font-size: 11px; color: #888;">
    <div>فاتورة رقم: #${_Invoice.ID}</div>
    <div>${this._Tools.DateTime.convertDataToMoment(_Invoice.DATE_TIME).format('DD/MM/yyyy')}</div>
  </div>

  <!-- Customer -->
  <div style="padding: 8px 12px; border-bottom: 1px dashed #ccc; font-size: 11px;">
    <div style="display:flex; justify-content:space-between;"><span style="color:#888">العميل:</span><span>${_Invoice.CUSTOMER_NAME}</span></div>
    <div style="display:flex; justify-content:space-between; margin-top:3px;"><span style="color:#888">الدفع:</span><span>${_Invoice.PAYMENT_NAME ?? ''}</span></div>
  </div>

  <!-- Items -->
  <div style="padding: 8px 12px; border-bottom: 1px dashed #ccc;">
    <div style="text-align:center; font-size:10px; color:#888; margin-bottom:6px;">─── الأصناف ───</div>
    <table style="width:100%; font-size:10px; border-collapse:collapse;">
      <thead>
        <tr style="color:#888;">
          <th style="text-align:right; font-weight:normal;">الصنف</th>
          <th style="text-align:center; font-weight:normal;">كمية</th>
          <th style="text-align:center; font-weight:normal;">سعر</th>
          <th style="text-align:center; font-weight:normal;">مجموع</th>
        </tr>
      </thead>
      <tbody>
        ${_Invoice.ITEMS.map((item, i) => `
        <tr>
          <td style="text-align:right; padding:3px 0;">${i + 1} - ${item.NAME}</td>
          <td style="text-align:center;">${item.COUNT.toFixed(2)}</td>
          <td style="text-align:center;">${item.PRICE.toFixed(2)}</td>
          <td style="text-align:center;">${item.TOTAL_COUNT.toFixed(2)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <!-- Summary -->
  <div style="padding: 8px 12px; border-bottom: 1px dashed #ccc; font-size: 11px;">
    <div style="display:flex; justify-content:space-between; padding:2px 0;"><span style="color:#888">الإجمالي:</span><span>${_Invoice.TOTAL} جنيه</span></div>
    <div style="display:flex; justify-content:space-between; padding:2px 0;"><span style="color:#888">خصم (${_Invoice.DESCOUND_PERCENT}%):</span><span>${_Invoice.DESCOUND_VALUE} جنيه</span></div>
    <div style="display:flex; justify-content:space-between; padding:2px 0;"><span style="color:#888">بعد الخصم:</span><span>${_Invoice.PRICE_AFTER_DESCOUND} جنيه</span></div>
    <div style="display:flex; justify-content:space-between; padding:2px 0;"><span style="color:#888">المدفوع:</span><span>${_Invoice.PAYMENT} جنيه</span></div>
    <div style="display:flex; justify-content:space-between; padding:4px 0; border-top:1px solid #ddd; margin-top:3px; font-size:13px; font-weight:500;">
      <span>المتبقي:</span><span>${_Invoice.TOTAL_AFTER_PAYMENT} جنيه</span>
    </div>
  </div>

  <!-- QR -->
  <div style="padding: 10px; text-align: center; border-bottom: 1px dashed #ccc;">
    <img src="${_Invoice.QRImage ?? ''}" style="width:60px; height:60px;" alt="QR">
    <div style="font-size: 9px; color: #888; margin-top: 4px;">رمز الاستجابة السريعة</div>
  </div>

  <!-- Footer -->
  <div style="padding: 10px; text-align: center; font-size: 12px;">
    شكراً لتعاملكم معنا
  </div>

</div>`;
            htmlRes = html;
        }
        else {
            const html = `<div class="invoice-container" style="width: 280px; margin: auto; font-family: monospace; font-size: 12px;">

  <!-- Header -->
  <div class="compact-header" style="text-align: center; background: #222; color: white; padding: 12px 10px; margin-bottom: 0; border-radius: 0;">
    <h1 style="font-size: 15px; letter-spacing: 1px;">Rivo</h1>
    <div style="font-size: 11px; opacity: 0.75;">01018325475</div>
  </div>

  <!-- Info Row -->
  <div style="padding: 8px 10px; border-bottom: 1px dashed #ccc; font-size: 11px;">
    <div>فاتورة رقم: #${_Invoice.ID} | ${this._Tools.DateTime.EditFormateData(_Invoice.DATE_TIME, 'DD-MM-YYYY')}</div>
    <div>العميل: ${_Invoice.CUSTOMER_NAME}</div>
  </div>

  <!-- Items -->
  <div style="padding: 8px 10px; border-bottom: 1px dashed #ccc;">
    <div style="text-align: center; font-size: 10px; color: #888; margin-bottom: 6px;">─── تفاصيل الطلب ───</div>
    <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
      <thead>
        <tr style="color: #888;">
          <th style="text-align: right; font-weight: normal;">الصنف</th>
          <th style="text-align: center; font-weight: normal;">الوحدة</th>
          <th style="text-align: center; font-weight: normal;">الكمية</th>
        </tr>
      </thead>
      <tbody>
        ${_Invoice.ITEMS.map((item, i) => `
        <tr>
          <td style="text-align: right; padding: 3px 0;">${i + 1} - ${item.NAME}</td>
          <td style="text-align: center;">${item.UNIT}</td>
          <td style="text-align: center;">${item.COUNT.toFixed(2)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <!-- QR + Signature -->
  <div style="padding: 8px 10px; text-align: center; font-size: 10px; border-bottom: 1px dashed #ccc;">
    <img src="${_Invoice.QRImage ?? ''}" style="width: 50px; height: 50px;" alt="QR">
    <div style="margin-top: 6px;">التوقيع: _______________</div>
  </div>

  <!-- Footer -->
  <div style="padding: 10px; text-align: center; font-size: 12px;">
    شكراً لتعاملكم معنا
  </div>

</div>`;
            htmlRes = html;
        }
        this.printHTML(htmlRes, InMyWindow, {
            title: `فاتورة رقم ${_Invoice.ID}`,
            orientation: 'portrait',
            paperSize: 'A4'
        });
        return htmlRes
    }
    async printRequest(
        _Request: RequestOrder,
        Totals: { Total: number, TotalAfterDiscount: number, TotalAfterDeposit: number, DeliveryCharge: number },
        InSumPage: boolean = false
    ): Promise<void> {

        // Format dates
        const sendDate = new Date(_Request.SEND_DATE).toLocaleDateString('en-US');
        const receiveDate = new Date(_Request.RESAVE_DATE).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Generate items table rows
        const itemsTableRows = _Request.ITEMS.map(item => `
    <tr>
      <td>${item.ID} - ${item.NAME}</td>
      <td>${item.UNIT}</td>
      <td>${item.COUNT}</td>
      <td>${item.PRICE.toFixed(2)}</td>
      <td>${item.TOTAL_COUNT.toFixed(2)}</td>
      <td>${item.COMMENTS || '-'}</td>
    </tr>
  `).join('');

        const html = `<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Invoice #${_Request.ID}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 11px;
      line-height: 1.3;
      color: #000;
      background: #fff;
    }
    
    .invoice {
      max-width: 210mm;
      margin: 0 auto;
      padding: 8mm;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 2px solid #000;
    }
    
    .company-name {
      font-size: 16px;
      font-weight: bold;
    }
    
    .invoice-title {
      background: #000;
      color: #fff;
      padding: 6px 12px;
      margin: 8px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .invoice-title h1 {
      font-size: 14px;
      font-weight: bold;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 8px;
    }
    
    .info-box {
      border: 1px solid #000;
      padding: 6px 8px;
    }
    
    .info-box h3 {
      font-size: 11px;
      font-weight: bold;
      margin-bottom: 4px;
      background: #000;
      color: #fff;
      padding: 2px 6px;
      margin: -6px -8px 4px;
    }
    
    .info-row {
      display: flex;
      font-size: 10px;
      margin: 2px 0;
    }
    
    .info-label {
      font-weight: bold;
      min-width: 100px;
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 10px;
    }
    
    .items-table thead {
      background: #000;
      color: #fff;
    }
    
    .items-table th,
    .items-table td {
      border: 1px solid #000;
      padding: 4px 6px;
      text-align: center;
    }
    
    .items-table th {
      font-weight: bold;
      font-size: 10px;
    }
    
    .items-table td:first-child {
      text-align: left;
    }
    
    .summary {
      margin-top: 8px;
      display: flex;
      justify-content: flex-end;
    }
    
    .summary-box {
      border: 2px solid #000;
      padding: 6px 10px;
      min-width: 280px;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      font-size: 11px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .summary-row:last-child {
      border-bottom: none;
      font-weight: bold;
      font-size: 12px;
      margin-top: 3px;
      padding-top: 5px;
      border-top: 2px solid #000;
    }
    
    .summary-label {
      font-weight: bold;
    }
    
    @media print {
      .invoice {
        padding: 0;
      }
      
      body {
        font-size: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <!-- Header -->
    <div class="header">
      <div>
        <div class="company-name">Rivo</div>
      </div>
      <div style="font-size: 10px; text-align: right;">
        <div><strong>Date:</strong> ${sendDate}</div>
        <div><strong>Delivery Date:</strong> ${receiveDate}</div>
      </div>
    </div>
    
    <!-- Invoice Title -->
    <div class="invoice-title">
      <h1>Order #${_Request.ID}</h1>
      <span>Branch: ${_Request.PLACE_NAME || 'Cairo'}</span>
    </div>
    
    <!-- Customer & Payment Info -->
    <div class="info-grid">
      <div class="info-box">
        <h3>Customer Information</h3>
        <div class="info-row">
          <span class="info-label">Company:</span>
          <span>${_Request.CUSTOMER_NAME || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Name:</span>
          <span>${_Request.CUSTOMER_BUY_NAME || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Phone:</span>
          <span>${_Request.PHONE || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Address:</span>
          <span>${_Request.ADDRESS || 'N/A'}</span>
        </div>
      </div>
      
      <div class="info-box">
        <h3>Payment Information</h3>
        <div class="info-row">
          <span class="info-label">Payment Method:</span>
          <span>${_Request.PAYMENT_NAME || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Deposit:</span>
          <span>${_Request.DEPOST?.toFixed(2) || '0.00'} EGP</span>
        </div>
        <div class="info-row">
          <span class="info-label">Discount Rate:</span>
          <span>${_Request.DESCOUND_PERCENT}%</span>
        </div>
        <div class="info-row">
          <span class="info-label">Seller:</span>
          <span>${_Request.SELLER || 'N/A'}</span>
        </div>
      </div>
    </div>
    
    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th>Item</th>
          <th style="width: 60px;">Unit</th>
          <th style="width: 50px;">Qty</th>
          <th style="width: 60px;">Price</th>
          <th style="width: 70px;">Total</th>
          <th style="width: 120px;">Notes</th>
        </tr>
      </thead>
      <tbody>
        ${itemsTableRows}
      </tbody>
    </table>
    
    <!-- Summary -->
    <div class="summary">
      <div class="summary-box">
        <div class="summary-row">
          <span class="summary-label">Reservation Price:</span>
          <span>${Totals.Total.toFixed(2)} EGP</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Discount Value:</span>
          <span>-${(Totals.Total - Totals.TotalAfterDiscount).toFixed(2)} EGP</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Price After Discount:</span>
          <span>${Totals.TotalAfterDiscount.toFixed(2)} EGP</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Delivery Charge:</span>
          <span>${Totals.DeliveryCharge.toFixed(2)} EGP</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Price After Discount And Delivery:</span>
          <span>${(Totals.TotalAfterDiscount + Totals.DeliveryCharge).toFixed(2)} EGP</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Remaining After Deposit:</span>
          <span>${(Totals.TotalAfterDiscount + Totals.DeliveryCharge - (_Request.DEPOST || 0)).toFixed(2)} EGP</span>
        </div>
      </div>
    </div>
    
    <!-- Notes -->
    ${_Request.NOTS ? `
    <div style="margin-top: 12px; padding: 8px; border: 1px solid #ccc; background: #f9f9f9;">
      <strong>Notes:</strong> ${_Request.NOTS}
    </div>
    ` : ''}
  </div>
</body>
</html>
  `;

        await this.printHTML(html, InSumPage, {
            title: `Order #${_Request.ID}`,
            orientation: 'portrait',
            paperSize: 'A4'
        });
    }
    async printOperation(_Operation: OperationOrder): Promise<void> {
        const html = `
    <div style="max-width: 800px; margin: 0 auto; font-family: 'Arial', sans-serif; font-size: 14px; color: #000;">
  
  <!-- رأس الصفحة -->
  <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
    <div>
      <!-- اسم الشركة ورقم التليفون يكتب يدويًا أو يُملأ ديناميكيًا -->
      <p style="margin: 4px 0;"><strong>اسم الشركة:</strong> Rivo</p>
    </div>
    <div>
      <img src="favicon.ico" alt="Logo">
    </div>
  </header>

  <!-- عنوان الطلبية -->
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="margin: 0; font-size: 22px;">عملية مخزنية رقم: ${_Operation.ID}</h2>
    <p style="margin: 5px 0;">تاريخ التسجيل: ${this._Tools.DateTime.convertDataToMoment(_Operation.DATE_TIME).format('DD/MM/yyyy')}</p>
  </div>

  <!-- بيانات العملية -->
  <section style="margin-bottom: 15px;">
    <h3 style="margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">بيانات المخزن</h3>
    <p style="margin: 4px 0;"><strong>نوع العملية:</strong> ${_Operation.TYPE == 1 ? 'اضافة' : _Operation.TYPE == 2 ? 'سحب' : _Operation.TYPE == 3 ? 'تحويل' : ''}</p>
    <p style="margin: 4px 0;"><strong>اسم المخزن:</strong> ${_Operation.WAREHOUSE_ADDED_NAME}</p>
    <p style="margin: 4px 0;"><strong>اسم المخزن المحول الية:</strong> ${_Operation?.WAREHOUSE_GET_NAME ?? ''}</p>
  </section>

  <!-- جدول الأصناف -->
  <section>
    <h3 style="margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">تفاصيل اصناف العملية</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <thead>
        <tr style="background-color: #eee;">
          <th style="border: 1px solid #ccc; padding: 8px;">الصنف</th>
          <th style="border: 1px solid #ccc; padding: 8px;">الوحدة</th>
          <th style="border: 1px solid #ccc; padding: 8px;">الكمية</th>
        </tr>
      </thead>
      <tbody>
        ${_Operation.ITEMS.map((item: RealItem, index) => `
          <tr>
            <td style="border: 1px solid #ccc; padding: 6px;"><span>${index + 1}</span> - ${item.NAME}</td>
            <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${item.UNIT}</td>
            <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${item.COUNT}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>


  <!-- الختم / التوقيع -->
  <footer style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px; border-top: 1px solid #ccc; padding-top: 10px;">
    <div style="text-align: left;">
      <p><strong>الختم / التوقيع:</strong></p>
      <div style="width: 160px; height: 60px; border: 1px dashed #999;"></div>
    </div>
    <div style="text-align: right;">
      <p style="font-size: 12px; color: #666;">شكراً لتعاملكم معنا</p>
    </div>
  </footer>
</div>

    `;

        await this.printHTML(html, true, {
            title: `عملية مخزنية رقم ${_Operation.ID}`,
            orientation: 'portrait',
            paperSize: 'A4'
        });

    }
}