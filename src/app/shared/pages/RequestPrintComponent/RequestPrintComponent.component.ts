import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import QRCode from 'qrcode';
import { RequestOrder } from '../../Types/Request';
import { ActivatedRoute } from '@angular/router';
import { Tools } from '../../service/Tools.service';
import { Item } from '../../Types/Item';
@Component({
  selector: 'app-RequestPrintComponent',
  templateUrl: './RequestPrintComponent.component.html',
  styleUrls: ['./RequestPrintComponent.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RequestPrintComponentComponent implements OnInit, OnDestroy {
  @Input() orders: RequestOrder[] = [];
  Customers: Array<any> = [];
  Placses: Array<any> = [];
  Category: Array<any> = [];
  Departs: Array<any> = [];
  ITEMS: Array<Item> = [];
  DEPART_SELECTED_NAME: string = '';
  private qrCodes: Map<number, string> = new Map();
  constructor(private _ActiveRouter: ActivatedRoute, private _tools: Tools) {

  }
  ngOnDestroy() {
    this._tools.transfareSherdData.sherdMood = false;
  }
  async ngOnInit() {
    this.Category = await this._tools.Network.getAsync("Category") as Array<any>;
    this.Departs = await this._tools.Network.getAsync("Depart") as Array<any>;
    this.ITEMS = await this._tools.Network.getAsync("Items") as Array<any>;
    this.Placses = await this._tools.Network.getAsync<any>("Place");
    this.Customers = await this._tools.Network.getAsync<any>("Customer");
    this._tools.waitExecuteFunction(100, () => {
      this._ActiveRouter.queryParams.subscribe({
        next: async ({ REQ }) => {
          this._tools.transfareSherdData.sherdMood = true;
          if (REQ != "") {
            let Req = JSON.parse(REQ)
            this.DEPART_SELECTED_NAME = Req.DEPART_SELECTED_NAME;
            var data = await this._tools.Network.postAsync<any>(`Report/GetOrdersReservations`, Req);
            if (data != undefined && Array.isArray(data)) {
              this.orders = data;
              this.orders.forEach(ord => {
                ord.ITEMS.forEach(item => {
                  item.NAME = this.ITEMS.find(x => x.ID == item.ITEM_ID)?.NAME ?? "";
                  item.CATEGORY = this.Category.find(x => x.ID == this.ITEMS.find(x => x.ID == item.ITEM_ID)?.CATEGORY)?.NAME ?? "";
                  item.Depart = this.Departs.find(x => x.ID == this.Category.find(cat => cat.ID == this.ITEMS.find(x => x.ID == item.ITEM_ID)?.CATEGORY).DEPART_ID)?.NAME ?? "";
                })
                this.RenderItem(ord);
              })
            }
            // Generate QR codes for all orders
            for (const order of this.orders) {
              const qrData = JSON.stringify({
                orderID: order.ID,
                customer: order.CUSTOMER_NAME,
                total: order.TOTAL_AFTER_DEPOST,
                date: order.SEND_DATE
              });
              try {
                const qrCode = await QRCode.toDataURL(qrData);
                this.qrCodes.set(order.ID, qrCode);
              } catch (error) {
                console.error('Error generating QR code:', error);
              }
            }
          }

        }
      })
    })

  }
  RenderItem(item: RequestOrder) {
    item.SEND_DATE = this._tools.DateTime.getDataFromJson(item.SEND_DATE as any)
    item.RESAVE_DATE = this._tools.DateTime.getDataFromJson(item.RESAVE_DATE as any)
    item.CUSTOMER_NAME = this.Customers.find(Z => Z.ID == item.CUSTOMER)?.NAME ?? '';
    item.PLACE_NAME = this.Placses.find(Z => Z.ID == item.PLACE)?.NAME ?? '';
    item.TOTAL = item.ITEMS.reduce((num, item) => { return num += (item.COUNT * item.PRICE) }, 0);
    item.PRICE_AFTER_DESCOUND = item.TOTAL - (item.TOTAL * (item.DESCOUND_PERCENT / 100));
    item.TOTAL_AFTER_DEPOST = item.PRICE_AFTER_DESCOUND - item.DEPOST;
  }
  getQRCode(orderId: number): string {
    return this.qrCodes.get(orderId) || 'data:image/png;base64,';
  }
}
