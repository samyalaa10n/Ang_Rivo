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
  selector: 'app-RuleGroup',
  templateUrl: './RuleGroup.component.html',
  styleUrls: ['./RuleGroup.component.css'],
  imports: [GetAddEditDeleteComponent, NgIf, DialogModule, ButtonModule]
})
export class RuleGroupComponent implements OnInit {
  Columns: Array<Column> = [];
  columnsChildGrid: Array<Column> = []
  Promotions: Array<any> = []
  PromotionSelected: any={};
  showDialogAddSitting:boolean=false;
  @ViewChild('CardOperation') CardOperation!: GetAddEditDeleteComponent
  constructor(private _tools: Tools) { }

  async ngOnInit() {
    this.Promotions = await this._tools.Network.getAsync("RuleGroup/GetPromotions") as Array<any>;
    this.Columns.push(new Column('ID', "Code", "lapel", "text"))
    this.Columns.push(new Column('NAME', "Group Name", "text", "text"))
    this.Columns.push(new Column('IS_ACTIVE', "Active","yes-no", "yes-no"))
    this.columnsChildGrid.push(new Column("NAME_PERMITION", "Permission Name"))
    this.columnsChildGrid.push(new Column("VALUES", "Properties", "custom"))
    this.columnsChildGrid[this.columnsChildGrid.length - 1].columnMultiPlaceholder = "Select Properties";
    this.columnsChildGrid[this.columnsChildGrid.length - 1].columnMultiOptionLabel = "NAME";
    this.columnsChildGrid[this.columnsChildGrid.length - 1].columnMultiSelectOptionValue = "ID";
    this.columnsChildGrid[this.columnsChildGrid.length - 1].columnMultiSelectDataSource = [{ ID: 1, NAME: "View" }, { ID: 2, NAME: "Add" }, { ID: 3, NAME: "Edit" }, { ID: 4, NAME: "Delete" }]
  }
  async ngAfterViewInit() {
    this._tools.waitExecuteFunction(100, () => {
      this.CardOperation.grid.Columns = this.Columns
      this.CardOperation.grid.AllowCurdOperation=false;
      this.CardOperation.grid.AllowAdd=false;
      this.CardOperation.grid.AllowEdit=false;
      this.CardOperation.grid.canSelectRow=false;
      this.CardOperation.grid.AllowSearch=false;
      this.CardOperation.grid.AllowDelete=false;
      this.CardOperation.grid.AllowDeleteSelected=false;
      this.CardOperation.grid.AllowSearch=false;
      this.CardOperation.grid.AllowSave=false;
      this.CardOperation.grid.AllowExportExcel=false;
    })
  }
}