import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { NgIf } from '@angular/common';
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools';

@Component({
  selector: 'app-EffectInSystem',
  templateUrl: './EffectInSystem.component.html',
  styleUrls: ['./EffectInSystem.component.css'],
  imports: [GetAddEditDeleteComponent, NgIf]
})
export class EffectInSystemComponent implements OnInit {
  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }
  async ngOnInit() {
    let EffectColumns = await this._tools.getAsync("EffectColumn") as Array<any>
    this.Columns.push(new Column("ID", "الكود"))
    this.Columns.push(new Column("NAME", "الأسم", "text", 'text', 200))
    this.Columns.push(new Column("IS_PLUS", "مضاف علي القبض", "yes-no","none", 200))
    this.Columns.push(new Column("COLUMNS", "بنود المؤئثر", "multiSelect", "comboBox"))
    this.Columns[this.Columns.length - 1].columnMultiOptionLabel = "COLUMN_NAME";
    this.Columns[this.Columns.length - 1].columnMultiSelectpropertyBind = "COLUMNS";
    this.Columns[this.Columns.length - 1].columnMultiSelectOptionValue = "EFFECT_COLUMN_ID";
    this.Columns[this.Columns.length - 1].columnMultiSelectselectIdKey = "EFFECT_SYSTEM_ID";
    this.Columns[this.Columns.length - 1].columnMultiPlaceholder = "اختر بنود المؤثر"
    this.Columns[this.Columns.length - 1].columnMultiSelectDataSource = EffectColumns;
  }
  async update() {
    let EffectColumns = await this._tools.getAsync("EffectColumn") as Array<HTMLElement>;
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = EffectColumns;
  }
}
