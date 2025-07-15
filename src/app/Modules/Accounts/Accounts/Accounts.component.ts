import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { Tools } from '../../../shared/service/Tools.service';
import { Column } from '../../../shared/components/dataGrid/Column';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-Accounts',
  templateUrl: './Accounts.component.html',
  styleUrls: ['./Accounts.component.css'],
  imports: [GetAddEditDeleteComponent,NgIf]
})
export class AccountsComponent implements OnInit {

  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }

  ngOnInit() {
    this.Columns.push(new Column("ID","الكود"))
    this.Columns.push(new Column("NAME","الأسم","text"))
    this.Columns.push(new Column("NOTS","الملاحظات","textarea"))
  }

}
