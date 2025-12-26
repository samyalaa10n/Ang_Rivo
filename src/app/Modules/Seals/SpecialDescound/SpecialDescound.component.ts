import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { NgIf } from '@angular/common';
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools.service';

@Component({
  selector: 'app-SpecialDescound',
  templateUrl: './SpecialDescound.component.html',
  styleUrls: ['./SpecialDescound.component.css'],
  imports: [GetAddEditDeleteComponent,NgIf]
})
export class SpecialDescoundComponent implements OnInit {

  Columns:Array<Column>=[];
  constructor(private _tools:Tools) { }
  async ngOnInit() {
    let Customers = await this._tools.Network.getAsync("Customer") as Array<any>;
    let Seasons = await this._tools.Network.getAsync("Season") as Array<any>;
    this.Columns.push(new Column('ID',"Code","lapel"))
    this.Columns.push(new Column('ID_CUSTOMER',"Customer","comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "Select Customer"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = Customers;
    this.Columns.push(new Column('DESCOUND',"Discount %","numberWithFraction"))
    this.Columns.push(new Column('SESON',"Season","comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "Select Season"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = Seasons;
  }

}