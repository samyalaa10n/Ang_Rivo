import { Component, OnInit } from '@angular/core';
import { ComboBoxComponent } from '../../../shared/components/comboBox/comboBox.component';
import { DateTimeComponent } from '../../../shared/components/DateTime/DateTime.component';
import { Button } from 'primeng/button';
import { DataGridComponent } from '../../../shared/components/dataGrid/dataGrid.component';
import { InputLabelComponent } from '../../../shared/pages/TextLabel/InputLabel.component';
import { RequestOrder } from '../../../shared/Types/Request';
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PrintService } from '../../../shared/service/Print.service';
import { OperationOrder } from '../../../shared/Types/OperationOrder';

@Component({
  selector: 'app-OperationList',
  templateUrl: './OperationList.component.html',
  styleUrls: ['./OperationList.component.css'],
  imports: [ComboBoxComponent, DateTimeComponent, Button, DataGridComponent, InputLabelComponent]
})
export class OperationListComponent implements OnInit {

  WareHouses: Array<any> = []
  Columns: Array<Column> = []
  Request: { WAREHOUSE: number, START: Date, END: Date } = { WAREHOUSE: 0, START: new Date(), END: new Date() }
  OperationLest: Array<OperationOrder> = [];
  constructor(private _tools: Tools, private _ActiveRouter: ActivatedRoute, private _printService: PrintService, private _router: Router) { }

  async ngOnInit() {
    this.WareHouses = await this._tools.Network.getAsync<any>('WareHouse');
    this.Columns.push(new Column('ID', 'رقم الطلبية', "lapel"))
    this.Columns.push(new Column('DATE_TIME', ' تاريخ الأرسال', "lapel", "date"))
    this.Columns[this.Columns.length - 1].Style_Show = (value) => {
      return this._tools.DateTime.EditFormateData(value);
    }
    this.Columns.push(new Column('WAREHOUSE_ADDED_NAME', 'المخزن', "lapel"))
    this.Columns.push(new Column('WAREHOUSE_GET_NAME', 'المخزن المحول منة', "lapel"))
    this.Columns.push(new Column('TYPE', 'نوع العملية', "lapel"))
    this.Columns[this.Columns.length - 1].Style_Show = (value) => {
      return value == 1 ? 'اضافة' : value == 2 ? 'سحب' : value == 3 ? 'تحويل' : "";
    }
  }
  AddNew() {
    this._router.navigate(['Main', 'Operation'], { queryParams: { ID: `0` } })
  }
  async GetData() {
    let Req = this._tools.cloneObject(this.Request);
    Req.START = this._tools.DateTime.EditData(this.Request.START, 3).toLocaleString("en")
    Req.END = this._tools.DateTime.EditData(this.Request.END, 3).toLocaleString("en")
    this.OperationLest = await this._tools.Network.getAsync<any>('Operations?filter=' + JSON.stringify(Req))
    this.OperationLest.forEach(item=>{})
  }
  RenderItem(e: { item: OperationOrder }) {
    e.item.DATE_TIME = this._tools.DateTime.getDataFromJson(e.item.DATE_TIME as any)
    e.item.WAREHOUSE_GET_NAME = this.WareHouses.find(Z => Z.ID == e.item.WAREHOUSE_GET_ID)?.NAME ?? '';
    e.item.WAREHOUSE_ADDED_NAME = this.WareHouses.find(Z => Z.ID == e.item.WAREHOUSE_ADDED_ID)?.NAME ?? '';
  }
  GridLoaded(dataGrid: DataGridComponent) {
    dataGrid.AllowUpdate = false;
    dataGrid.AllowDelete = false;
    dataGrid.AllowDeleteSelected = false;
    dataGrid.AllowSave = false;
    dataGrid.AllowAdd = false;
    dataGrid.AllowEdit = true;
    dataGrid.canSelectRow = false;
    dataGrid.onEditItem = (item: RequestOrder) => {
      this._router.navigate(['Main', 'Operation'], { queryParams: { ID: item.ID } })
    }
  }

}
