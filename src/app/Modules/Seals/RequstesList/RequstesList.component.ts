import { Component, OnInit } from '@angular/core';
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";
import { DateTimeComponent } from "../../../shared/components/DateTime/DateTime.component";
import { Button } from "primeng/button";
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { Tools } from '../../../shared/service/Tools.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PrintService } from '../../../shared/service/Print.service';
import { RequestOrder } from '../../../shared/Types/Request';
import { InputLabelComponent } from "../../../shared/pages/TextLabel/InputLabel.component";
import { Column } from '../../../shared/components/dataGrid/Column';

@Component({
  selector: 'app-RequstesList',
  templateUrl: './RequstesList.component.html',
  styleUrls: ['./RequstesList.component.css'],
  imports: [ComboBoxComponent, DateTimeComponent, Button, DataGridComponent, InputLabelComponent]
})
export class RequstesListComponent implements OnInit {
  Customers: Array<any> = []
  Columns: Array<Column> = []
  Request: { CUSTOMER: number, START: Date, END: Date } = { CUSTOMER: 0, START: new Date(), END: new Date() }
  RequestLest: Array<RequestOrder> = [];
  constructor(private _tools: Tools, private _ActiveRouter: ActivatedRoute, private _printService: PrintService, private _router: Router) { 
    this.Request.START.setDate(1);
    this.Request.END =_tools.DateTime.convertDataToMoment(this.Request.START).add(30,"day").toDate();
  }

  async ngOnInit() {
    this.Customers = await this._tools.Network.getAsync<any>('Customer');
    this.Columns.push(new Column('ID', 'رقم الطلبية', "lapel"))
    this.Columns.push(new Column('CUSTOMER_NAME', 'اسم العميل', "lapel"))
    this.Columns.push(new Column('SEND_DATE', ' تاريخ الأرسال', "lapel", "date"))
    this.Columns[this.Columns.length - 1].Style_Show = (value) => {
      return this._tools.DateTime.EditFormateData(value);
    }
    this.Columns.push(new Column('RESAVE_DATE', ' تاريخ التسليم', "lapel", "date"))
    this.Columns[this.Columns.length - 1].Style_Show = (value) => {
      return this._tools.DateTime.EditFormateData(value);
    }
    this.Columns.push(new Column('TOTAL', 'السعر ', "lapel", "numeric"))
    this.Columns.push(new Column('DESCOUND_PERCENT', 'نسبة الخصم ', "lapel", "numeric"))
    this.Columns.push(new Column('PRICE_AFTER_DESCOUND', 'السعر بعد الخصم ', "lapel", "numeric"))
    this.Columns.push(new Column('DEPOST', 'العربون ', "lapel", "numeric"))
    this.Columns.push(new Column('TOTAL_AFTER_DEPOST', ' السعر المتبقي', "lapel", "numeric"))
  }
  AddNew() {
    this._router.navigate(['Main', 'Requstes'], { queryParams: { ID: `0` } })
  }
  async GetData() {
    let Req = this._tools.cloneObject(this.Request);
    Req.START = this._tools.DateTime.EditData(this.Request.START, 3).toLocaleString("en")
    Req.END = this._tools.DateTime.EditData(this.Request.END, 3).toLocaleString("en")
    this.RequestLest = await this._tools.Network.getAsync<any>('Requstes?filter=' + JSON.stringify(Req))

  }
  RenderItem(e: { item: RequestOrder }) {
    e.item.SEND_DATE=this._tools.DateTime.getDataFromJson(e.item.SEND_DATE as any)
    e.item.RESAVE_DATE=this._tools.DateTime.getDataFromJson(e.item.RESAVE_DATE as any)
    e.item.CUSTOMER_NAME = this.Customers.find(Z=>Z.ID==e.item.CUSTOMER)?.NAME??'';
    e.item.TOTAL = e.item.ITEMS.reduce((num, item) => { return num += (item.COUNT * item.PRICE) }, 0);
    e.item.PRICE_AFTER_DESCOUND = e.item.TOTAL - (e.item.TOTAL * (e.item.DESCOUND_PERCENT / 100));
    e.item.TOTAL_AFTER_DEPOST=e.item.PRICE_AFTER_DESCOUND-e.item.DEPOST;
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
      this._router.navigate(['Main', 'Requstes'],{queryParams:{ID:item.ID}})
    }
  }
}
