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
  Category: Array<any> = [];
  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }
  async ngOnInit() {
    this.Category = await this._tools.Network.getAsync("Category") as Array<any>;
    this.Columns.push(new Column("ID", "رقم الصنف"))
    this.Columns.push(new Column("NAME", "الأسم", "text"))
    this.Columns.push(new Column("CATEGORY", "التصنيف", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر التصنيف"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = this.Category;
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
    this.Category = await this._tools.Network.getAsync("Category") as Array<any>;
    this.Columns[2].columnComboBoxDataSource = this.Category
  }
  onConfigGrid(config: DataGridComponent) {
    config.AllowCopyPest=true
    config.importExcel = (e) => {
      this._tools.Excel.ExcelFileChange(e, (Data) => {
        if (Array.isArray(Data)) {
          let Nds = this._tools.cloneObject(config.dataSource);
          Data.forEach((item) => {
            item.ID = -1;
            item.ROW_NUMBER = -1;
            Nds.push(item);
          })
          config.dataSource = Nds;
        }
      })
    }
    config.Pest = async () => {
    this._tools.Toaster.showInfo("لا يمكن الصق في هذه القائمة")
    }
    config.AllowImportExcel = true;
    config.IsHasChild = true;
    config.onLoadedChildDataGrid = (pernt, child, row) => {
      child.StopAllButtons = true;
      child.paginator = false;
      this._tools.waitExecuteFunction(100, () => { child.AllowExportExcel = true; })
      child.Columns.push(new Column("IN_DATE", "تاريخ التغير", "lapel"))
      child.Columns[child.Columns.length - 1].Style_Show = (VALUE) => {
        return this._tools.DateTime.EditFormateData(VALUE, "DD-MM-yyyy")
      }
      child.Columns.push(new Column("ID", "كود السجل"))
      child.Columns.push(new Column("NAME", "الأسم", "lapel"))
      child.Columns.push(new Column("CATEGORY", "التصنيف", "lapel"))
      child.Columns[child.Columns.length - 1].Style_Show = (VALUE) => {
        return this.Category.find(x => x.ID == VALUE)?.NAME ?? ''
      }
      child.Columns.push(new Column("UNIT", "الوحدة", "lapel"))
      child.Columns.push(new Column("TYPE", "نوع الصنف", "lapel"))
      child.Columns.push(new Column("PRICE_GET", "سعر الشراء", "lapel"))
      child.Columns.push(new Column("PRICE_SEAL", "سعر البيع", "lapel"))
      child.Columns.push(new Column("NOTS", "الملاحظات", "lapel"))
      child.Columns = child.Columns;
      child.dataSource = row?.ITEM_HESTORY ?? [];
      child.dataSource = child.dataSource.sort((Item2, Item1) => {
        return Item1.ID > Item2.ID ? 1 : -1;
      })
    }
  }
}
