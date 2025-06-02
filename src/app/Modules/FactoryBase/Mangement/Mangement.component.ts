import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from '../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component';
import { Tools } from '../../../shared/service/Tools.service';
import { DataGridComponent } from '../../../shared/components/dataGrid/dataGrid.component';
import { Column } from '../../../shared/components/dataGrid/Column';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-Mangement',
  templateUrl: './Mangement.component.html',
  styleUrls: ['./Mangement.component.css'],
  standalone: true,
  imports: [GetAddEditDeleteComponent,NgIf]
})
export class MangementComponent implements OnInit {
  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }

  async ngOnInit() {
    let fateherMangement = await this._tools.Network.getAsync("Mangement") as Array<any>;
    let Departs = await this._tools.Network.getAsync("Depart") as Array<any>;
    this.Columns.push(new Column('ID', "الكود", "lapel", "text"))
    this.Columns.push(new Column('POSATION', "الأسم", "text", "text", 400))
    this.Columns.push(new Column('POSATION_FATHER_ID', "المدير", "comboBox", "comboBox", 200));
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "POSATION";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر المدير"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = fateherMangement;
    this.Columns.push(new Column('DEPART_ID', "القسم", "comboBox", "comboBox", 200));
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر القسم"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = Departs;

  }
  configTable(grid: DataGridComponent) {
    grid.Columns = this.Columns;
    grid.canSelectedSomeColumns = true;
  }
  async update() {
    let fateherMangement = await this._tools.Network.getAsync("Mangement") as Array<any>;
    let Departs = await this._tools.Network.getAsync("Depart") as Array<any>;
    this.Columns[2].columnComboBoxDataSource = fateherMangement;
    this.Columns[3].columnComboBoxDataSource = Departs;
  }
}
