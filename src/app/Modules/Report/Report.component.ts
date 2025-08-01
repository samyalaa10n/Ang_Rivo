import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AccordionModule } from 'primeng/accordion';
import { StepperComponent } from "../../shared/components/stepper/stepper.component";
import { StepConfigurationDirective } from '../../shared/components/stepper/Step-Configuration.directive';
import { ComboBoxComponent } from "../../shared/components/comboBox/comboBox.component";
import { Button } from "primeng/button";
import { InputLabelComponent } from "../../shared/pages/TextLabel/InputLabel.component";
import { DateTimeComponent } from "../../shared/components/DateTime/DateTime.component";
import { DataGridComponent } from "../../shared/components/dataGrid/dataGrid.component";
import { Column } from '../../shared/components/dataGrid/Column';
import { Tools } from '../../shared/service/Tools.service';
import { StepConfiguration, StepperConfiguration } from '../../shared/components/stepper/stepper.configuration';

@Component({
  selector: 'app-Report',
  templateUrl: './Report.component.html',
  styleUrls: ['./Report.component.css'],
  imports: [StepperComponent, StepConfigurationDirective, ComboBoxComponent, Button, InputLabelComponent, DateTimeComponent, DataGridComponent]
})
export class ReportComponent implements OnInit {
  StepperConfig = new StepperConfiguration(this)
  Accounts: Array<any> = [];
  WareHouses: Array<any> = [];
  SEASONS: Array<any> = [];
  Customers: Array<any> = [];
  Columns: Array<Column> = [];
  START_DATE: Date = new Date();
  END_DATE: Date = new Date();
  Account: number = 0;
  WAREHOUSE: number = 0;
  CUSTOMER: number = 0;
  SEASON: number = 0;
  DATA_LIST: Array<any> = [];
  constructor(private _tools: Tools) {
    this.START_DATE.setDate(1);
    this.END_DATE = _tools.DateTime.convertDataToMoment(this.START_DATE).add(30, "day").toDate();
    this.StepperConfig.oncSelectChange = (E) => {
      this.DATA_LIST = [];
      this.Columns = [];
    }
  }
  async ngOnInit() {
    this.Accounts = await this._tools.Network.getAsync<any>("Accounts");
    this.WareHouses = await this._tools.Network.getAsync<any>("WareHouse");
    this.SEASONS = await this._tools.Network.getAsync<any>("Season");
    this.Customers = await this._tools.Network.getAsync<any>("Customer");
  }

  async GetData() {
    this.Columns = [];
    this.Columns.push(new Column("REP_OPERATION_ID", "رقم العملية", "lapel"))
    this.Columns.push(new Column("REP_DATE", "تاريخ العملية", "lapel"))
    this.Columns[this.Columns.length - 1].Style_Show = (value) => {
      return this._tools.DateTime.EditFormateData(value, "DD-MM-yyyy");
    }
    this.Columns.push(new Column("REP_VALUE", "المبلغ", "lapel"))
    this.Columns.push(new Column("REP_TYPE_NAME", "طريقة المعاملة", "lapel"))
    this.Columns.push(new Column("REP_NOTS", "تفاصيل", "lapel"))
    this.Columns.push(new Column("REP_FROM", "من جدول", "lapel"))
    var data = await this._tools.Network.getAsync<any>(`Report/GetAccountReport?Request=${JSON.stringify({ ACCOUNT: this.Account, START: this.START_DATE, END: this.END_DATE })}`);
    if (data != undefined && Array.isArray(data)) {
      this.DATA_LIST = data;
    }
    else {
      this.DATA_LIST = [];
    }
  }
  async GetDataIemstock() {
    this.Columns = [];
    this.Columns.push(new Column("ID", "رقم الصنف", "lapel"))
    this.Columns.push(new Column("NAME", "اسم الصنف", "lapel"))
    this.Columns.push(new Column("CATEGORY", "التصنيف", "lapel"))
    this.Columns.push(new Column("UNIT", "الوحدة", "lapel"))
    this.Columns.push(new Column("TYPE", "نوع الصنف", "lapel"))
    this.Columns.push(new Column("COUNT", "الرصيد", "lapel"))
    var data = await this._tools.Network.getAsync<any>(`Report/GetItemsStock?Request=${JSON.stringify({ WAREHOUSE: this.WAREHOUSE, START: this.START_DATE, END: this.END_DATE })}`);
    if (data != undefined && Array.isArray(data)) {
      this.DATA_LIST = data;

    }
    else {
      this.DATA_LIST = [];
    }
  }
  GetTotal(): number {
    return this.DATA_LIST.map(z => z.REP_VALUE).reduce((a, b) => a + b, 0);
  }

  GridLoaded(dataGrid: DataGridComponent) {
    dataGrid.paginator = false;
    dataGrid.AllowUpdate = false;
    dataGrid.AllowDelete = false;
    dataGrid.AllowDeleteSelected = false;
    dataGrid.AllowSave = false;
    dataGrid.AllowAdd = false;
    dataGrid.AllowShow = true;
    dataGrid.canSelectRow = false;
    dataGrid.AllowPrint = true;
    dataGrid.prenTitle = () => {
      return "كشف حساب " + this.Accounts.find(x => x.ID == this.Account)?.NAME + " من " + this.START_DATE.toLocaleDateString() + " الي " + this.END_DATE.toLocaleDateString();;
    }
    dataGrid.onShowItem = (item) => {
      this.GoPage(item)
    }
    if (this.StepperConfig._ActiveStepIndex == 1) {
      dataGrid.AllowShow = false;
      dataGrid.IsHasChild = true;
      dataGrid.prenTitle = () => {
        return " رصيد المخازن -  " + (this.WareHouses.find(x => x.ID == this.WAREHOUSE)?.NAME ?? "") + " من " + this.START_DATE.toLocaleDateString() + " الي " + this.END_DATE.toLocaleDateString();
      }



      dataGrid.onLoadedChildDataGrid = (pernt, Child, row) => {
        let ChildCoumns: Array<Column> = []
        Child.AllowShow = true;
        Child.paginator = false;
        Child.prenTitle = () => {
          return "تفاصيل حركات صنف - (" + row.ID + " - " + row.NAME + ") من " + this.START_DATE.toLocaleDateString() + " الي " + this.END_DATE.toLocaleDateString() + " - " + (this.WareHouses.find(x => x.ID == this.WAREHOUSE)?.NAME ?? "")
        };
        Child.AllowUpdate = false;
        Child.AllowDelete = false;
        Child.AllowDeleteSelected = false;
        Child.AllowSave = false;
        Child.AllowAdd = false;
        Child.AllowPrint = true;
        Child.AllowShow = true;
        Child.canSelectRow = false;
        ChildCoumns.push(new Column("WARE_HOUSE_NAME", "اسم المخزن", "lapel"))
        ChildCoumns.push(new Column("OPERATION_ID", "رقم العملية", "lapel"))
        ChildCoumns.push(new Column("DATE_TIME", "تاريخ العملية", "lapel"))
        ChildCoumns[ChildCoumns.length - 1].Style_Show = (value) => {
          return this._tools.DateTime.EditFormateData(value, "DD-MM-yyyy");
        }
        ChildCoumns.push(new Column("TYPE", "نوع العملية", "lapel"))
        ChildCoumns.push(new Column("FROM_TYPE", "مصدر العملية", "lapel"))
        ChildCoumns.push(new Column("COUNT", "الكمية", "lapel"))
        Child.Columns = ChildCoumns;
        Child.dataSource = row.ITEM_DITILS;
        Child.onShowItem = (item: any) => {
          this.GoPage(item)
        }
      }
    }
    else if (this.StepperConfig._ActiveStepIndex == 2) {
      dataGrid.AllowShow = false;
      dataGrid.AllowPrint = true;
      dataGrid.onRenderItemSource = (Item) => {
        Item.ShowResult = Item.REQUEST_PRODUCTION > 0 ? ` ناقص { ${Item.REQUEST_PRODUCTION}  ${Item.UNIT} }` : Item.REQUEST_PRODUCTION < 0 ? ` زايد { ${Item.REQUEST_PRODUCTION * -1} ${Item.UNIT} } ` : ''
      }
      dataGrid.prenTitle = () => {
        return "تقرير خطة انتاج - " + (this.SEASONS.find(x => x.ID == this.SEASON)?.NAME ?? "") + " - " + (this.Customers.find(x => x.ID == this.CUSTOMER)?.NAME ?? "") + " - " + (this.WareHouses.find(x => x.ID == this.WAREHOUSE)?.NAME ?? "");
      };
    }
  }
  GoPage(Item: any) {
    //REP_FROM
    //REP_OPERATION_ID
    //FROM_TYPE
    //OPERATION_ID
    let link = "";
    let KindLink = window.location.href.split(":")[0];
    switch (Item?.REP_FROM ?? Item?.FROM_TYPE) {
      case 'قيود محاسبية':
        link = `${KindLink}://${location.host}/#/Main/AccountOperation?ID=${Item.REP_OPERATION_ID}`;
        break;
      case 'فواتير':
        link = `${KindLink}://${location.host}/#/Main/Invoice?ID=${Item.REP_OPERATION_ID}`;
        break;
      case 'فاتورة':
        link = `${KindLink}://${location.host}/#/Main/Invoice?ID=${Item.OPERATION_ID}`;
        break;
      case 'الطلبيات':
        link = `${KindLink}://${location.host}/#/Main/Requstes?ID=${Item.REP_OPERATION_ID}`;
        break;
      case 'عملية مخزنية':
        link = `${KindLink}://${location.host}/#/Main/Operation?ID=${Item.OPERATION_ID}`;
        break;
    }
    window.open(link, "_balnck")
  }
  async GetProductionPlan() {
    this.Columns = [];
    this.Columns.push(new Column("ID", "رقم الصنف", "lapel"))
    this.Columns.push(new Column("NAME", "اسم الصنف", "lapel"))
    this.Columns.push(new Column("UNIT", "الوحدة", "lapel"))
    this.Columns.push(new Column("COUNT_REQUEST", "المطلوب", "lapel"))
    this.Columns.push(new Column("COUNT_INVOICE", "المباع", "lapel"))
    this.Columns.push(new Column("COUNT_STOCK", "الرصيد المخزني", "lapel"))
    this.Columns.push(new Column("ShowResult", "المطلوب للأنتاج", "lapel"))
    if (this.CUSTOMER != 0 || this.WAREHOUSE != 0) {
      var data = await this._tools.Network.getAsync<any>(`Report/GetProductionPlanSpicalCustomer?Customer_Id=${this.CUSTOMER}&Sesson=${this.SEASON}&WareHouse=${this.WAREHOUSE}`);
    }
    else {
      var data = await this._tools.Network.getAsync<any>(`Report/GetProductionPlan?Customer_Id=${this.CUSTOMER}&Sesson=${this.SEASON}&WareHouse=${this.WAREHOUSE}`);
    }
    if (data != undefined && Array.isArray(data)) {
      this.DATA_LIST = data.filter(x => !(x.COUNT_REQUEST == 0 && x.COUNT_INVOICE == 0 && x.COUNT_STOCK == 0 && x.REQUEST_PRODUCTION == 0));
    }
    else {
      this.DATA_LIST = [];
    }
  }
}
