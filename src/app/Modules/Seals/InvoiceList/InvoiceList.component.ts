import { Component, OnInit } from '@angular/core';
import { Button } from "primeng/button";
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";
import { InputLabelComponent } from "../../../shared/pages/TextLabel/InputLabel.component";
import { DateTimeComponent } from "../../../shared/components/DateTime/DateTime.component";
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { RequestOrder } from '../../../shared/Types/Request';
import { Tools } from '../../../shared/service/Tools.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PrintService } from '../../../shared/service/Print.service';
import { InvoiceOrder } from '../../../shared/Types/InvoiceOrder';

@Component({
  selector: 'app-InvoiceList',
  templateUrl: './InvoiceList.component.html',
  styleUrls: ['./InvoiceList.component.css'],
  imports: [Button, ComboBoxComponent, InputLabelComponent, DateTimeComponent, DataGridComponent]
})
export class InvoiceListComponent implements OnInit {
  Customers: Array<any> = []
  Columns: Array<Column> = []
  Request: { CUSTOMER: number, START: Date, END: Date } = { CUSTOMER: 0, START: new Date(), END: new Date() }
  InvoiceList: Array<InvoiceOrder> = [];
  constructor(private _tools: Tools, private _ActiveRouter: ActivatedRoute, private _printService: PrintService, private _router: Router) {
    this.Request.START.setDate(1);
    this.Request.END =_tools.DateTime.convertDataToMoment(this.Request.START).add(30,"day").toDate();
   }

  async ngOnInit() {
    this.Customers = await this._tools.Network.getAsync<any>('Customer');
    this.Columns.push(new Column('ID', 'رقم الفاتورة', "lapel"))
    this.Columns.push(new Column('CUSTOMER_NAME', 'اسم العميل', "lapel"))
    this.Columns.push(new Column('DATE_TIME', ' تاريخ الفاتورة', "lapel", "date"))
    this.Columns[this.Columns.length - 1].Style_Show = (value) => {
      return this._tools.DateTime.EditFormateData(value);
    }
    this.Columns.push(new Column('TOTAL', 'المبلغ ', "lapel", "numeric"))
    this.Columns.push(new Column('DESCOUND_PERCENT', 'نسبة الخصم ', "lapel", "numeric"))
    this.Columns.push(new Column('PRICE_AFTER_DESCOUND', 'المبلغ بعد الخصم ', "lapel", "numeric"))
    this.Columns.push(new Column('PAYMENT', 'المدفوع ', "lapel", "numeric"))
    this.Columns.push(new Column('TOTAL_AFTER_PAYMENT', ' المبلغ المتبقي', "lapel", "numeric"))
  }
  AddNew() {
    this._router.navigate(['Main', 'Invoice'], { queryParams: { ID: `0` } })
  }
  async GetData() {
    let Req = this._tools.cloneObject(this.Request);
    Req.START = this._tools.DateTime.EditData(this.Request.START, 3).toLocaleString("en")
    Req.END = this._tools.DateTime.EditData(this.Request.END, 3).toLocaleString("en")
    this.InvoiceList = await this._tools.Network.getAsync<any>('Invoices?filter=' + JSON.stringify(Req))

  }
  RenderItem(e: { item: InvoiceOrder }) {
    e.item.DATE_TIME=this._tools.DateTime.getDataFromJson(e.item.DATE_TIME as any)
    e.item.CUSTOMER_NAME = this.Customers.find(Z=>Z.ID==e.item.CUSTOMER)?.NAME??'';
    e.item.TOTAL = e.item.ITEMS.reduce((num, item) => { return num += (item.COUNT * item.PRICE) }, 0);
    e.item.PRICE_AFTER_DESCOUND = e.item.TOTAL - (e.item.TOTAL * (e.item.DESCOUND_PERCENT / 100));
    e.item.TOTAL_AFTER_PAYMENT=e.item.PRICE_AFTER_DESCOUND-e.item.PAYMENT;
  }
  GridLoaded(dataGrid:DataGridComponent)
  {
    dataGrid.AllowUpdate=false;
    dataGrid.AllowDelete=false;
    dataGrid.AllowDeleteSelected=false;
    dataGrid.AllowSave=false;
    dataGrid.AllowAdd=false;
    dataGrid.AllowEdit=true;
    dataGrid.canSelectRow=false;
    dataGrid.onEditItem=(item:RequestOrder)=>{
      this._router.navigate(['Main', 'Invoice'],{queryParams:{ID:item.ID}})
    }
  }

}
