import { Component, OnInit } from '@angular/core';
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools.service';
import { NgIf } from '@angular/common';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { Button } from "primeng/button";
import { CustomColumnDirective } from '../../../shared/components/dataGrid/CustomColumn.directive';
import { Router } from '@angular/router';


@Component({
  selector: 'app-Items',
  templateUrl: './Items.component.html',
  styleUrls: ['./Items.component.css'],
  imports: [NgIf, GetAddEditDeleteComponent, Button, CustomColumnDirective]
})
export class ItemsComponent implements OnInit {
  Category: Array<any> = [];
  Columns: Array<Column> = [];
  constructor(private _tools: Tools, private _router: Router) { }
  async ngOnInit() {
    this.Category = await this._tools.Network.getAsync("Category") as Array<any>;
    this.Columns.push(new Column("ID", "Item Number"))
    this.Columns.push(new Column("NAME", "Name", "text"))
    this.Columns.push(new Column("CATEGORY", "Category", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "Select Category"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = this.Category;
    this.Columns.push(new Column("UNIT", "Sales Unit", "text"))
    this.Columns.push(new Column("TYPE", "Item Type", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "Select Item Type"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = [{ NAME: "Raw Material" }, { NAME: "Finished Product" }, { NAME: "Semi-Finished" }];
    this.Columns.push(new Column("PRICE_GET", "Purchase Price", "numberWithFraction"))
    this.Columns.push(new Column("PRICE_SEAL", "Selling Price", "numberWithFraction"))
    //this.Columns.push(new Column("TEX", "Tax %", "numberWithFraction"))
    //this.Columns.push(new Column("MAX_REQUEST_IN_HOUER", "Maximum Hourly Request Limit", "number"))
    this.Columns.push(new Column("NOTS", "Notes", "textarea"))
    this.Columns.push(new Column('EMAIL_IN_REQUEST', "Send Email On Request To", "text", "text"))
    this.Columns.push(new Column('IS_ACTIVATED', "Is Active", "yes-no", "boolean"))

  }

  async update() {
    this.Category = await this._tools.Network.getAsync("Category") as Array<any>;
    this.Columns[2].columnComboBoxDataSource = this.Category
  }
  onConfigGrid(config: DataGridComponent) {
    config.AllowCopyPest = true
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
      var data = await navigator.clipboard.readText();
      console.log(data);
      if (data && typeof data == "string") {
        let rows = data.split('\r');
        let clondata = this._tools.cloneObject(config.dataSource);
        for (let i = 0; i < rows.length; i++) {
          let cells = rows[i].replace('\n', '').trim().split('\t');
          if (cells[1]?.trim() != '' && cells[1]?.trim() != null) {
            let Nitem = {
              ID: -1,
              NAME: cells[1].trim() ?? '',
              CATEGORY: this.Category.find(x => x.NAME == cells[0]?.trim())?.ID ?? 0,
              UNIT: cells[2].trim() ?? '',
              TYPE: "Finished Product",
              PRICE_GET: 0,
              PRICE_SEAL: Number.parseFloat(cells[3] != '' && cells[3] != null ? cells[3].trim() : '0') ? parseFloat(cells[3]) : 0,
              TEX: 0,
              NOTS: "",
              ROW_NUMBER: -1
            }
            clondata.push(Nitem);
          }
        }
        config.dataSource = clondata;
      }
    }
    config.AllowImportExcel = true;
    config.IsHasChild = true;
    config.onRenderItemSource = (item) => {
      if (item.PRICE_SEAL == 0 && item.TYPE != "Finished Product") {
        item.PRICE_SEAL = item.PRICE_GET
      }
    }
    config.onLoadedChildDataGrid = (pernt, child, row) => {
      child.StopAllButtons = true;
      child.paginator = false;
      this._tools.waitExecuteFunction(100, () => { child.AllowExportExcel = true; })
      child.Columns.push(new Column("IN_DATE", "Change Date", "lapel"))
      child.Columns[child.Columns.length - 1].Style_Show = (VALUE) => {
        return this._tools.DateTime.EditFormateData(VALUE, "DD-MM-yyyy")
      }
      child.Columns.push(new Column("ID", "Record Code"))
      child.Columns.push(new Column("NAME", "Name", "lapel"))
      child.Columns.push(new Column("CATEGORY", "Category", "lapel"))
      child.Columns[child.Columns.length - 1].Style_Show = (VALUE) => {
        return this.Category.find(x => x.ID == VALUE)?.NAME ?? ''
      }
      child.Columns.push(new Column("UNIT", "Unit", "lapel"))
      child.Columns.push(new Column("TYPE", "Item Type", "lapel"))
      child.Columns.push(new Column("PRICE_GET", "Purchase Price", "lapel"))
      child.Columns.push(new Column("PRICE_SEAL", "Selling Price", "lapel"))
      //child.Columns.push(new Column("TEX", "Tax %", "lapel"))
      //child.Columns.push(new Column("MAX_REQUEST_IN_HOUER", "Maximum Hourly Request Limit", "lapel"))
      child.Columns.push(new Column("NOTS", "Notes", "lapel"))
      child.Columns.push(new Column('EMAIL_IN_REQUEST', "Send Email On Request To","lapel"))
      child.Columns = child.Columns;
      child.dataSource = row?.ITEM_HESTORY ?? [];
      child.dataSource = child.dataSource.sort((Item2, Item1) => {
        return Item1.ID > Item2.ID ? 1 : -1;
      })
    }
  }
  openRaspy(item: any) {
    this._router.navigate(['Main', 'Raspy'], { queryParams: { ID: item.ID } })
  }
}