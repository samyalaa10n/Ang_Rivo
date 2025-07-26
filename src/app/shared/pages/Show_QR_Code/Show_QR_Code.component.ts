import { Component, OnInit } from '@angular/core';
import { Tools } from '../../service/Tools.service';
import { ActivatedRoute } from '@angular/router';
import { InvoiceOrder } from '../../Types/InvoiceOrder';
import QRCode from 'qrcode';
@Component({
  selector: 'app-Show_QR_Code',
  templateUrl: './Show_QR_Code.component.html',
  styleUrls: ['./Show_QR_Code.component.css']
})
export class Show_QR_CodeComponent implements OnInit {

  html: string = "";
  constructor(private _tools: Tools, private _ActiveRouter: ActivatedRoute) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this._tools.waitExecuteFunction(100, () => {
      this._ActiveRouter.queryParams.subscribe({
        next: async ({ TEXT, TYPE }) => {
          if (TEXT != "") {
            let Http = window.location.href.split(":")[0]
            let Link = `${Http}://${window.location.host}/#/Show_QR?TEXT=${TEXT}&TYPE=1`
            var image = await QRCode.toDataURL(Link);
            var CODE = await this._tools.Network.getAsync<string>("Invoices/DecryptText?token=" + encodeURIComponent(TEXT)) as string;
            var response = await this._tools.Network.getAsync<InvoiceOrder>("Invoices/GetByIdFullData?id=" + CODE) as InvoiceOrder;
            if (response?.ID > 0) {
              this._tools.waitExecuteFunction(100, () => {
                response.QRImage=image;
                this._tools.printService.printInvoice(response, true)
              })
            }
          }
        }
      })
    })
  };

}
