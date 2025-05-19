import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { NgIf } from '@angular/common';
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools';

@Component({
  selector: 'app-Shifts',
  templateUrl: './Shifts.component.html',
  styleUrls: ['./Shifts.component.css'],
  imports: [GetAddEditDeleteComponent,NgIf]
})
export class ShiftsComponent implements OnInit {
  Columns: Column[] = [];
  constructor(private _tools: Tools) { }

  async ngOnInit() {
    let places = await this._tools.getAsync("Place") as Array<any>;
    this.Columns.push(new Column("ID", "رقم البدل"));
    this.Columns.push(new Column("NAME", "أسم الوردية","text","text"));
    this.Columns.push(new Column("PLACE_ID", "مكان الوردية","comboBox","comboBox"));
    this.Columns[this.Columns.length-1].columnComboBoxDataSource=places;
    this.Columns[this.Columns.length-1].columnComboBoxOptionValue="ID";
    this.Columns[this.Columns.length-1].columnComboBoxOptionLabel="NAME";
    this.Columns.push(new Column("REANG_START", "وقت بداية الشفت","Time","date"));
    this.Columns.push(new Column("REANG_END", "وقت نهاية الشفت","Time","date"));
    this.Columns.push(new Column("IN", "وقت الحضور","Time","date"));
    this.Columns.push(new Column("OUT", "وقت الانصراف","Time","date"));
    this.Columns.push(new Column("LATE_AFTER_MINT", "المبكر من قبل (بالدقيقة)","number","numeric"));
    this.Columns.push(new Column("EARLY_BEFORE_MINT", "التأخير من بعد (بالدقيقة)","number","numeric"));
  }

}
