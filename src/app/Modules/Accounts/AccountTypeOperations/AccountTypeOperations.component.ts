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
    this.Columns.push(new Column("ID","Code"))
    this.Columns.push(new Column("NAME","Name","text"))
    this.Columns.push(new Column("IS_ADDED","Account Adds to Company Treasury","yes-no"))
    this.Columns.push(new Column("IS_ADDED_IN_BANK","Account Adds to Company Bank Account","yes-no"))
    this.Columns.push(new Column("IS_MINIS","Account Deducts from Company Treasury","yes-no"))
    this.Columns.push(new Column("IS_MINIS_IN_BANK","Account Deducts from Company Bank Account","yes-no"))
    this.Columns.push(new Column("IS_AGAL_ADD","Account Adds on Credit","yes-no"))
    this.Columns.push(new Column("IS_AGAL_MINIS","Account Deducts on Credit","yes-no"))
  }

}