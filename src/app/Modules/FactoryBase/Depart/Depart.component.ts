import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools';
import { NgIf } from '@angular/common';
import { DataGridComponent } from '../../../shared/components/dataGrid/dataGrid.component';
import { MultiselectComponent } from '../../../shared/components/multiselect/multiselect.component';

@Component({
  selector: 'app-Depart',
  templateUrl: './Depart.component.html',
  styleUrls: ['./Depart.component.css'],
  imports: [GetAddEditDeleteComponent, NgIf],
  standalone: true,
})
export class DepartComponent implements OnInit {

  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }
  async ngOnInit() {
    let companies = await this._tools.getAsync("Company") as Array<any>;
    this.Columns.push(new Column('ID', "الكود", "lapel", "text"))
    this.Columns.push(new Column('NAME', "الأسم", "text", "text", 400))
    this.Columns.push(new Column('COMPANY_ID', "الشركة", "comboBox", "comboBox", 200));
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر الشركة التابعة لة القسم"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = companies;

    // this.Columns[this.Columns.length - 1].columnMultiOptionLabel = "POSATION";
    // this.Columns[this.Columns.length - 1].columnMultiPlaceholder = "الاوضاع الوظيفية الموجود بها القسم";
    // this.Columns[this.Columns.length - 1].columnMultiSelectDataSource = Mangements;
    // this.Columns[this.Columns.length - 1].columnMultiSelectselectIdKey = "DEPART_ID";
    // this.Columns[this.Columns.length - 1].columnMultiSelectOptionValue = "POSATION_ID";
    // this.Columns[this.Columns.length - 1].columnMultiSelectpropertyBind = "In_POSATIONS";
  }
  async update() {
    let companies = await this._tools.getAsync("Company") as Array<any>;
    this.Columns[2].columnComboBoxDataSource = companies;
  }
  configTable(grid: DataGridComponent) {
    grid.Columns = this.Columns;
    grid.canSelectedSomeColumns = true;
  }
}
