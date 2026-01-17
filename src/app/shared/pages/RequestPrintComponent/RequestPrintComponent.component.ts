import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import QRCode from 'qrcode';
import { RequestOrder } from '../../Types/Request';
import { ActivatedRoute } from '@angular/router';
import { Tools } from '../../service/Tools.service';
import { Item } from '../../Types/Item';
import { Button } from "primeng/button";
@Component({
  selector: 'app-RequestPrintComponent',
  templateUrl: './RequestPrintComponent.component.html',
  styleUrls: ['./RequestPrintComponent.component.css'],
  standalone: true,
  imports: [CommonModule, Button]
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
              //this.orders.sort((a,b)=>a.RESAVE_DATE>b.RESAVE_DATE);
              this.orders = this.orders.sort((a, b) =>
                (a.PLACE_NAME || '').localeCompare(b.PLACE_NAME || '')
              );
              this.orders.forEach(ord => {
                ord.ITEMS.forEach(item => {
                  item.NAME = this.ITEMS.find(x => x.ID == item.ITEM_ID)?.NAME ?? "";
                  item.CATEGORY = this.Category.find(x => x.ID == this.ITEMS.find(x => x.ID == item.ITEM_ID)?.CATEGORY)?.NAME ?? "";
                  item.Depart = this.Departs.find(x => x.ID == this.Category.find(cat => cat.ID == this.ITEMS.find(x => x.ID == item.ITEM_ID)?.CATEGORY).DEPART_ID)?.NAME ?? "";
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
        const key = `${item.NAME}|${item.CATEGORY}|${item.Depart}|${item.UNIT}`;
        if (!itemsMap.has(key)) {
          itemsMap.set(key, {
            name: item.NAME,
            category: item.CATEGORY,
            depart: item.Depart ?? "",
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
}
