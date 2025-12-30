import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from '../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component';
import { Column } from '../../../shared/components/dataGrid/Column';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-Company',
  templateUrl: './Company.component.html',
  styleUrls: ['./Company.component.css'],
  standalone:true,
  imports: [GetAddEditDeleteComponent, NgIf]
})
export class CompanyComponent implements OnInit {
  Columns: Array<Column> = [];
  constructor() { }

  ngOnInit() {
        this.Columns.push(new Column('ID', "Code", "lapel", "text"))
        this.Columns.push(new Column('NAME', "Name", "text", "text", 400))
        this.Columns.push(new Column('EMAIL_IN_REQUEST', "Send Email On Request To", "text", "text", 400))
  }

}
