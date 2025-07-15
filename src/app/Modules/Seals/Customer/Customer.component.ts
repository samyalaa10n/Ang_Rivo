import { Component, OnInit } from '@angular/core';
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools.service';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-Customer',
  templateUrl: './Customer.component.html',
  styleUrls: ['./Customer.component.css'],
  imports: [GetAddEditDeleteComponent,NgIf]
})
export class CustomerComponent implements OnInit {

  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }

  async ngOnInit() {
    let Accounts = await this._tools.Network.getAsync("Accounts") as Array<any>;
    this.Columns.push(new Column("ID","الكود"))
    this.Columns.push(new Column("NAME","الأسم","text"))
    this.Columns.push(new Column("ACCOUNT_ID","حساب العميل","comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر الحساب"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = Accounts;
    this.Columns.push(new Column("ACTIVE","مفعل","yes-no"))
    this.Columns.push(new Column("NOTS","الملاحظات","textarea"))
  }

}
