import { Injectable } from '@angular/core';
import { PrintComponent } from '../components/print/print.component';
import { PrintOptions } from '../interface/PrintOptions ';
import { RequestOrder } from '../Types/Request';
import { RealItem } from '../Types/RealItem';
import { OperationOrder } from '../Types/OperationOrder';
import { Tools } from './Tools.service';

@Injectable({
  providedIn: 'root'
})

export class PrintService {
  constructor(private _Tools:Tools){}
  Open:boolean = false;
  OpenPrint()
  {
    this.Open=true;
  }
  ClosPrint()
  {
    this.Open=false;
  }
  printComponent!:PrintComponent
  printElement(element: HTMLElement, options?: PrintOptions): void {
    this.printComponent.printElement(element, options);
  }

  printHTML(html: string, options?: PrintOptions): void {
    this.OpenPrint();
    this.printComponent.printHTML(html, options);
  }

  printTable(data: any[], columns: string[], title?: string): void {
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
              ${columns.map(col => `<td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${row[col] || ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    this.printHTML(html, { title: title || 'تقرير' });
  }

  printInvoice(invoice: any): void {
    const html = `
      <div style="max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2>فاتورة رقم: ${invoice.number}</h2>
          <p>تاريخ: ${invoice.date}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3>بيانات العميل:</h3>
          <p><strong>الاسم:</strong> ${invoice.customer.name}</p>
          <p><strong>الهاتف:</strong> ${invoice.customer.phone}</p>
          <p><strong>العنوان:</strong> ${invoice.customer.address}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #ddd; padding: 12px;">الصنف</th>
              <th style="border: 1px solid #ddd; padding: 12px;">الكمية</th>
              <th style="border: 1px solid #ddd; padding: 12px;">السعر</th>
              <th style="border: 1px solid #ddd; padding: 12px;">المجموع</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item: any) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.price}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.total}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="text-align: left; margin-top: 30px;">
          <p><strong>المجموع الفرعي: ${invoice.subtotal}</strong></p>
          <p><strong>الضريبة: ${invoice.tax}</strong></p>
          <p><strong>المجموع الكلي: ${invoice.total}</strong></p>
        </div>
      </div>
    `;
    
    this.printHTML(html, { 
      title: `فاتورة رقم ${invoice.number}`,
      orientation: 'portrait',
      paperSize: 'A4'
    });
  }
  printRequest(_Request: RequestOrder,Totals:{Total:number,TotalAfterDescound:number,TotalAfterDepost:number}): void {
    const html = `
    <div style="max-width: 800px; margin: 0 auto; font-family: 'Arial', sans-serif; font-size: 14px; color: #000;">
  
  <!-- رأس الصفحة -->
  <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
    <div>
      <!-- اسم الشركة ورقم التليفون يكتب يدويًا أو يُملأ ديناميكيًا -->
      <p style="margin: 4px 0;"><strong>اسم الشركة:</strong> سويت ماجيك</p>
      <p style="margin: 4px 0;"><strong>رقم التليفون:</strong> 01140993467</p>
    </div>
    <div>
      <img src="favicon.ico" alt="Logo" >
    </div>
  </header>

  <!-- عنوان الطلبية -->
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="margin: 0; font-size: 22px;">طلبية رقم: ${_Request.ID}</h2>
    <p style="margin: 5px 0;">التاريخ: ${this._Tools.DateTime.convertDataToMoment(_Request.SEND_DATE).format('DD/MM/yyyy')}</p>
  </div>

  <!-- بيانات العميل -->
  <section style="margin-bottom: 15px;">
    <h3 style="margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">بيانات العميل</h3>
    <p style="margin: 4px 0;"><strong>الاسم:</strong> ${_Request.CUSTOMER_NAME}</p>
    <p style="margin: 4px 0;"><strong>العربون:</strong> ${_Request.DEPOST}</p>
    <p style="margin: 4px 0;"><strong>طريقة الدفع:</strong> ${_Request?.PAYMENT_NAME ?? ''}</p>
  </section>

  <!-- جدول الأصناف -->
  <section>
    <h3 style="margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">تفاصيل الطلبية</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <thead>
        <tr style="background-color: #eee;">
          <th style="border: 1px solid #ccc; padding: 8px;">الصنف</th>
          <th style="border: 1px solid #ccc; padding: 8px;">الوحدة</th>
          <th style="border: 1px solid #ccc; padding: 8px;">الكمية</th>
          <th style="border: 1px solid #ccc; padding: 8px;">السعر</th>
          <th style="border: 1px solid #ccc; padding: 8px;">المجموع</th>
        </tr>
      </thead>
      <tbody>
        ${_Request.ITEMS.map((item: RealItem,index) => `
          <tr>
            <td style="border: 1px solid #ccc; padding: 6px;"><span>${index+1}</span> - ${item.NAME}</td>
            <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${item.UNIT}</td>
            <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${item.COUNT}</td>
            <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${item.PRICE}</td>
            <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${item.TOTAL_COUNT}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>

  <!-- ملخص الحساب -->
  <section style="margin-top: 20px;">
    <h3 style="margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">الملخص المالي</h3>
    <p style="margin: 4px 0;"><strong>الإجمالي:</strong> ${Totals.Total}</p>
    <p style="margin: 4px 0;"><strong>الإجمالي بعد الخصم:</strong> ${Totals.TotalAfterDescound}</p>
    <p style="margin: 4px 0;"><strong>نسبة الخصم:</strong> ${_Request.DESCOUND_PERCENT} %</p>
    <p style="margin: 4px 0;"><strong>العربون:</strong> ${_Request.DEPOST}</p>
    <p style="margin: 4px 0;"><strong>المتبقي:</strong> ${Totals.TotalAfterDepost}</p>
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
    
    this.printHTML(html, { 
      title: `طلبية رقم ${_Request.ID}`,
      orientation: 'portrait',
      paperSize: 'A4'
    });
  }
  printOperation(_Operation: OperationOrder): void {
    const html = `
    <div style="max-width: 800px; margin: 0 auto; font-family: 'Arial', sans-serif; font-size: 14px; color: #000;">
  
  <!-- رأس الصفحة -->
  <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
    <div>
      <!-- اسم الشركة ورقم التليفون يكتب يدويًا أو يُملأ ديناميكيًا -->
      <p style="margin: 4px 0;"><strong>اسم الشركة:</strong> سويت ماجيك</p>
      <p style="margin: 4px 0;"><strong>رقم التليفون:</strong> 01140993467</p>
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
    <p style="margin: 4px 0;"><strong>نوع العملية:</strong> ${_Operation.TYPE==1?'اضافة':_Operation.TYPE==2?'سحب':_Operation.TYPE==3?'تحويل':''}</p>
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
        ${_Operation.ITEMS.map((item: RealItem,index) => `
          <tr>
            <td style="border: 1px solid #ccc; padding: 6px;"><span>${index+1}</span> - ${item.NAME}</td>
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
    
    this.printHTML(html, { 
      title: `عملية مخزنية رقم ${_Operation.ID}`,
      orientation: 'portrait',
      paperSize: 'A4'
    });
  }
}