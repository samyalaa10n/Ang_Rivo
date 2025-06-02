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
  imports: [GetAddEditDeleteComponent, NgIf, DialogModule, ButtonModule, CustomColumnDirective, ComboBoxComponent]
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
   // this.Promotions = await this._tools.getAsync("RuleGroup/GetPromotions") as Array<any>;
    this.Columns.push(new Column('ID', "الكود", "lapel", "text"))
    this.Columns.push(new Column('NAME', "اسم المجموعة", "text", "text"))
    this.Columns.push(new Column('IS_ACTIVE', "مفعل ام لا","yes-no", "yes-no"))
    this.columnsChildGrid.push(new Column("NAME_PERMITION", "اسم الصلاحية"))
    this.columnsChildGrid.push(new Column("VALUES", "الخصائص", "custom"))
    this.columnsChildGrid[this.columnsChildGrid.length - 1].columnMultiPlaceholder = "اختر الخصائص";
    this.columnsChildGrid[this.columnsChildGrid.length - 1].columnMultiOptionLabel = "NAME";
    this.columnsChildGrid[this.columnsChildGrid.length - 1].columnMultiSelectOptionValue = "ID";
    this.columnsChildGrid[this.columnsChildGrid.length - 1].columnMultiSelectDataSource = [{ ID: 1, NAME: "عرض" }, { ID: 2, NAME: "اضافة" }, { ID: 3, NAME: "تعديل" }, { ID: 4, NAME: "حذف" }]
  }
  async ngAfterViewInit() {

    this._tools.waitExecuteFunction(100, () => {
      this.CardOperation.grid.Columns = this.Columns
      this.CardOperation.grid.IsHasChild = true;
      // this.CardOperation.grid.onSaveChanges = (e: any) => this.SaveData(e, this.CardOperation.grid)
      this.CardOperation.grid.onLoadedChildDataGrid = async (parent, child, row) => {
        child.AddNew=async ()=>{
          this.showDialogAddSitting=true;
        }
        child.Columns = this.columnsChildGrid;
        child.AllowDelete = false;
        child.AllowEdit = false;
        child.AllowSave = false;
        child.AllowAdd = true;
        child.AllowUpdate = false;
        child.AllowDeleteSelected = false;
        child.canSelectRow = false;
        child.canSelectedSomeColumns = false;
        child.dataSource=row.PREMOTION_RULEGROUPDTO
      }
    })
  }
  select(item:any)
  {
    console.log(item)
    this.PromotionSelected=item;
    console.log(this.Promotions)
  }
  delete(item:any)
  {

  }
}
