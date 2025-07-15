import { Component, OnInit } from '@angular/core';
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools.service';
import { NgIf } from '@angular/common';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";

@Component({
  selector: 'app-Items',
  templateUrl: './Items.component.html',
  styleUrls: ['./Items.component.css'],
  imports: [NgIf, GetAddEditDeleteComponent]
})
export class ItemsComponent implements OnInit {

  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }
  async ngOnInit() {
    let Category = await this._tools.Network.getAsync("Category") as Array<any>;
    this.Columns.push(new Column("ID", "رقم الصنف"))
    this.Columns.push(new Column("NAME", "الأسم", "text"))
    this.Columns.push(new Column("CATEGORY", "التصنيف", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر التصنيف"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = Category;
    this.Columns.push(new Column("UNIT", "الوحدة", "text"))
    this.Columns.push(new Column("TYPE", "نوع الصنف", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر نوع الصنف"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = [{ NAME: "خامة" }, { NAME: "منتج تام" }, { NAME: "نصف مصنع" }];
    this.Columns.push(new Column("PRICE_GET", "سعر الشراء", "numberWithFraction"))
    this.Columns.push(new Column("PRICE_SEAL", "سعر البيع", "numberWithFraction"))
    this.Columns.push(new Column("NOTS", "الملاحظات", "textarea"))
  }

  async update() {
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = await this._tools.Network.getAsync("Category") as Array<any>;
  }
}
