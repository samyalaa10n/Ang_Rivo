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
        if (showPrice) {
            const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاتورة</title>
  <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', 'Tahoma', Arial, sans-serif;
            background: #f0f0f0;
            min-height: 100vh;
            padding: 20px;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: #666666;
            color: white;
            padding: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .company-info h1 {
            font-size: 28px;
            margin-bottom: 8px;
            font-weight: 700;
        }
        
        .company-info p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .logo-placeholder {
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.15);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            border: 2px solid rgba(255,255,255,0.3);
        }
        
        .invoice-title {
            background: #ffffff;
            padding: 25px 30px;
            border-bottom: 3px solid #666666;
        }
        
        .invoice-title h2 {
            font-size: 24px;
            color: #2d3748;
            margin-bottom: 8px;
        }
        
        .invoice-date {
            color: #718096;
            font-size: 16px;
        }
        
        .content {
            padding: 30px;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section-title {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
            display: flex;
            align-items: center;
        }
        
        .section-title::before {
            content: '';
            width: 4px;
            height: 20px;
            background: #000000;
            border-radius: 2px;
            margin-left: 10px;
        }
        
        .customer-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        
        .info-item {
            background: #ffffff;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #000000;
            border: 1px solid #e0e0e0;
        }
        
        .info-label {
            color: #718096;
            font-size: 14px;
            margin-bottom: 5px;
        }
        
        .info-value {
            color: #2d3748;
            font-size: 16px;
            font-weight: 600;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        
        .items-table th {
            background: #000000;
            color: white;
            padding: 15px;
            text-align: center;
            font-weight: 600;
            font-size: 14px;
        }
        
        .items-table td {
            padding: 12px 15px;
            text-align: center;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
        }
        
        .items-table tr:nth-child(even) {
            background: #f9f9f9;
        }
        
        .items-table tr:hover {
            background: #f0f0f0;
        }
        
        .item-name {
            text-align: right !important;
            font-weight: 500;
        }
        
        .summary {
            background: #ffffff;
            padding: 25px;
            border-radius: 12px;
            border: 2px solid #000000;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .summary-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .summary-item:last-child {
            border-bottom: none;
            font-weight: 700;
            font-size: 18px;
            color: #2d3748;
        }
        
        .summary-label {
            color: #718096;
            font-weight: 500;
        }
        
        .summary-value {
            color: #2d3748;
            font-weight: 600;
        }
        
        .footer {
            background: #ffffff;
            padding: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 2px solid #000000;
        }
        
        .signature-section {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .signature-box {
            width: 120px;
            height: 60px;
            border: 2px dashed #cbd5e0;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #a0aec0;
            font-size: 12px;
            background: white;
        }
        
        .qr-code-section {
            text-align: center;
        }
        
        .qr-code-placeholder {
            width: 100px;
            height: 100px;
            border: 2px solid #667eea;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
            color: #667eea;
            font-size: 12px;
            text-align: center;
            font-weight: 600;
        }
        
        .qr-label {
            color: #718096;
            font-size: 12px;
        }
        
        .thank-you {
            text-align: center;
            color: #667eea;
            font-size: 16px;
            font-weight: 600;
        }
        
        }
        
        /* Mobile View Styles */
        .mobile-view {
            max-width: 375px !important;
            margin: 0 auto;
            box-shadow: 0 0 0 8px #2d3748;
            border-radius: 20px;
            position: relative;
        }
        
        .mobile-view::before {
            content: '📱 Mobile View';
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: #2d3748;
            color: white;
            padding: 5px 15px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 600;
        }
        
        /* Desktop View Styles */
        .desktop-view {
            position: relative;
        }
        
        .desktop-view::before {
            content: '🖥️ Desktop View';
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: #667eea;
            color: white;
            padding: 5px 15px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 600;
        }
        
        /* Force mobile layout */
        .mobile-view .header {
            flex-direction: column !important;
            text-align: center !important;
            gap: 15px !important;
            padding: 20px !important;
        }
        
        .mobile-view .company-info h1 {
            font-size: 22px !important;
        }
        
        .mobile-view .logo-placeholder {
            width: 60px !important;
            height: 60px !important;
        }
        
        .mobile-view .content {
            padding: 20px !important;
        }
        
        .mobile-view .customer-info {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
        }
        
        .mobile-view .section {
            margin-bottom: 20px !important;
        }
        
        .mobile-view .items-table th,
        .mobile-view .items-table td {
            padding: 8px 5px !important;
            font-size: 11px !important;
        }
        
        .mobile-view .section-title {
            font-size: 16px !important;
        }
        
        .mobile-view .summary {
            padding: 15px !important;
        }
        
        .mobile-view .footer {
            flex-direction: column !important;
            gap: 15px !important;
            text-align: center !important;
            padding: 20px !important;
        }
        
        .mobile-view .signature-section {
            flex-direction: column !important;
            gap: 10px !important;
        }
        
        .mobile-view .qr-code-placeholder {
            width: 80px !important;
            height: 80px !important;
        }
        
        /* Button Styles */
        .view-toggle-btn {
            transition: all 0.3s ease;
            transform: scale(1);
        }
        
        .view-toggle-btn:hover {
            transform: scale(1.05);
        }
        
        .view-toggle-btn.active {
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        @media (max-width: 768px) {
            .header {
                flex-direction: column;
                text-align: center;
                gap: 20px;
            }
            
            .footer {
                flex-direction: column;
                gap: 20px;
                text-align: center;
            }
            
            .signature-section {
                flex-direction: column;
            }
        }
    @media print {
    .btn-print{
      display: none;
    }
  }
    </style>
</head>
<body>
    <!-- Device View Toggle -->
    <div class='btn-print' style="text-align: center; margin-bottom: 20px;">
        <button onclick="print()" style="background: #764ba2; color: white; border: none; padding: 10px 20px; border-radius: 25px; margin: 0 5px; cursor: pointer; font-weight: 600;">طباعة</button>
        <button onclick="window.location.reload();" style="background: #764ba2; color: white; border: none; padding: 10px 20px; border-radius: 25px; margin: 0 5px; cursor: pointer; font-weight: 600;">اغلاق</button>
    </div>

    <div class="invoice-container" id="invoiceContainer">
        <!-- Header -->
        <header class="header">
            <div class="company-info">
               <h1>FOCUS CAFA</h1>
               <div>01018325475</div>
            </div>
            <div class="logo-placeholder">
                 <img src="favicon.ico" alt="Logo" >
            </div>
        </header>

        <!-- Invoice Title -->
        <div class="invoice-title">
            <h2>فاتورة رقم: #${_Invoice.ID}</h2>
            <p class="invoice-date">التاريخ: ${this._Tools.DateTime.convertDataToMoment(_Invoice.DATE_TIME).format('DD/MM/yyyy')}</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Customer Information -->
            <section class="section">
                <h3 class="section-title">بيانات العميل</h3>
                <div class="customer-info">
                    <div class="info-item">
                        <div class="info-label">اسم العميل</div>
                        <div class="info-value">${_Invoice?.CUSTOMER_NAME}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">المبلغ المدفوع</div>
                        <div class="info-value">${_Invoice.PAYMENT} جنيه</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">طريقة الدفع</div>
                        <div class="info-value">${_Invoice?.PAYMENT_NAME ?? ''}</div>
                    </div>
                </div>
            </section>

            <!-- Items Table -->
            <section class="section">
                <h3 class="section-title">تفاصيل الفاتورة</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>الصنف</th>
                            <th>الوحدة</th>
                            <th>الكمية</th>
                            <th>السعر</th>
                            <th>المجموع</th>
                        </tr>
                    </thead>
                    <tbody>
                      ${_Invoice.ITEMS.map((item: RealItem, index) => `
                        <tr>
                            <td class="item-name">${index + 1} - ${item.NAME}</td>
                            <td>${item.UNIT}</td>
                            <td>${item.COUNT.toFixed(2)}</td>
                            <td>${item.PRICE.toFixed(2)}</td>
                            <td>${item.TOTAL_COUNT.toFixed(2)}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </section>

            <!-- Financial Summary -->
            <section class="section">
                <h3 class="section-title">الملخص المالي</h3>
                <div class="summary">
                    <div class="summary-item">
                        <span class="summary-label">الإجمالي:</span>
                        <span class="summary-value">${_Invoice.TOTAL} جنيه</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">نسبة الخصم:</span>
                        <span class="summary-value">${_Invoice.DESCOUND_PERCENT}%</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">الإجمالي بعد الخصم:</span>
                        <span class="summary-value">${_Invoice.PRICE_AFTER_DESCOUND} جنيه</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">المدفوع:</span>
                        <span class="summary-value">${_Invoice.PAYMENT} جنيه</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">المتبقي:</span>
                        <span class="summary-value">${_Invoice.TOTAL_AFTER_PAYMENT} جنيه</span>
                    </div>
                </div>
            </section>
        </div>

        <!-- Footer -->
        <footer class="footer">  
            <div class="qr-code-section">
             <img style="width:100%;" src="${_Invoice.QRImage ?? ''}" alt="qr-code" >
                <p class="qr-label">رمز الاستجابة السريعة</p>
            </div>
            
            <div class="thank-you">
                شكراً لتعاملكم معنا ✨
            </div>
        </footer>
    </div>

    <script>
        function toggleView(viewType) {
            const container = document.getElementById('invoiceContainer');
            const desktopBtn = document.getElementById('desktopBtn');
            const mobileBtn = document.getElementById('mobileBtn');
            
            // Remove existing view classes
            container.classList.remove('mobile-view', 'desktop-view');
            desktopBtn.classList.remove('active');
            mobileBtn.classList.remove('active');
            
            // Add new view class
            if (viewType === 'mobile') {
                container.classList.add('mobile-view');
                mobileBtn.classList.add('active');
            } else {
                container.classList.add('desktop-view');
                desktopBtn.classList.add('active');
            }
        }
        
        // Set initial view
        document.addEventListener('DOMContentLoaded', function() {
            toggleView('desktop');
        });
    </script>
</body>
</html>
    `;
            htmlRes = html;
        }
        else {
            const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاتورة</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', 'Tahoma', Arial, sans-serif;
            background: white;
            font-size: 12px;
            line-height: 1.2;
        }
        
        .invoice-container {
            max-width: 100%;
            margin: 0;
            background: white;
            padding: 10px;
        }
        
        .compact-header {
            background: linear-gradient(135deg, #333 0%, #555 100%);
            color: white;
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            border-radius: 4px;
            height: 60px;
        }
        
        .header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .company-logo {
            width: 40px;
            height: 40px;
            object-fit: contain;
            border-radius: 4px;
            background: rgba(255,255,255,0.1);
            padding: 2px;
        }
        
        .company-details h1 {
            font-size: 18px;
            margin: 0;
            font-weight: 700;
        }
        
        .invoice-info {
            font-size: 11px;
            margin: 2px 0;
            opacity: 0.9;
        }
        
        .header-right {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .qr-section {
            text-align: center;
        }
        
        .qr-placeholder {
            width: 40px;
            height: 40px;
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.1);
            color: white;
            font-size: 8px;
            font-weight: 600;
        }
        
        .signature-area {
            text-align: center;
        }
        
        .signature-area span {
            display: block;
            font-size: 9px;
            margin-bottom: 3px;
            opacity: 0.8;
        }
        
        .sig-box {
            width: 60px;
            height: 25px;
            border: 1px dashed rgba(255,255,255,0.5);
            border-radius: 3px;
            background: rgba(255,255,255,0.05);
        }
        
        .content {
            padding: 0;
        }
        
        .section {
            margin-bottom: 8px;
        }
        
        .section-title {
            font-size: 13px;
            color: #333;
            margin-bottom: 5px;
            padding: 4px 8px;
            background: #f0f0f0;
            border-left: 3px solid #333;
            font-weight: 600;
        }
        
        .customer-info {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 5px;
        }
        
        .info-item {
            background: #f9f9f9;
            padding: 6px 10px;
            border-radius: 3px;
            border: 1px solid #e0e0e0;
            flex: 1;
            min-width: 150px;
        }
        
        .info-label {
            color: #666;
            font-size: 10px;
            margin-bottom: 2px;
            font-weight: 500;
        }
        
        .info-value {
            color: #333;
            font-size: 12px;
            font-weight: 600;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
            font-size: 11px;
        }
        
        .items-table th {
            background: #333;
            color: white;
            padding: 6px 8px;
            text-align: center;
            font-weight: 600;
            font-size: 11px;
            border: 1px solid #333;
        }
        
        .items-table td {
            padding: 4px 8px;
            text-align: center;
            border: 1px solid #ddd;
            font-size: 10px;
        }
        
        .items-table tr:nth-child(even) {
            background: #f9f9f9;
        }
        
        .item-name {
            text-align: right !important;
            font-weight: 500;
        }
        
        .summary {
            background: #f5f5f5;
            padding: 8px 12px;
            border: 2px solid #333;
            border-radius: 4px;
            margin-bottom: 8px;
        }
        
        .summary-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2px 0;
            font-size: 11px;
        }
        
        .summary-item:last-child {
            font-weight: 700;
            font-size: 13px;
            color: #333;
            border-top: 1px solid #ddd;
            padding-top: 4px;
            margin-top: 4px;
        }
        
        .footer {
            text-align: center;
            padding: 8px 0;
            border-top: 1px solid #ddd;
        }
        
        .thank-you {
            color: #333;
            font-size: 14px;
            font-weight: 600;
        }
        
        /* Print Styles */
        @media print {
            .btn-print {
                display: none !important;
            }
            
            body {
                margin: 0;
                padding: 0;
                font-size: 10px;
            }
            
            .invoice-container {
                max-width: 100%;
                margin: 0;
                padding: 5px;
                box-shadow: none;
            }
            
            .compact-header {
                padding: 8px 10px;
                height: 50px;
            }
            
            .company-logo {
                width: 30px;
                height: 30px;
            }
            
            .company-details h1 {
                font-size: 14px;
            }
            
            .invoice-info {
                font-size: 9px;
            }
            
            .qr-placeholder {
                width: 30px;
                height: 30px;
                font-size: 6px;
            }
            
            .sig-box {
                width: 45px;
                height: 20px;
            }
            
            .signature-area span {
                font-size: 8px;
            }
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
            .compact-header {
                flex-direction: column;
                text-align: center;
                gap: 8px;
                height: auto;
                padding: 8px;
            }
            
            .header-left {
                justify-content: center;
            }
            
            .header-right {
                gap: 10px;
            }
            
            .customer-info {
                flex-direction: column;
            }
            
            .info-item {
                min-width: auto;
            }
        }
    </style>
</head>
<body>
    <!-- Print Button -->
    <div class='btn-print' style="text-align: center; margin-bottom: 10px;">
        <button onclick="print()" style="background: #333; color: white; border: none; padding: 8px 16px; border-radius: 4px; margin: 0 5px; cursor: pointer; font-weight: 600; font-size: 12px;">طباعة</button>
        <button onclick="window.location.reload();" style="background: #666; color: white; border: none; padding: 8px 16px; border-radius: 4px; margin: 0 5px; cursor: pointer; font-weight: 600; font-size: 12px;">رجوع</button>
    </div>

    <div class="invoice-container">
        <!-- Compact Header with all company info -->
        <div class="compact-header">
            <div class="header-left">
                <img src="favicon.ico" alt="Logo" class="company-logo">
                <div class="company-details">
                    <h1>FOCUS CAFA</h1>
                    <div>01018325475</div>
                    <p class="invoice-info">فاتورة رقم: #${_Invoice.ID} | التاريخ: ${this._Tools.DateTime.EditFormateData(_Invoice.DATE_TIME,'DD-MM-YYYY')}</p>
                </div>
            </div>
            <div class="header-right">
                <div class="qr-section">
                     <img style="width:50px;" src="${_Invoice.QRImage ?? ''}" alt="qr-code" >
                </div>
                <div class="signature-area">
                    <span>التوقيع</span>
                    <div class="sig-box"></div>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Customer Information -->
            <section class="section">
                <h3 class="section-title">بيانات العميل</h3>
                <div class="customer-info">
                    <div class="info-item">
                        <div class="info-label">اسم العميل</div>
                        <div class="info-value">${_Invoice.CUSTOMER_NAME}</div>
                    </div>
                </div>
            </section>

            <!-- Items Table -->
            <section class="section">
                <h3 class="section-title">تفاصيل الفاتورة</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 50%;">الصنف</th>
                            <th style="width: 20%;">الوحدة</th>
                            <th style="width: 15%;">الكمية</th>
                        </tr>
                    </thead>
                    <tbody>
                     ${_Invoice.ITEMS.map((item: RealItem, index) => `
                        <tr>
                            <td class="item-name">${index + 1} - ${item.NAME}</td>
                            <td>${item.UNIT}</td>
                            <td>${item.COUNT.toFixed(2)}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </section>
        </div>

        <!-- Footer -->
        <footer class="footer">
            <div class="thank-you">
                شكراً لتعاملكم معنا ✨
            </div>
        </footer>
    </div>
</body>
</html>`;
            htmlRes = html;
        }
        this.printHTML(htmlRes, InMyWindow, {
            title: `فاتورة رقم ${_Invoice.ID}`,
            orientation: 'portrait',
            paperSize: 'A4'
        });
        return htmlRes
    }
    async printRequest(_Request: RequestOrder, Totals: { Total: number, TotalAfterDescound: number, TotalAfterDepost: number }, InSumPage: boolean = false): Promise<void> {
        const html = `
    <div style="max-width: 800px; margin: 0 auto; font-family: 'Arial', sans-serif; font-size: 14px; color: #000;">
  
  <!-- رأس الصفحة -->
  <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
    <div>
      <!-- اسم الشركة ورقم التليفون يكتب يدويًا أو يُملأ ديناميكيًا -->
      <p style="margin: 4px 0;"><strong>اسم الشركة:</strong>FOCUS CAFA</p>
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
        ${_Request.ITEMS.map((item: RealItem, index) => `
          <tr>
            <td style="border: 1px solid #ccc; padding: 6px;"><span>${index + 1}</span> - ${item.NAME}</td>
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

        await this.printHTML(html, InSumPage, {
            title: `طلبية رقم ${_Request.ID}`,
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
      <p style="margin: 4px 0;"><strong>اسم الشركة:</strong> FOCUS CAFA</p>
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