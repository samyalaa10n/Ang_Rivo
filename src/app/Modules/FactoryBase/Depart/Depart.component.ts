import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools.service';
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
    let companies = await this._tools.Network.getAsync("Company") as Array<any>;
    this.Columns.push(new Column('ID', "Code", "lapel", "text"))
    this.Columns.push(new Column('NAME', "Name", "text", "text", 400))
    this.Columns.push(new Column('EMAIL_IN_REQUEST', "Send Email On Request To", "text", "text", 400))
    this.Columns.push(new Column('COMPANY_ID', "Company", "comboBox", "comboBox", 200));
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "Select the Company for this Department"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = companies;
  }
  async update() {
    let companies = await this._tools.Network.getAsync("Company") as Array<any>;
    this.Columns[3].columnComboBoxDataSource = companies;
  }
  configTable(grid: DataGridComponent) {
    grid.Columns = this.Columns;
    grid.canSelectedSomeColumns = true;
  }
}