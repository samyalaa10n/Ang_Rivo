import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import QRCode from 'qrcode';
import { RequestOrder } from '../../Types/Request';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Tools } from '../../service/Tools.service';
import { Item } from '../../Types/Item';
import { Button } from "primeng/button";
import { FileManagerComponent } from "../../components/FileManager/FileManager.component";
@Component({
  selector: 'app-RequestPrint',
  templateUrl: './RequestPrint.component.html',
  styleUrls: ['./RequestPrint.component.css'],
  standalone: true,
  imports: [CommonModule, Button, RouterLink, FileManagerComponent]
})
export class RequestPrintComponent implements OnInit, OnDestroy {
  @Input() orders: RequestOrder[] = [];
  order: RequestOrder = { ID: 0, ROW_NUMBER: -1, CUSTOMER_NAME: '', CUSTOMER: 0, DEPOST: 0, DESCOUND_PERCENT: 0, SEND_DATE: new Date(), RESAVE_DATE: new Date(), ITEMS: [], PRICE_AFTER_DESCOUND: 0, NOTS: '', PAYMENT_TYPE: 0, CUSTOMER_BUY_NAME: '', SELLER: '', PHONE: '', PLACE: 0, ADDRESS: "", FILES: "", ISCANCELED: false, FROM_FACTORY: true, DILEVERY_CHARGE: 0 };
  onOrder: boolean = false;
  DEPART_SELECTED_NAME: string = '';
  private qrCodes: Map<number, string> = new Map();
  Customers: Array<any> = [];
  Placses: Array<any> = [];
  Category: Array<any> = [];
  Departs: Array<any> = [];
  ITEMS: Array<Item> = [];
  constructor(private _ActiveRouter: ActivatedRoute, private _tools: Tools) {

  }
  ngOnDestroy() {
    this._tools.transfareSherdData.sherdMood = false;
  }
  async ngOnInit() {
    this._tools.waitExecuteFunction(100, () => {
      this._ActiveRouter.queryParams.subscribe({
        next: async ({ REQ, TYPE }) => {
          this._tools.transfareSherdData.sherdMood = true;
          if (TYPE == "Report") {
            if (REQ != "") {
              this.Category = await this._tools.Network.getAsync("Category") as Array<any>;
              this.Departs = await this._tools.Network.getAsync("Depart") as Array<any>;
              this.ITEMS = await this._tools.Network.getAsync("Items") as Array<any>;
              this.Placses = await this._tools.Network.getAsync<any>("Place");
              this.Customers = await this._tools.Network.getAsync<any>("Customer");
              this.onOrder = false;
              let Req = JSON.parse(REQ)
              this.DEPART_SELECTED_NAME = Req.DEPART_SELECTED_NAME;
              var data = await this._tools.Network.postAsync<any>(`Report/GetOrdersReservations`, Req);
              if (data != undefined && Array.isArray(data)) {
                this.orders = data;
                //this.orders.sort((a,b)=>a.RESAVE_DATE>b.RESAVE_DATE);
                this.orders = this.orders.sort((a, b) =>
                  (a.PLACE_NAME || '').localeCompare(b.PLACE_NAME || '')
                );
                this.orders.forEach(ord => {
                  ord.ITEMS.forEach(item => {
                    item.NAME = this.ITEMS.find(x => x.ID == item.ITEM_ID)?.NAME ?? "";
                    item.CATEGORY = this.Category.find(x => x.ID == this.ITEMS.find(x => x.ID == item.ITEM_ID)?.CATEGORY)?.NAME ?? "";
                    item.DEPART = this.Departs.find(x => x.ID == this.Category.find(cat => cat.ID == this.ITEMS.find(x => x.ID == item.ITEM_ID)?.CATEGORY).DEPART_ID)?.NAME ?? "";
                  })
                  ord.ITEMS.sort((a, b) => a.CATEGORY.localeCompare(b.CATEGORY));
                  this.RenderItem(ord);
                })
              }
              // Generate QR codes for all orders
              for (const order of this.orders) {
                try {
                  const qrCode = await QRCode.toDataURL(order?.QR || "");
                  this.qrCodes.set(order.ID, qrCode);
                } catch (error) {
                  console.error('Error generating QR code:', error);
                }
              }
            }
          }
          else if (TYPE == "Order") {
            if (REQ != "") {
              await this.getRequest(this.getREQParameter(window.location.href) ?? "");
              try {
                const qrCode = await QRCode.toDataURL(this.order?.QR || "");
                this.qrCodes.set(this.order.ID, qrCode);
              } catch (error) {
                console.error('Error generating QR code:', error);
              }
              this.onOrder = true;
            }
          }
        }
      })
    })

  }
  getREQParameter(url: string): string | null {
    const pattern = /REQ=([^&]+)/;
    const match = url.match(pattern);
    return match ? match[1] : null;
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
  getItemsSummary() {
    const itemsMap = new Map<string, {
      name: string;
      category: string;
      depart: string;
      unit: string;
      departBreakdown: { name: string; qty: number }[];
      totalQty: number;
    }>();

    this.orders.forEach(order => {
      order.ITEMS.forEach(item => {
        const key = `${item.NAME}|${item.CATEGORY}|${item.DEPART}|${item.UNIT}`;
        if (!itemsMap.has(key)) {
          itemsMap.set(key, {
            name: item.NAME,
            category: item.CATEGORY,
            depart: item.DEPART ?? "",
            unit: item.UNIT,
            departBreakdown: [],
            totalQty: 0
          });
        }
        const itemData = itemsMap.get(key)!;
        itemData.totalQty += item.COUNT;

        // تحديث breakdown حسب الفرع
        const deptBreak = itemData.departBreakdown.find(d => d.name === order.PLACE_NAME);
        if (deptBreak) {
          deptBreak.qty += item.COUNT;
        } else {
          itemData.departBreakdown.push({ name: order.PLACE_NAME || 'Unknown', qty: item.COUNT });
        }
      });
    });
    let data = Array.from(itemsMap.values());
    data = data.sort((a, b) =>
      (a.depart || '').localeCompare(b.depart || '')
    );
    return data
  }

  getDepartmentTotals() {
    const deptTotals = new Map<string, number>();

    this.orders.forEach(order => {
      order.ITEMS.forEach(item => {
        const deptName = order.PLACE_NAME || 'Unknown';
        deptTotals.set(deptName, (deptTotals.get(deptName) || 0) + item.COUNT);
      });
    });

    return Array.from(deptTotals.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }


  getTotalItems() {
    return this.orders.reduce((total, order) => {
      return total + order.ITEMS.reduce((sum, item) => sum + item.COUNT, 0);
    }, 0);
  }
  print() {
    window.print();
  }
  async getRequest(REQ: string) {
    var response = await this._tools.Network.getAsync<RequestOrder>("Requstes/GetMorDitiles?REQ=" + REQ) as RequestOrder;
    if (response?.ID > 0) {
      this.order = response;
      this.DEPART_SELECTED_NAME = this._tools.distinctArray(this.order.ITEMS, "DEPART").map(x => x.DEPART).join(",");
    }
    else {
      this._tools.Toaster.showError("Reservation has been deleted")
    }
  }
}
