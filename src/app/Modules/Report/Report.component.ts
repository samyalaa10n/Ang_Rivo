import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StepperComponent } from "../../shared/components/stepper/stepper.component";
import { StepConfigurationDirective } from '../../shared/components/stepper/Step-Configuration.directive';
import { ComboBoxComponent } from "../../shared/components/comboBox/comboBox.component";
import { Button } from "primeng/button";
import { InputLabelComponent } from "../../shared/pages/TextLabel/InputLabel.component";
import { DateTimeComponent } from "../../shared/components/DateTime/DateTime.component";
import { DataGridComponent } from "../../shared/components/dataGrid/dataGrid.component";
import { Column } from '../../shared/components/dataGrid/Column';
import { Tools } from '../../shared/service/Tools.service';
import { StepperConfiguration } from '../../shared/components/stepper/stepper.configuration';
import { MultiselectComponent } from "../../shared/components/multiselect/multiselect.component";
import { RequestOrder } from '../../shared/Types/Request';
import { Router } from '@angular/router';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-Report',
  templateUrl: './Report.component.html',
  styleUrls: ['./Report.component.css'],
  imports: [StepperComponent, StepConfigurationDirective, ComboBoxComponent, Button, InputLabelComponent, DateTimeComponent, DataGridComponent, MultiselectComponent, NgIf]
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
  Departs: Array<any> = [];
  DepartSelected: Array<any> = [];
  Placses: Array<any> = [];
  PlacsesSelected: Array<any> = [];
  WAREHOUSE: number = 0;
  CUSTOMER: number = 0;
  SEASON: number = 0;
  DATA_LIST: Array<any> = [];
  constructor(private _tools: Tools, private _router: Router) {
    this.START_DATE.setDate(1);
    this.END_DATE = _tools.DateTime.convertDataToMoment(this.START_DATE).add(30, "day").toDate();
    this.StepperConfig.oncSelectChange = (E) => {
      this.DATA_LIST = [];
      this.Columns = [];
    }
    this.StepperConfig.StopControlSaveBtn = true;
    this.StepperConfig.ShowNextButton = false;
    this.StepperConfig.ShowPreviousButton = false;
    this.StepperConfig.disableSave = false;
  }
  async ngOnInit() {
    this.Accounts = await this._tools.Network.getAsync<any>("Accounts");
    this.WareHouses = await this._tools.Network.getAsync<any>("WareHouse");
    this.Placses = await this._tools.Network.getAsync<any>("Place");
    this.Departs = await this._tools.Network.getAsync<any>("Depart");
    this.SEASONS = await this._tools.Network.getAsync<any>("Season");
    this.Customers = await this._tools.Network.getAsync<any>("Customer");
  }
  GetPermations(permtion: Array<string>): boolean {
    let accseptedPage = JSON.parse(localStorage.getItem("logInfo") ?? '{}').MYPAGESD as Array<any>
    for (let index = 0; index < permtion.length; index++) {
      const element = permtion[index];
      if (accseptedPage.find(x => x == element) != null) {
        return true;
      }
    }
    return false;

  }
  async GetData() {
    this.Columns = [];
    this.Columns.push(new Column("REP_OPERATION_ID", "Operation #", "lapel"))
    this.Columns.push(new Column("REP_DATE", "Operation Date", "lapel"))
    this.Columns[this.Columns.length - 1].Style_Show = (value) => {
      return this._tools.DateTime.EditFormateData(value, "DD-MM-yyyy");
    }
    this.Columns.push(new Column("REP_VALUE", "Amount", "lapel"))
    this.Columns.push(new Column("REP_TYPE_NAME", "Transaction Method", "lapel"))
    this.Columns.push(new Column("REP_NOTS", "Details", "lapel"))
    this.Columns.push(new Column("REP_FROM", "Source Table", "lapel"))
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
    this.Columns.push(new Column("ID", "Item #", "lapel"))
    this.Columns.push(new Column("NAME", "Item Name", "lapel"))
    this.Columns.push(new Column("CATEGORY", "Category", "lapel"))
    this.Columns.push(new Column("UNIT", "Unit", "lapel"))
    this.Columns.push(new Column("TYPE", "Item Type", "lapel"))
    this.Columns.push(new Column("COUNT", "Balance", "lapel"))
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

  async GetOrdersReservations() {
    this.Columns = [];
    this.Columns.push(new Column('ID', 'Reservation Number', "lapel"))
    this.Columns.push(new Column('PLACE_NAME', 'Branch', "lapel"))
    this.Columns.push(new Column('CUSTOMER_NAME', 'Company Name', "lapel"))
    this.Columns.push(new Column('CUSTOMER_BUY_NAME', 'Customer Name', "lapel"))
    this.Columns.push(new Column('PHONE', 'Phone Number', "lapel"))
    this.Columns.push(new Column('SELLER', 'Sales Representative', "lapel"))
    this.Columns.push(new Column('SEND_DATE', 'Sending Date', "lapel", "date"))
    this.Columns[this.Columns.length - 1].Style_Show = (value) => {
      return this._tools.DateTime.EditFormateData(value);
    }
    this.Columns.push(new Column('RESAVE_DATE', 'Delivery Date', "lapel", "date"))
    this.Columns[this.Columns.length - 1].Style_Show = (value) => {
      return this._tools.DateTime.EditFormateData(value);
    }
    this.START_DATE.setHours(0)
    this.START_DATE.setMinutes(0)
    this.START_DATE.setSeconds(0)
    this.END_DATE.setHours(23)
    this.END_DATE.setMinutes(59)
    this.END_DATE.setSeconds(59)
    let Req = {
      PLACES: this.PlacsesSelected,
      DEPARTS: this.DepartSelected,
      FROM: this._tools.DateTime.saveWithCorrectTimezone(this.START_DATE),
      TO: this._tools.DateTime.saveWithCorrectTimezone(this.END_DATE),
    }
    var data = await this._tools.Network.postAsync<any>(`Report/GetOrdersReservations`, Req);
    if (data != undefined && Array.isArray(data)) {
      this.DATA_LIST = data;
      this.DATA_LIST.forEach(item => {
        this.RenderItem(item);
      })
    }
    else {
      this.DATA_LIST = [];
    }
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
  GridReservationsLoaded(dataGrid: DataGridComponent) {
    dataGrid.paginator = false;
    dataGrid.AllowCurdOperation = false;
    dataGrid.AllowUpdate = false;
    dataGrid.AllowDelete = false;
    dataGrid.AllowDeleteSelected = false;
    dataGrid.AllowSave = false;
    dataGrid.AllowAdd = false;
    dataGrid.canSelectRow = false;
    dataGrid.AllowPrint = true;
    dataGrid.onPrint = async () => {
      this.START_DATE.setHours(0)
      this.START_DATE.setMinutes(0)
      this.START_DATE.setSeconds(0)
      this.END_DATE.setHours(23)
      this.END_DATE.setMinutes(59)
      this.END_DATE.setSeconds(59)
      let Req = {
        PLACES: this.PlacsesSelected,
        DEPARTS: this.DepartSelected,
        FROM: this._tools.DateTime.saveWithCorrectTimezone(this.START_DATE),
        TO: this._tools.DateTime.saveWithCorrectTimezone(this.END_DATE),
        DEPART_SELECTED_NAME: this.Departs.filter(x => this.DepartSelected.includes(x.ID)).map(z => z.NAME).reduce((name, En) => name + " - " + En, "")
      }
      this._router.navigate(['Main', "RequestPrint"], {
        queryParams: {
          REQ: JSON.stringify(Req)
        }
      });
    }
    dataGrid.exportExcel = async () => {
      let Req = {
        PLACES: this.PlacsesSelected,
        DEPARTS: this.DepartSelected,
        FROM: this._tools.DateTime.saveWithCorrectTimezone(this.START_DATE),
        TO: this._tools.DateTime.saveWithCorrectTimezone(this.END_DATE),
        DEPART_SELECTED_NAME: this.Departs.filter(x => this.DepartSelected.includes(x.ID)).map(z => z.NAME).reduce((name, En) => name + " - " + En, "")
      }
      this._tools.Loading.startLoading();
      var blob: Blob | undefined = await this._tools.Network.downloadExcel(`Report/ExportRequestToExcel`, Req)
      if (blob) {
        FileSaver.saveAs(blob, `$exported.xlsx`);
      }
      this._tools.Loading.stopLoading();
    }
  }
  GridLoaded(dataGrid: DataGridComponent) {
    dataGrid.AllowCurdOperation = false;
    dataGrid.paginator = false;
    dataGrid.AllowUpdate = false;
    dataGrid.AllowDelete = false;
    dataGrid.AllowDeleteSelected = false;
    dataGrid.AllowSave = false;
    dataGrid.AllowAdd = false;
    dataGrid.AllowShow = false;
    dataGrid.canSelectRow = false;
    dataGrid.AllowPrint = true;
    dataGrid.prenTitle = () => {
      return "Account Statement - " + this.Accounts.find(x => x.ID == this.Account)?.NAME + " from " + this.START_DATE.toLocaleDateString() + " to " + this.END_DATE.toLocaleDateString();;
    }
    dataGrid.onShowItem = (item) => {
      this.GoPage(item)
    }
    if (this.StepperConfig._ActiveStepIndex == 1) {
      dataGrid.AllowShow = false;
      dataGrid.IsHasChild = true;
      dataGrid.prenTitle = () => {
        return "Warehouse Balance - " + (this.WareHouses.find(x => x.ID == this.WAREHOUSE)?.NAME ?? "") + " from " + this.START_DATE.toLocaleDateString() + " to " + this.END_DATE.toLocaleDateString();
      }

      dataGrid.onLoadedChildDataGrid = (pernt, Child, row) => {
        let ChildCoumns: Array<Column> = []
        Child.AllowShow = true;
        Child.paginator = false;
        Child.AllowCurdOperation = false;
        Child.prenTitle = () => {
          return "Item Movement Details - (" + row.ID + " - " + row.NAME + ") from " + this.START_DATE.toLocaleDateString() + " to " + this.END_DATE.toLocaleDateString() + " - " + (this.WareHouses.find(x => x.ID == this.WAREHOUSE)?.NAME ?? "")
        };
        Child.AllowUpdate = false;
        Child.AllowDelete = false;
        Child.AllowDeleteSelected = false;
        Child.AllowSave = false;
        Child.AllowAdd = false;
        Child.AllowPrint = true;
        Child.AllowShow = true;
        Child.canSelectRow = false;
        ChildCoumns.push(new Column("WARE_HOUSE_NAME", "Warehouse Name", "lapel"))
        ChildCoumns.push(new Column("OPERATION_ID", "Operation #", "lapel"))
        ChildCoumns.push(new Column("DATE_TIME", "Operation Date", "lapel"))
        ChildCoumns[ChildCoumns.length - 1].Style_Show = (value) => {
          return this._tools.DateTime.EditFormateData(value, "DD-MM-yyyy");
        }
        ChildCoumns.push(new Column("TYPE", "Operation Type", "lapel"))
        ChildCoumns.push(new Column("FROM_TYPE", "Operation Source", "lapel"))
        ChildCoumns.push(new Column("COUNT", "Quantity", "lapel"))
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
        Item.ShowResult = Item.REQUEST_PRODUCTION > 0 ? `Shortage { ${Item.REQUEST_PRODUCTION} ${Item.UNIT} }` : Item.REQUEST_PRODUCTION < 0 ? `Excess { ${Item.REQUEST_PRODUCTION * -1} ${Item.UNIT} } ` : ''
      }
      dataGrid.prenTitle = () => {
        return "Production Plan Report - " + (this.SEASONS.find(x => x.ID == this.SEASON)?.NAME ?? "") + " - " + (this.Customers.find(x => x.ID == this.CUSTOMER)?.NAME ?? "") + " - " + (this.WareHouses.find(x => x.ID == this.WAREHOUSE)?.NAME ?? "");
      };
    }
  }
  GoPage(Item: any) {

    let link = "";
    let KindLink = window.location.href.split(":")[0];
    switch (Item?.REP_FROM ?? Item?.FROM_TYPE) {
      case 'Accounting Entries':
        link = `${KindLink}://${location.host}/#/Main/AccountOperation?ID=${Item.REP_OPERATION_ID}`;
        break;
      case 'Invoices':
        link = `${KindLink}://${location.host}/#/Main/Invoice?ID=${Item.REP_OPERATION_ID}`;
        break;
      case 'Invoice':
        link = `${KindLink}://${location.host}/#/Main/Invoice?ID=${Item.OPERATION_ID}`;
        break;
      case 'Orders':
        link = `${KindLink}://${location.host}/#/Main/Requstes?ID=${Item.REP_OPERATION_ID}`;
        break;
      case 'Warehouse Operation':
        link = `${KindLink}://${location.host}/#/Main/Operation?ID=${Item.OPERATION_ID}`;
        break;
    }
    window.open(link, "_blank")
  }
  async GetProductionPlan() {
    this.Columns = [];
    this.Columns.push(new Column("ID", "Item #", "lapel"))
    this.Columns.push(new Column("NAME", "Item Name", "lapel"))
    this.Columns.push(new Column("UNIT", "Unit", "lapel"))
    this.Columns.push(new Column("COUNT_REQUEST", "Requested", "lapel"))
    this.Columns.push(new Column("COUNT_INVOICE", "Sold", "lapel"))
    this.Columns.push(new Column("COUNT_STOCK", "Stock Balance", "lapel"))
    this.Columns.push(new Column("ShowResult", "Required for Production", "lapel"))
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