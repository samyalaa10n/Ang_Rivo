import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-UnitsControl',
  templateUrl: './UnitsControl.component.html',
  styleUrls: ['./UnitsControl.component.css'],
  imports: [GetAddEditDeleteComponent, NgIf]
})
export class UnitsControlComponent implements OnInit {

  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }
  async ngOnInit() {
    let Units = await this._tools.Network.getAsync("Units") as Array<any>;
    this.Columns.push(new Column('ID', "الكود", "lapel", "text"))
    this.Columns.push(new Column('NAME', "الأسم", "text", "text", 200))
    this.Columns.push(new Column('COUNT', "الكمية من", "numberWithFraction", "numeric", 100))
    this.Columns.push(new Column('FROM_UNIT', "الوحدة الأساسية", "comboBox", "comboBox", 200))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر الوحدة الأساسية"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = Units;
  }

  async update() {
    let Units = await this._tools.Network.getAsync("Units") as Array<any>;
    this.Columns[3].columnComboBoxDataSource = Units;
  }
}
