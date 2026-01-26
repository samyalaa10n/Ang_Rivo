import { Component, OnInit } from '@angular/core';
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";
import { Button } from "primeng/button";
import { InputLabelComponent } from "../../../shared/pages/TextLabel/InputLabel.component";
import { DateTimeComponent } from "../../../shared/components/DateTime/DateTime.component";
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { OperationOrder } from '../../../shared/Types/OperationOrder';
import { Tools } from '../../../shared/service/Tools.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PrintService } from '../../../shared/service/Print.service';
import { RequestOrder } from '../../../shared/Types/Request';
import { AccountOperation } from '../../../shared/Types/AccountOperation';
import { AccountType } from '../../../shared/Types/AccountType';

@Component({
  selector: 'app-AccountOperationList',
  templateUrl: './AccountOperationList.component.html',
  styleUrls: ['./AccountOperationList.component.css'],
  imports: [ComboBoxComponent, Button, InputLabelComponent, DateTimeComponent, DataGridComponent]
})
export class AccountOperationListComponent implements OnInit {
  AccountTypes: Array<AccountType> = [];
  Accounts: Array<any> = [];
  Columns: Array<Column> = []
  Request: { ACCOUNT: number, START: Date, END: Date } = { ACCOUNT: 0, START: new Date(), END: new Date() }
  AccountOperationLest: Array<AccountOperation> = [];
  constructor(private _tools: Tools, private _ActiveRouter: ActivatedRoute, private _printService: PrintService, private _router: Router) {
    this.Request.START.setDate(1);
    this.Request.END = _tools.DateTime.convertDataToMoment(this.Request.START).add(30, "day").toDate();
  }

  async ngOnInit() {
    this.AccountTypes = (await this._tools.Network.getAsync<any>("AccountType") as Array<AccountType>);
    this.Accounts = (await this._tools.Network.getAsync<any>("Accounts") as Array<any>);
    this.Columns.push(new Column('ID', 'Operation Number', "lapel"))
    this.Columns.push(new Column('ACCOUNT_NAME', 'Account Name', "lapel"))
    this.Columns.push(new Column('DATE_TIME', 'Sending Date', "lapel", "date"))
    this.Columns[this.Columns.length - 1].Style_Show = (value) => {
      return this._tools.DateTime.EditFormateData(value);
    }
    this.Columns.push(new Column('TYPE_NAME', 'Operation Type', "lapel"))
    this.Columns.push(new Column('VALUE', 'Amount', "lapel"))
    this.Columns.push(new Column('NOTS', 'Entry Details', "lapel"))
  }
  AddNew() {
    this._router.navigate(['Main', 'AccountOperation'], { queryParams: { ID: `0` } })
  }
  async GetData() {
    let Req = this._tools.cloneObject(this.Request);
    Req.START = this._tools.DateTime.EditData(this.Request.START, 3).toLocaleString("en")
    Req.END = this._tools.DateTime.EditData(this.Request.END, 3).toLocaleString("en")
    this.AccountOperationLest = await this._tools.Network.getAsync<any>('AccountOperation?filter=' + JSON.stringify(Req))
    this.AccountOperationLest.forEach(item => {
      item.TYPE_NAME = this.AccountTypes.find(x => x.ID == item.TYPE)?.NAME;
      item.ACCOUNT_NAME = this.Accounts.find(x => x.ID == item.ACCOUNT)?.NAME;
      if (this.AccountTypes.find(x => x.ID == item.TYPE)?.IS_ADDED == false) {
        item.VALUE = item.VALUE * -1;
      }
    })
  }
  RenderItem(e: { item: AccountOperation }) {
    e.item.DATE_TIME = this._tools.DateTime.getDataFromJson(e.item.DATE_TIME as any)
  }
  GridLoaded(dataGrid: DataGridComponent) {
    dataGrid.GridMode = "EfectInRows"
    dataGrid.AllowUpdate = false;
    dataGrid.AllowDelete = false;
    dataGrid.AllowDeleteSelected = false;
    dataGrid.AllowSave = false;
    dataGrid.AllowAdd = false;
    dataGrid.AllowEdit = true;
    dataGrid.canSelectRow = false;
    dataGrid.onEditItem = (item: AccountOperation) => {
      this._router.navigate(['Main', 'AccountOperation'], { queryParams: { ID: item.ID } })
    }
  }
  GetTotal(): number {
    return this.AccountOperationLest.map(x => x.VALUE).reduce((a, b) => a + b, 0)
  }

}