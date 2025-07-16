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

@Component({
  selector: 'app-Invoice',
  templateUrl: './Invoice.component.html',
  styleUrls: ['./Invoice.component.css'],
  imports: [Button, ComboBoxComponent, DateTimeComponent,FormsModule, InputNumber, InputFastItemsComponent,NgIf,RouterLink]
})
export class InvoiceComponent implements OnInit {
  @ViewChild('InputFastItems') InputFastItems!: InputFastItemsComponent
  AccountTypes: Array<AccountType> = [];
  ColumnsInput: Array<Column> = []
  Customers: Array<any> = []
  Invoice: InvoiceOrder = { ID: 0, ROW_NUMBER: -1, CUSTOMER_NAME: '', CUSTOMER: 0, DESCOUND_PERCENT: 0, DATE_TIME: new Date(), ITEMS: [], PRICE_AFTER_DESCOUND: 0, NOTS: '', PAYMENT_TYPE: 0,FROM_WAREHOUSE:0,FROM_WAREHOUSE_NAME:'',PAYMENT:0,TYPE:0 }
  constructor(private _tools: Tools, private _ActiveRouter: ActivatedRoute, private _printService: PrintService, private _router: Router) { }
  async ngOnInit() {
    this.Customers = await this._tools.Network.getAsync<any>("Customer")
    this.AccountTypes = (await this._tools.Network.getAsync<any>("AccountType") as Array<AccountType>);
    this.AccountTypes = this.AccountTypes.filter(x => x.IS_ADDED == true && x.IS_AGAL == false);
    this.ColumnsInput.push(new Column('ID', "رقم العملية"))
    this.ColumnsInput.push(new Column('ITEM_ID', "رقم الصنف"))
    this.ColumnsInput.push(new Column('NAME', "اسم الصنف"))
    this.ColumnsInput.push(new Column('UNIT', "وحدة الصنف"))
    this.ColumnsInput.push(new Column('TYPE', "نوع الصنف"))
    this.ColumnsInput.push(new Column('CATEGORY', "التصنيف"))
    this.ColumnsInput.push(new Column('MAIN_PRICE', "سعر الصنف"))
    this.ColumnsInput.push(new Column('PRICE', "السعر في الطلبية", "numberWithFraction"))
    this.ColumnsInput.push(new Column('COUNT', "الكمية", "numberWithFraction"))
    this.ColumnsInput.push(new Column('TOTAL_COUNT', "اجمالي السعر"))
  }
  ngAfterViewInit() {
    this._tools.waitExecuteFunction(100, () => {
      this._ActiveRouter.queryParams.subscribe({
        next: async ({ ID }) => {
          if (+ID > 0) {
            var response = await this._tools.Network.getAsync<InvoiceOrder>("Invoices/GetById?id=" + ID) as InvoiceOrder;
            if (response?.ID > 0) {
              this.Invoice = response;
              await this.InputFastItems.GetOldData();
            }
            else{
              this._tools.Toaster.showError("تم حذف الطلبية")
              this._router.navigate(['Main', 'RequstesList']);
            }
          }
        }
      })
    })
  };
  GridLoaded(dataGrid: DataGridComponent) {
    dataGrid.Columns = this.ColumnsInput;
    dataGrid.onRenderItemSource = (item: RealItem) => {
      item.TOTAL_COUNT = item.PRICE * item.COUNT;
    }
    dataGrid.GridActionFunc = (action) => {
      action.itemEdit.TOTAL_COUNT = action.itemEdit.COUNT * action.itemEdit.PRICE;
    }

  }
  Total(): number {
    return this.Invoice.ITEMS.map(x => x.TOTAL_COUNT).reduce((a, b) => a + b, 0);
  }
  TotalAfterDescound(): number {
    return this.Total() - (this.Total() * (this.Invoice.DESCOUND_PERCENT / 100));
  }
  DescoundValue(): number {
    return (this.Total() * (this.Invoice.DESCOUND_PERCENT / 100));
  }
  TotalAfterDepost(): number {
    return this.TotalAfterDescound() - this.Invoice.PAYMENT;
  }
  Save() {
    this.Invoice.ITEMS = this.InputFastItems.GeneratRequestItems();
    this._tools.Network.putAsync("Invoices/EditMore", [this.Invoice]).then(async (res: any) => {
      if (res?.ID > 0) {
        this.Invoice = res;
        this.InputFastItems.oldData = [];
        await this.InputFastItems.UpdateOnSave();
        this._tools.waitExecuteFunction(500, () => {
          this.print();
          this._tools.waitExecuteFunction(500, () => {
            this._router.navigate(['Main', 'Invoice'], { queryParams: { ID: `${this.Invoice.ID}` } });
          })
        })
      }
    })
  }
  print() {
    let Req = this._tools.cloneObject(this.Invoice) as RequestOrder;
    Req.CUSTOMER_NAME = this.Customers.find(x => x.ID == Req.CUSTOMER)?.NAME;
    Req.PAYMENT_NAME = this.AccountTypes.find(x => x.ID == Req.PAYMENT_TYPE)?.NAME;
    Req.ITEMS = this.InputFastItems.ITEMS_INPUT;
    Req.ITEMS = Req.ITEMS.filter(x => x.TOTAL_COUNT > 0);
    this._printService.printRequest(Req, { Total: this.Total(), TotalAfterDepost: this.TotalAfterDepost(), TotalAfterDescound: this.TotalAfterDescound() })
  }
  AddNew() {
    this._router.navigate(['Main', 'Requstes'], { queryParams: { ID: `0` } })
    this._tools.waitExecuteFunction(100, () => {
      window.location.reload();
    });
  }
  async delete() {
    await this._tools.Network.deleteAsync("Invoice?id=" + this.Invoice.ID)
    this._router.navigate(['Main', 'Invoice'], { queryParams: { ID: this.Invoice.ID } })
    this._tools.waitExecuteFunction(100, () => {
      window.location.reload();
    });
  }
  AddInhert() {
    this.Invoice.ID=0;
    this.Invoice.ROW_NUMBER=-1;
    this.Invoice.ITEMS.forEach(item=>{
      item.ID=-1;
      item.ROW_NUMBER=-1;
    })
    this.InputFastItems.ITEMS_INPUT=this.Invoice.ITEMS;
    this.InputFastItems.ItemsRecorded=[];
    this.InputFastItems.reSelect();
  }
}
