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
import { CommonModule, NgIf } from '@angular/common';
import { RequestOrder } from '../../../shared/Types/Request';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PrintService } from '../../../shared/service/Print.service';
import { Dialog } from "primeng/dialog";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileManagerComponent } from "../../../shared/components/FileManager/FileManager.component";



@Component({
  selector: 'app-Requstes',
  templateUrl: './Requstes.component.html',
  styleUrls: ['./Requstes.component.css'],
  imports: [DateTimeComponent, ComboBoxComponent, Button, InputNumber, FormsModule, InputFastItemsComponent, NgIf, RouterLink, Dialog, FileManagerComponent, CommonModule]
})
export class RequstesComponent implements OnInit {
  @ViewChild('InputFastItems') InputFastItems!: InputFastItemsComponent
  AccountTypes: Array<AccountType> = [];
  ColumnsInput: Array<Column> = []
  Customers: Array<any> = []
  Places: Array<any> = []
  SpecialDescound: Array<any> = []
  SpecialItemPrice: Array<any> = []
  SesonActive: number = 0;
  somePricies: boolean = false;
  AddCompany: boolean = false;
  safeUrl!: SafeResourceUrl;
  OlRequest!: RequestOrder;
  Request: RequestOrder = { ID: 0, ROW_NUMBER: -1, CUSTOMER_NAME: '', CUSTOMER: 0, DEPOST: 0, DESCOUND_PERCENT: 0, SEND_DATE: new Date(), RESAVE_DATE: new Date(), ITEMS: [], PRICE_AFTER_DESCOUND: 0, NOTS: '', PAYMENT_TYPE: 0, CUSTOMER_BUY_NAME: '', SELLER: '', PHONE: '', PLACE: 0, ADDRESS: "", FILES: "", ISCANCELED: false };
  constructor(private _tools: Tools, private _ActiveRouter: ActivatedRoute, private _printService: PrintService, private _router: Router, private sanitizer: DomSanitizer) { }

  async ngOnInit() {

    await this.UpdetLockep();
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${location.protocol}//${location.host}/#/Main/Customer?TYPE=sherd`
    );
    this.ColumnsInput.push(new Column('ITEM_ID', "Item Number"))
    this.ColumnsInput.push(new Column('NAME', "Item Name"))
    this.ColumnsInput.push(new Column('UNIT', "Item Unit"))
    this.ColumnsInput.push(new Column('PRICE', "Price in Reservation", "numberWithFraction", "numeric"))
    this.ColumnsInput.push(new Column('COUNT', "Quantity", "numberWithFraction", "numeric"))
    this.ColumnsInput.push(new Column('TOTAL_COUNT', "Total Price", "lapel", "numeric"))
    this.ColumnsInput.push(new Column('COMMENTS', "Item Comments", "text"))
  }
  ngAfterViewInit() {
    this._tools.waitExecuteFunction(100, () => {
      this._ActiveRouter.queryParams.subscribe({
        next: async ({ ID }) => {
          if (+ID > 0) {

            var response = await this._tools.Network.getAsync<RequestOrder>("Requstes/GetById?id=" + ID) as RequestOrder;
            if (response?.ID > 0) {
              await this.UpdetLockep()
              this.Request = response;
              this.OlRequest = this._tools.cloneObject(this.Request)
              await this.InputFastItems.GetOldData();

            }
            else {
              this._tools.Toaster.showError("Reservation has been deleted")
              this._router.navigate(['Main', 'RequstesList']);
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
  handleFilesChanged(files: any[]) {
    console.log('Files uploaded:', files);
    // اعمل حاجة بـ files
  }
  async UpdetLockep() {
    this.Places = await this._tools.Network.getAsync("Place") as Array<any>;
    this.Customers = await this._tools.Network.getAsync<any>("Customer")
    this.AccountTypes = (await this._tools.Network.getAsync<any>("AccountType") as Array<AccountType>);
    this.AccountTypes = this.AccountTypes.filter(x => x.IS_ADDED == true || x.IS_ADDED_IN_BANK == true || x.IS_AGAL_ADD == true);

    this.SpecialDescound = await this._tools.Network.getAsync<any>("SpecialDescound")
    this.SpecialItemPrice = await this._tools.Network.getAsync<any>("SpecialItemPrice")
    this.SesonActive = (await this._tools.Network.getAsync<any>("Season/GetActiveSeson") as any)?.SESON ?? 0
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
  calculate(item: RealItem, onStart: boolean = false) {
    item.TOTAL_COUNT = item.PRICE * item.COUNT;
    var NewPrice = this.SpecialItemPrice.find(x => x.ID_ITEM == item.ITEM_ID && x.ID_CUSTOMER == this.Request.CUSTOMER && x.SESON == this.SesonActive)?.PRICE ?? 0;
    if (NewPrice > 0 && item.ID < 0 && this.somePricies == false && onStart) {
      item.PRICE = NewPrice;
    }
    else if (item.ID < 0 && this.somePricies == false && onStart) {
      item.PRICE = item.MAIN_PRICE;
    }
  }
  onSelectCustomer() {
    var desc = this.SpecialDescound.find(x => x.ID_CUSTOMER == this.Request.CUSTOMER && x.SESON == this.SesonActive)
    if (this.Request.ROW_NUMBER < 0) {
      this.Request.DESCOUND_PERCENT = desc?.DESCOUND ?? 0;
    }
    if (this.InputFastItems && this.InputFastItems.ITEMS_INPUT)
      this.InputFastItems.ITEMS_INPUT.forEach(item => {
        this.calculate(item, true)
      })
  }
  Total(): number {
    return this.InputFastItems?.ITEMS_INPUT?.map(x => x.TOTAL_COUNT)?.reduce((a, b) => a + b, 0);
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
  Save(IS_CANCEL: boolean = false) {
    this.Request.ITEMS = this.InputFastItems.GeneratRequestItems();
    this._tools.Network.putAsync("Requstes/EditMore", [this.Request]).then(async (res: any) => {
      if (res?.ID > 0) {
        this.Request = res;
        this.InputFastItems.oldData = [];
        await this.InputFastItems.UpdateOnSave();
        this._tools.waitExecuteFunction(500, async () => {
          if (IS_CANCEL == false) {
            await this.print();
            this._tools.waitExecuteFunction(500, () => {
              this._router.navigate(['Main', 'Requstes'], { queryParams: { ID: `${this.Request.ID}` } });
              window.location.reload();
            })
          }
        })
      }
    })
  }
  async print(InAnotherPage: boolean = true, OnlyPrint: boolean = false) {
    let Req = OnlyPrint ? this.OlRequest : this._tools.cloneObject(this.Request) as RequestOrder;
    Req.CUSTOMER_NAME = this.Customers.find(x => x.ID == Req.CUSTOMER)?.NAME;
    Req.PLACE_NAME = this.Places.find(x => x.ID == Req.PLACE)?.NAME;
    Req.PAYMENT_NAME = this.AccountTypes.find(x => x.ID == Req.PAYMENT_TYPE)?.NAME;
    Req.ITEMS = this.InputFastItems.ITEMS_INPUT;
    Req.ITEMS = Req.ITEMS.filter(x => x.COUNT > 0);
    await this._printService.printRequest(Req, { Total: this.Total(), TotalAfterDeposit: this.TotalAfterDepost(), TotalAfterDiscount: this.TotalAfterDescound() }, InAnotherPage)

  }
  AddNew() {
    this._router.navigate(['Main', 'Requstes'], { queryParams: { ID: `0` } })
    this._tools.waitExecuteFunction(100, () => {
      window.location.reload();
    });
  }
  async delete() {
    this._tools.Confermation.show().then(async result => {
      if (result) {
        await this._tools.Network.deleteAsync("Requstes?id=" + this.Request.ID)
        this._router.navigate(['Main', 'Requstes'], { queryParams: { ID: this.Request.ID } })
        this._tools.waitExecuteFunction(100, () => {
          window.location.reload();
        });
      }
    })
  }
  async CancelRequest() {
    this._tools.Confermation.show("Are you sure").then(async (r) => {
      if (r) {
        this.Request.ISCANCELED = true;
        await this.Save(true);
      }
    })
  }
  async ReturnCancelRequest() {
    this._tools.Confermation.show("Are you sure").then(async (r) => {
      if (r) {
        this.Request.ISCANCELED = false;
        await this.Save(true);
      }
    })

  }
  async AddInhert() {
    this.somePricies = await this._tools.Confermation.show("Do you want to copy prices as well with quantities?", "Question")
    this.Request.ID = 0;
    this.Request.ROW_NUMBER = -1;
    this.Request.ITEMS.forEach(item => {
      item.ID = -1;
      item.ROW_NUMBER = -1;
    })
    this.InputFastItems.ITEMS_INPUT = this.Request.ITEMS;
    this.InputFastItems.ItemsRecorded = [];
    this.InputFastItems.reSelect();
  }
  async PrintCleck() {
    this._tools.waitExecuteFunction(500, async () => {
      await this.print(true, true);
      this._tools.waitExecuteFunction(500, () => {
        this._router.navigate(['Main', 'Requstes'], { queryParams: { ID: `${this.Request.ID}` } });
        window.location.reload();
      })
    })
  }
}