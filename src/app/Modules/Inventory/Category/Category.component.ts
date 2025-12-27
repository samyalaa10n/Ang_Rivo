import { Component, OnInit } from '@angular/core';
import { Tools } from '../../../shared/service/Tools.service';
import { Column } from '../../../shared/components/dataGrid/Column';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { NgIf } from '@angular/common';
import { DataGridComponent } from '../../../shared/components/dataGrid/dataGrid.component';

@Component({
  selector: 'app-Category',
  templateUrl: './Category.component.html',
  styleUrls: ['./Category.component.css'],
  imports: [GetAddEditDeleteComponent, NgIf]
})
export class CategoryComponent implements OnInit {

  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }

  async ngOnInit() {
    let Depart = await this._tools.Network.getAsync("Depart") as Array<any>;
    let Category = await this._tools.Network.getAsync("Category") as Array<any>;
    this.Columns.push(new Column('ID', "Code", "lapel", "text"))
    this.Columns.push(new Column('NAME', "Name", "text", "text", 400))
    this.Columns.push(new Column('FATHER', "Parent Category", "comboBox", "text", 400))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "Parent Category"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = Category;
    this.Columns.push(new Column('DEPART_ID', "Department", "comboBox", "comboBox", 200));
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "Select the Department for this Category"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = Depart;
  }
  config(dataGrid: DataGridComponent) {
    dataGrid.AllowCopyPest = true;
    dataGrid.Pest = async () => {
      var data = await navigator.clipboard.readText();
      if (data && typeof data =="string") {
        let rows = data.split('\r');
        let clondata=this._tools.cloneObject(dataGrid.dataSource);
        for (let i = 0; i < rows.length; i++) {
          let Nitem={
            ID:-1,
            NAME:rows[i].replace('\n','').trim(),
            ROW_NUMBER:-1,
            FATHER:0,
            DEPART:0
          }
          clondata.push(Nitem);
        }
        dataGrid.dataSource=clondata;
      }
    }
  }
  async update() {
      let Depart = await this._tools.Network.getAsync("Depart") as Array<any>;
      let Category = await this._tools.Network.getAsync("Category") as Array<any>;
      this.Columns[2].columnComboBoxDataSource = Category;
      this.Columns[3].columnComboBoxDataSource = Depart;
    }
  }