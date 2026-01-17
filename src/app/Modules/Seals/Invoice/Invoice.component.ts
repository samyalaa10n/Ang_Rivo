import { Component, OnInit, ViewChild } from '@angular/core';
import { Button } from "primeng/button";
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";
import { DateTimeComponent } from "../../../shared/components/DateTime/DateTime.component";
import { InputNumber } from "primeng/inputnumber";
import { InputFastItemsComponent } from "../../../shared/pages/InputFastItems/InputFastItems.component";
import { AccountType } from '../../../shared/Types/AccountType';
import { Column } from '../../../shared/components/dataGrid/Column';
import { RequestOrder } from '../../../shared/Types/Request';
import { Tools } from '../../../shared/service/Tools.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PrintService } from '../../../shared/service/Print.service';
import { DataGridComponent } from '../../../shared/components/dataGrid/dataGrid.component';
import { RealItem } from '../../../shared/Types/RealItem';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceOrder } from '../../../shared/Types/InvoiceOrder';
import QRCode from 'qrcode';
@Component({
  selector: 'app-Invoice',
  templateUrl: './Invoice.component.html',
  styleUrls: ['./Invoice.component.css'],
  imports: [Button, ComboBoxComponent, DateTimeComponent, FormsModule, InputNumber, InputFastItemsComponent, NgIf, RouterLink]
})
export class InvoiceComponent implements OnInit {
  @ViewChild('InputFastItems') InputFastItems!: InputFastItemsComponent
  AccountTypes: Array<AccountType> = [];
  DataRecordedStock: Array<{ ID: number, ITEM_NAME: string, ITEM_UNIT: string, COUNT_STOCK: number, TOTAL_PRICE: number, COUNT_INVOICE: number, COUNT_REQUEST: number, TOTAL_PRICE_STOCK: number }> = [];
  ColumnsInput: Array<Column> = []
  Customers: Array<any> = []
  SpecialDescound: Array<any> = []
  SpecialItemPrice: Array<any> = []
  SesonActive: number = 0;
  WareHouses: Array<any> = []
  somePricies: boolean = false;
  Invoice: InvoiceOrder = { ID: 0, ROW_NUMBER: -1, CUSTOMER_NAME: '', CUSTOMER: 0, DESCOUND_PERCENT: 0, DATE_TIME: new Date(), ITEMS: [], PRICE_AFTER_DESCOUND: 0, NOTS: '', PAYMENT_TYPE: 0, WAREHOUSE: 0, WAREHOUSE_NAME: '', PAYMENT: 0, TYPE: 0 }
  constructor(private _tools: Tools, private _ActiveRouter: ActivatedRoute, private _router: Router) { }

  async ngOnInit() {
    await this.UpdateLockUp();
    this.ColumnsInput.push(new Column('ITEM_ID', "Item Number"))
    this.ColumnsInput.push(new Column('NAME', "Item Name"))
    this.ColumnsInput.push(new Column('UNIT', "Item Unit"))
    this.ColumnsInput.push(new Column('PRICE', "Invoice Price", "numberWithFraction"))
    this.ColumnsInput.push(new Column('COUNT', "Invoice Quantity", "numberWithFraction"))
    this.ColumnsInput.push(new Column('COUNT_REQUEST', "Requested Quantity"))
    this.ColumnsInput.push(new Column('COUNT_INVOICE', "Executed Quantity"))
    this.ColumnsInput.push(new Column('', "Remaining Quantity for Customer"))
    this.ColumnsInput[this.ColumnsInput.length - 1].DynamicShow = (item: RealItem) => {
      if (this.Invoice.TYPE == 1) {
        return ((item?.COUNT_REQUEST ?? 0) - (item?.COUNT_INVOICE ?? 0)).toString();
      }
      else {
        return ((item?.COUNT_REQUEST ?? 0) + (item?.COUNT_INVOICE ?? 0)).toString();
      }
    }
    this.ColumnsInput.push(new Column('COUNT_STOCK', "Stock Quantity"))
    this.ColumnsInput.push(new Column('', "Remaining Quantity in Warehouse"))
    this.ColumnsInput[this.ColumnsInput.length - 1].DynamicShow = (item: RealItem) => {
      if (this.Invoice.TYPE == 1) {
        return ((item?.COUNT_STOCK ?? 0) - item.COUNT).toString();
      }
      else {
        return ((item?.COUNT_STOCK ?? 0) + item.COUNT).toString();
      }
    }
    this.ColumnsInput.push(new Column('TOTAL_COUNT', "Total Price"))
  }
  ngAfterViewInit() {
    this._tools.waitExecuteFunction(100, () => {
      this._ActiveRouter.queryParams.subscribe({
        next: async ({ ID }) => {
          if (+ID > 0) {
            await this.UpdateLockUp();
            var response = await this._tools.Network.getAsync<InvoiceOrder>("Invoices/GetById?id=" + ID) as InvoiceOrder;
            if (response?.ID > 0) {
              this.Invoice = response;
              await this.GetDataRecordedStock();
              this.InputFastItems.ITEMS_INPUT = this.Invoice.ITEMS;
              this.editStockInEditMode();
              await this.InputFastItems.GetOldData();
            }
            else {
              this._tools.Toaster.showError("Invoice has been deleted")
              this._router.navigate(['Main', 'InvoiceList']);
            }
          }
          else {
            this.InputFastItems.OnSelectedItems = () => {
              this.InputFastItems.ITEMS_INPUT.forEach(x => this.calculate(x, true))
            }
          }
        }
      })
    })
  };
  async UpdateLockUp() {
    this.Customers = await this._tools.Network.getAsync<any>("Customer")
    this.WareHouses = await this._tools.Network.getAsync<any>("WareHouse")
    this.SpecialDescound = await this._tools.Network.getAsync<any>("SpecialDescound")
    this.SpecialItemPrice = await this._tools.Network.getAsync<any>("SpecialItemPrice")
    this.SesonActive = (await this._tools.Network.getAsync<any>("Season/GetActiveSeson") as any)?.SESON ?? 0
    this.AccountTypes = (await this._tools.Network.getAsync<any>("AccountType") as Array<AccountType>);
  }
  async GetDataRecordedStock() {
    if (this.Invoice.CUSTOMER != 0 && this.Invoice.WAREHOUSE != 0) {
      this.SesonActive = (await this._tools.Network.getAsync<any>("Season/GetActiveSeson") as any)?.SESON ?? 0
      var desc = this.SpecialDescound.find(x => x.ID_CUSTOMER == this.Invoice.CUSTOMER && x.SESON == this.SesonActive)
      if (this.Invoice.ROW_NUMBER < 0) {
        this.Invoice.DESCOUND_PERCENT = desc?.DESCOUND ?? 0;
      }

      var data = await this.GetDataRecord();
      this.DataRecordedStock = data;
      this.InputFastItems.ITEMS_INPUT.forEach(item => {
        this.calculate(item, true)
      })
    }
  }
  editStockInEditMode() {
    //edit Stock In EditMode
    if (this.Invoice.ID > 0) {
      this.InputFastItems.ITEMS_INPUT.forEach(item => {
        let older = this.DataRecordedStock.find(x => x.ID == item.ITEM_ID)
        if (older) {
          if (this.Invoice.TYPE == 1) {
            older.COUNT_STOCK = older.COUNT_STOCK - item.COUNT;
          }
          else {
            older.COUNT_STOCK = older.COUNT_STOCK + item.COUNT;
          }
        }
      })
    }
  }
  calculate(item: RealItem, onStart: boolean = false) {
    item.TOTAL_COUNT = item.PRICE * item.COUNT;
    item.COUNT_STOCK = this.DataRecordedStock.find(x => x.ID == item.ITEM_ID)?.COUNT_STOCK ?? 0;
    item.COUNT_REQUEST = this.DataRecordedStock.find(x => x.ID == item.ITEM_ID)?.COUNT_REQUEST ?? 0;
    item.COUNT_INVOICE = this.DataRecordedStock.find(x => x.ID == item.ITEM_ID)?.COUNT_INVOICE ?? 0;
    var NewPrice = this.SpecialItemPrice.find(x => x.ID_ITEM == item.ITEM_ID && x.ID_CUSTOMER == this.Invoice.CUSTOMER && x.SESON == this.SesonActive)?.PRICE ?? 0;
    if (NewPrice > 0 && item.ID < 0 && this.somePricies == false && onStart) {
      item.PRICE = NewPrice;
    }
    else if (item.ID < 0 && this.somePricies == false && onStart) {
      item.PRICE = item.MAIN_PRICE;
    }
  }
  GridLoaded(dataGrid: DataGridComponent) {
    dataGrid.Columns = this.ColumnsInput;
    dataGrid.onRenderItemSource = (item: RealItem) => {
      this.calculate(item)
    }
    dataGrid.GridActionFunc = (action) => {
      action.itemEdit.TOTAL_COUNT = action.itemEdit.COUNT * action.itemEdit.PRICE;
    }

  }
  GetAccountTypesActive() {
    if (this.Invoice.TYPE == 1) {
      return this.AccountTypes.filter(x => x.IS_ADDED == true || x.IS_ADDED_IN_BANK == true || x.IS_AGAL_ADD == true);
    }
    else {
      return this.AccountTypes.filter(x => x.IS_MINIS == true || x.IS_MINIS_IN_BANK == true || x.IS_AGAL == true);
    }
  }
  Total(): number {
    return this.InputFastItems?.ITEMS_INPUT?.map(x => x.TOTAL_COUNT)?.reduce((a, b) => a + b, 0);
  }
  TotalAfterDescound(): number {
    return this.Total() - (this.Total() * (this.Invoice.DESCOUND_PERCENT / 100));
  }
  DescoundValue(): number {
    return (this.Total() * (this.Invoice.DESCOUND_PERCENT / 100));
  }
  TotalAfterPayment(): number {
    return this.TotalAfterDescound() - this.Invoice.PAYMENT;
  }
  Save() {
    this.Invoice.ITEMS = this.InputFastItems.GeneratRequestItems();
    this.Invoice.PRICE_AFTER_DESCOUND = this.TotalAfterDescound()
    this.Invoice.TOTAL_AFTER_PAYMENT = this.TotalAfterPayment()
    let req: InvoiceOrder = this._tools.cloneObject(this.Invoice);
    req.ITEMS = req.ITEMS.filter(x => x.COUNT > 0);
    this._tools.Network.putAsync("Invoices/EditMore", [req]).then(async (res: any) => {
      if (res?.ID > 0) {
        this.Invoice = res;
        let DecreptId: string = await this._tools.Network.getAsync<string>("Invoices/EncryptText?text=" + res?.ID) as string;
        let CODED = encodeURIComponent(DecreptId)
        let Http = window.location.href.split(":")[0]
        let Link = `${Http}://${window.location.host}/#/Show_QR?TEXT=${CODED}&TYPE=1`
        var image = await QRCode.toDataURL(Link);
        this.Invoice.QRImage = image;
        this.InputFastItems.oldData = [];
        await this.InputFastItems.UpdateOnSave();
        this._tools.waitExecuteFunction(500, async () => {
          let disc = await this._tools.Confermation.show("Do you want to display price on the invoice?")
          this.print(disc);
          this._tools.waitExecuteFunction(500, () => {
            this._router.navigate(['Main', 'Invoice'], { queryParams: { ID: `${this.Invoice.ID}` } });
          })
        })
      }
    })
  }
  print(showPrice: boolean = true) {
    let Inv = this._tools.cloneObject(this.Invoice) as InvoiceOrder;
    Inv.CUSTOMER_NAME = this.Customers.find(x => x.ID == Inv.CUSTOMER)?.NAME;
    Inv.PAYMENT_NAME = this.AccountTypes.find(x => x.ID == Inv.PAYMENT_TYPE)?.NAME;
    Inv.ITEMS = this.InputFastItems.ITEMS_INPUT;
    Inv.ITEMS = Inv.ITEMS.filter(x => x.COUNT > 0);
    this._tools.printService.printInvoice(Inv, true, showPrice)
  }
  AddNew() {
    this._router.navigate(['Main', 'Invoice'], { queryParams: { ID: `0` } })
    this._tools.waitExecuteFunction(100, () => {
      window.location.reload();
    });
  }
  async delete() {
    this._tools.Confermation.show().then(async result => {
      if (result) {
        await this._tools.Network.deleteAsync("Invoices?id=" + this.Invoice.ID)
        this._router.navigate(['Main', 'Invoice'], { queryParams: { ID: this.Invoice.ID } })
        this._tools.waitExecuteFunction(100, () => {
          window.location.reload();
        });
      }
    })

  }
  async AddInhert() {
    this.somePricies = await this._tools.Confermation.show("Do you want to copy prices as well with quantities?", "Question")
    this.Invoice.ID = 0;
    this.Invoice.ROW_NUMBER = -1;
    this.Invoice.ITEMS.forEach(item => {
      item.ID = -1;
      item.ROW_NUMBER = -1;
    })
    this.InputFastItems.ITEMS_INPUT = this.Invoice.ITEMS;
    this.InputFastItems.ItemsRecorded = [];
    this.InputFastItems.reSelect();
    await this.GetDataRecordedStock();
    this.editStockInEditMode();
  }
  async GetDataRecord(): Promise<Array<{ ID: number, ITEM_NAME: string, ITEM_UNIT: string, COUNT_STOCK: number, TOTAL_PRICE: number, COUNT_INVOICE: number, COUNT_REQUEST: number, TOTAL_PRICE_STOCK: number }>> {
    let data = await this._tools.Network.getAsync<any>(`Invoices/GetPriceInRequest?Customer_Id=${this.Invoice.CUSTOMER}&WareHouse=${this.Invoice.WAREHOUSE}`);
    return data;
  }
}