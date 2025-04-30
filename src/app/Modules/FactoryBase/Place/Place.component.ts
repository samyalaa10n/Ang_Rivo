import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from '../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component';
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-Place',
  templateUrl: './Place.component.html',
  styleUrls: ['./Place.component.css'],
  standalone: true,
  imports: [GetAddEditDeleteComponent,NgIf]
})
export class PlaceComponent implements OnInit {
  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }

  async ngOnInit() {
    this.Columns.push(new Column('ID', "الكود", "lapel", "text"))
    this.Columns.push(new Column('NAME', "الأسم", "text", "text", 400))
    this.Columns.push(new Column('IS_FACTORY', "هل مصنع ؟", "yes-no", "none", 50))
    this.Columns.push(new Column('IS_BRANCH', "هل فرع ؟", "yes-no", "none", 50))
  }

}
