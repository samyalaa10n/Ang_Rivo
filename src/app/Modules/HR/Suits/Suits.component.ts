import { Component, OnInit } from '@angular/core';
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { CustomColumnDirective } from '../../../shared/components/dataGrid/CustomColumn.directive';
import { ButtonModule } from 'primeng/button';
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools';
import { DialogModule } from 'primeng/dialog';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-Suits',
  templateUrl: './Suits.component.html',
  styleUrls: ['./Suits.component.css'],
  imports: [ButtonModule, DialogModule, GetAddEditDeleteComponent,NgIf]
})
export class SuitsComponent implements OnInit {

  Columns: Column[] = [];
  constructor(private _tools: Tools) { }
  async ngOnInit() {
    let places = await this._tools.getAsync("Place") as Array<any>;
    this.Columns.push(new Column("ID", "رقم البدل"));
    this.Columns.push(new Column("NAME", "اسم البدل","text","text"));
    this.Columns.push(new Column("PLACE_ID", "مكان البدل","comboBox","comboBox"));
    this.Columns[this.Columns.length-1].columnComboBoxDataSource=places;
    this.Columns[this.Columns.length-1].columnComboBoxOptionValue="ID";
    this.Columns[this.Columns.length-1].columnComboBoxOptionLabel="NAME";
    this.Columns.push(new Column("VALUE", "قيمة البدل","number","numeric"));
    this.Columns.push(new Column('BY_HOURES',"يحسب بالساعة","yes-no","yes-no"));
  }
}
