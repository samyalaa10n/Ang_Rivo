import { Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';
import { StepperComponent } from "../../../shared/components/stepper/stepper.component";
import { StepperConfiguration } from '../../../shared/components/stepper/stepper.configuration';
import { StepConfigurationDirective } from '../../../shared/components/stepper/Step-Configuration.directive';
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { DateTimeComponent } from "../../../shared/components/DateTime/DateTime.component";
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";
import { Button } from "primeng/button";
import { InputLabelComponent } from "../../../shared/pages/TextLabel/InputLabel.component";
import { InputNumber } from "primeng/inputnumber";
import { Column } from '../../../shared/components/dataGrid/Column';
import { FormsModule } from '@angular/forms';
import { MultiselectComponent } from "../../../shared/components/multiselect/multiselect.component";
import { Tools } from '../../../shared/service/Tools.service';
import { AutoComplete } from "primeng/autocomplete";
import { InputFastItemsComponent } from "../../../shared/pages/InputFastItems/InputFastItems.component";
import { RealItem } from '../../../shared/Types/RealItem';
import { AccountType } from '../../../shared/Types/AccountType';
import { NgIf } from '@angular/common';
import { RequestOrder } from '../../../shared/Types/Request';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../../../shared/service/Print.service';


@Component({
  selector: 'app-Requstes',
  templateUrl: './Requstes.component.html',
  styleUrls: ['./Requstes.component.css'],
  imports: [DateTimeComponent, ComboBoxComponent, Button, InputNumber, FormsModule, InputFastItemsComponent, NgIf]
})
export class RequstesComponent implements OnInit {
  @ViewChild('InputFastItems') InputFastItems!: InputFastItemsComponent
  StepperConfig: StepperConfiguration = new StepperConfiguration(this);
  AccountTypes: Array<AccountType> = [];
  ColumnsInput: Array<Column> = []
  Customers: Array<any> = []
  Request: RequestOrder = { ID: 0, ROW_NUMBER: -1, CUSTOMER_NAME: '', CUSTOMER: 0, DEPOST: 0, DESCOUND_PERCENT: 0, SEND_DATE: new Date(), RESAVE_DATE: new Date(), ITEMS: [], PRICE_AFTER_DESCOUND: 0, NOTS: '', PAYMENT_TYPE: 0 }
  constructor(private _tools: Tools, private _ActiveRouter: ActivatedRoute, private _printService: PrintService) { }
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
      this._ActiveRouter.queryParams.subscribe(async ({ ID }) => {
        if (+ID > 0) {
          var response = await this._tools.Network.getAsync<RequestOrder>("Requstes/GetById?id=" + ID) as RequestOrder;
          if (response?.ID > 0) {
            this.Request = response;
            await this.InputFastItems.GetOldData();
          }
        }
      })
    })

  }
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
    return this.Request.ITEMS.map(x => x.TOTAL_COUNT).reduce((a, b) => a + b, 0);
  }
  TotalAfterDescound(): number {
    return this.Total() - (this.Total() * (this.Request.DESCOUND_PERCENT / 100));
  }
  DescoundValue(): number {
    return (this.Total() * (this.Request.DESCOUND_PERCENT / 100));
  }
  TotalAfterDepost(): number {
    return this.TotalAfterDescound() - this.Request.DEPOST;
  }
  Save() {
    this._tools.Network.putAsync("Requstes/EditMore", [this.Request]).then(async (res: any) => {
      this.Request = res;
      this.InputFastItems.oldData = [];
      await this.InputFastItems.Update();
      this._tools.waitExecuteFunction(500, () => { this.print(); })
    })
  }
  print() {
    let Req = this._tools.cloneObject(this.Request) as RequestOrder;
    Req.CUSTOMER_NAME = this.Customers.find(x => x.ID == Req.CUSTOMER)?.NAME;
    Req.PAYMENT_NAME = this.AccountTypes.find(x => x.ID == Req.PAYMENT_TYPE)?.NAME;
    Req.ITEMS = Req.ITEMS.filter(x => x.TOTAL_COUNT > 0);
    this._printService.printRequest(Req, { Total: this.Total(), TotalAfterDepost: this.TotalAfterDepost(), TotalAfterDescound: this.TotalAfterDescound() })
  }
}
