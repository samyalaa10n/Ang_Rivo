import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { NgIf } from '@angular/common';
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools.service';

@Component({
  selector: 'app-AccountTypeOperations',
  templateUrl: './AccountTypeOperations.component.html',
  styleUrls: ['./AccountTypeOperations.component.css'],
  imports: [GetAddEditDeleteComponent,NgIf]
})
export class AccountTypeOperationsComponent implements OnInit {

  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }
  ngOnInit() {
    this.Columns.push(new Column("ID","الكود"))
    this.Columns.push(new Column("NAME","الأسم","text"))
    this.Columns.push(new Column("IS_ADDED","الحساب يضيف الي خزنة الشركة","yes-no"))
    this.Columns.push(new Column("IS_ADDED_IN_BANK","الحساب يضيف الي حساب الشركة","yes-no"))
    this.Columns.push(new Column("IS_MINIS","الحساب يخصم من خزنة الشركة","yes-no"))
    this.Columns.push(new Column("IS_MINIS_IN_BANK","الحساب يخصم من حساب الشركة","yes-no"))
    this.Columns.push(new Column("IS_AGAL_ADD","الحساب يضيف بالأجل","yes-no"))
    this.Columns.push(new Column("IS_AGAL_MINIS","الحساب يخصم بالأجل","yes-no"))
  }

}
