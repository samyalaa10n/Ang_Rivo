import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { Tools } from '../../../shared/service/Tools';
import { Column } from '../../../shared/components/dataGrid/Column';
import { NgIf } from '@angular/common';
import { Table } from 'primeng/table';
import { GridAction } from '../../../shared/components/dataGrid/dataGrid.component';

@Component({
  selector: 'app-User',
  templateUrl: './User.component.html',
  styleUrls: ['./User.component.css'],
  imports: [GetAddEditDeleteComponent,NgIf]
})
export class UserComponent implements OnInit {
  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }
  async ngOnInit() {
    let RuleGroup = await this._tools.getAsync("RuleGroup/GetWithOutPermeations") as Array<any>;
    this.Columns.push(new Column('ID', "الكود", "lapel", "text"))
    this.Columns.push(new Column('NAME', "الأسم", "text", "text"))
    this.Columns.push(new Column('USER_NAME', "اسم المستخدم", "text", "text"))
    this.Columns.push(new Column('PASSWORD', "كلمة المرور", "text", "text"))
    this.Columns.push(new Column('IS_ACTIVE', "مفعل ام لأ", "yes-no", "yes-no"))
    this.Columns.push(new Column('RULEGROUP_ID', "نوع المستخدم", "comboBox", "comboBox"))
    this.Columns[5].columnComboBoxOptionValue="ID";
    this.Columns[5].columnComboBoxOptionLabel="NAME";
    this.Columns[5].columnComboBoxPlaceholder="اختر نوع المستخدم";
    this.Columns[5].columnComboBoxDataSource=RuleGroup;
  
  }
  async ngAfterViewInit() {
  }
  async update(Td: Table) {
    let RuleGroup = await this._tools.getAsync("RuleGroup/GetWithOutPermeations") as Array<any>;
    this.Columns[5].columnComboBoxDataSource=RuleGroup;
  }
}

