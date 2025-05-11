import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-AttendanceAndDepartureDevices',
  templateUrl: './AttendanceAndDepartureDevices.component.html',
  styleUrls: ['./AttendanceAndDepartureDevices.component.css'],
  standalone:true,
  imports: [GetAddEditDeleteComponent,NgIf]
})
export class AttendanceAndDepartureDevicesComponent implements OnInit {
  Columns: Array<Column> = [];
  constructor() { }

  ngOnInit() {
    this.Columns.push(new Column('ID', "الكود", "lapel", "text"))
    this.Columns.push(new Column('CODE', "رقم الكينة", "number", "numeric"))
    this.Columns.push(new Column('NAME', "الأسم", "text", "text"))
    this.Columns.push(new Column('IP', "IP", "text", "text"));
    this.Columns.push(new Column('TYPE', "نوع البصمة", "comboBox", "comboBox"));
    this.Columns[4].columnComboBoxOptionLabel="NAME"
    this.Columns[4].columnComboBoxOptionValue="NAME"
    this.Columns[4].columnComboBoxPlaceholder="نزع البصمة"
    this.Columns[4].columnComboBoxDataSource=[{"NAME":"حضور"},{"NAME":"أنصراف"},{"NAME":"حضور و انصراف"}];
  }

}
