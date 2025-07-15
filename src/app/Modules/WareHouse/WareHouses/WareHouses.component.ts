import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { NgIf } from '@angular/common';
import { Tools } from '../../../shared/service/Tools.service';

@Component({
  selector: 'app-WareHouses',
  templateUrl: './WareHouses.component.html',
  styleUrls: ['./WareHouses.component.css'],
  imports: [GetAddEditDeleteComponent,NgIf]
})
export class WareHousesComponent implements OnInit {
  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }

  async ngOnInit() {
    let Departs = await this._tools.Network.getAsync("Depart") as Array<any>;
    this.Columns.push(new Column('ID', "الكود", "lapel", "text"))
    this.Columns.push(new Column('NAME', "الأسم", "text", "text", 400))
    this.Columns.push(new Column('DEPART', "القسم", "comboBox", "comboBox", 200));
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر القسم التابعة لة المخزن"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = Departs;
  }

}
