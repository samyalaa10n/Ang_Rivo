import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-Season',
  templateUrl: './Season.component.html',
  styleUrls: ['./Season.component.css'],
  imports: [GetAddEditDeleteComponent,NgIf]
})
export class SeasonComponent implements OnInit {

  Columns: Array<Column> = [];
  constructor() { }

  ngOnInit() {
    this.Columns.push(new Column("ID",'رقم الموسم'))
    this.Columns.push(new Column("NAME",'اسم الموسم',"text"))
    this.Columns.push(new Column("IS_ACTIVE",'الموسم الحالي',"yes-no"))
  }

}
