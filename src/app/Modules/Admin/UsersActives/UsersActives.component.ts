
import { Component, OnInit, ViewChild } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { NgIf } from '@angular/common';
import { Tools } from '../../../shared/service/Tools.service';
import { DataGridComponent, GridAction } from '../../../shared/components/dataGrid/dataGrid.component';
import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MultiselectComponent } from "../../../shared/components/multiselect/multiselect.component";
import { CustomColumnDirective } from '../../../shared/components/dataGrid/CustomColumn.directive';
import { DialogModule } from 'primeng/dialog';
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";

@Component({
  selector: 'app-UsersActives',
  templateUrl: './UsersActives.component.html',
  styleUrls: ['./UsersActives.component.css'],
  imports: [GetAddEditDeleteComponent, NgIf, DialogModule, ButtonModule]
})
export class UsersActivesComponent implements OnInit {
  Columns: Array<Column> = [];
  columnsChildGrid: Array<Column> = []
  Promotions: Array<any> = []
  PromotionSelected: any = {};
  showDialogAddSitting: boolean = false;
  @ViewChild('CardOperation') CardOperation!: GetAddEditDeleteComponent
  constructor(private _tools: Tools) { }

  async ngOnInit() {
    this.Columns.push(new Column('NAME', "Name"))
    this.Columns.push(new Column('IS_ONLINE', " Online", "yes-no", "yes-no"))
    this.Columns.push(new Column('DEVICE_TYPE', "Device Type"))
    this.Columns.push(new Column('OPERATING_SYSTEM', "Operating System"))
    this.Columns.push(new Column('BROWSER', "Browser"))
    this.Columns.push(new Column('IN_DATE', "Login Time"))
    this.Columns[5].Style_Show = (val: any) => {
      return this._tools.DateTime.EditFormateData(val);
    }
  }

  config(grid: DataGridComponent) {
    grid.AllowCurdOperation = true;
    grid.AllowAdd = false;
    grid.AllowEdit = false;
    grid.AddInherit = false;
    grid.canSelectRow = false;
    grid.AllowSearch = false;
    grid.AllowDelete = true;
    grid.AllowDeleteSelected = false;
    grid.AllowSearch = false;
    grid.AllowSave = true;
    grid.AllowExportExcel = false;
  }
}
