import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Button } from "primeng/button";
import { AccountOperation } from '../../../shared/Types/AccountOperation';
import { AccountType } from '../../../shared/Types/AccountType';
import { Tools } from '../../../shared/service/Tools.service';
import { PrintService } from '../../../shared/service/Print.service';
import { FormsModule } from '@angular/forms';
import { InputNumber } from "primeng/inputnumber";
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";

@Component({
  selector: 'app-AccountOperation',
  templateUrl: './AccountOperation.component.html',
  styleUrls: ['./AccountOperation.component.css'],
  imports: [Button, RouterLink, NgIf, FormsModule, InputNumber, ComboBoxComponent]
})
export class AccountOperationComponent implements OnInit {
  AccountOperation:AccountOperation={ID:0,ROW_NUMBER:-1,ACCOUNT:0,DATE_TIME:new Date(),NOTS:'',TYPE:0,VALUE:0}
  AccountTypes: Array<AccountType> = [];
  Accounts: Array<any> = [];
  constructor(private _tools: Tools, private _ActiveRouter: ActivatedRoute, private _printService: PrintService, private _router: Router) { }
  async ngOnInit() {
    this.AccountTypes = (await this._tools.Network.getAsync<any>("AccountType") as Array<AccountType>);
    this.Accounts = (await this._tools.Network.getAsync<any>("Accounts") as Array<any>);
  }
  ngAfterViewInit() {
    this._tools.waitExecuteFunction(100, () => {
      this._ActiveRouter.queryParams.subscribe({
        next: async ({ ID }) => {
          if (+ID > 0) {
            var response = await this._tools.Network.getAsync<AccountOperation>("AccountOperation/GetById?id=" + ID) as AccountOperation;
            if (response?.ID > 0) {
              this.AccountOperation = response;
            }
            else{
              this._tools.Toaster.showError("تم حذف القيد")
              this._router.navigate(['Main', 'AccountOperationList']);
            }
          }
        }
      })
    })
  };
  Save() {
    this._tools.Network.putAsync("AccountOperation/EditMore", [this.AccountOperation]).then(async (res: any) => {
      if (res?.ID > 0) {
        this.AccountOperation = res;
        this._tools.waitExecuteFunction(500, () => {
          this.print();
          this._tools.waitExecuteFunction(500, () => {
            this._router.navigate(['Main', 'AccountOperation'], { queryParams: { ID: `${this.AccountOperation.ID}` } });
          })
        })
      }
    })
  }
  print() {
    let oper = this._tools.cloneObject(this.AccountOperation) as AccountOperation;
    oper.TYPE_NAME = this.AccountTypes.find(x => x.ID == oper.TYPE)?.NAME;
    oper.ACCOUNT_NAME = this.Accounts.find(x => x.ID == oper.ACCOUNT)?.NAME;
    //this._printService.printRequest(Req, { Total: this.Total(), TotalAfterDepost: this.TotalAfterDepost(), TotalAfterDescound: this.TotalAfterDescound() })
  }
  AddNew() {
    this._router.navigate(['Main', 'AccountOperation'], { queryParams: { ID: `0` } })
    this._tools.waitExecuteFunction(100, () => {
      window.location.reload();
    });
  }
  async delete() {
    this._tools.Confermation.show().then(async result => {
      if (result) {
        await this._tools.Network.deleteAsync("AccountOperation?id=" + this.AccountOperation.ID)
        this._router.navigate(['Main', 'AccountOperation'], { queryParams: { ID: this.AccountOperation.ID } })
        this._tools.waitExecuteFunction(100, () => {
          window.location.reload();
        });
      }
    })
  }
  AddInhert() {
    this.AccountOperation.ID=0;
    this.AccountOperation.ROW_NUMBER=-1;
  }

}
