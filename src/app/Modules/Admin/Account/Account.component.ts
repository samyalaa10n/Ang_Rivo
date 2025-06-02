import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { NgIf } from '@angular/common';
import { Tools } from '../../../shared/service/Tools.service';

@Component({
  selector: 'app-Account',
  templateUrl: './Account.component.html',
  styleUrls: ['./Account.component.css'],
  imports: [GetAddEditDeleteComponent,NgIf]
})
export class AccountComponent implements OnInit {
  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }

  ngOnInit() {
    this.Columns.push(new Column('ID', "الكود", "lapel", "text"))
    this.Columns.push(new Column('NAME', "الأسم", "text", "text"))
    this.Columns.push(new Column('USER_NAME', "اسم المستخدم", "text", "text"))
    this.Columns.push(new Column('PASSWORD', "كلمة المرور", "text", "text"))
    this.Columns.push(new Column('IS_ACTIVE', "مفعل ام لأ", "yes-no", "yes-no"))
  }

}
