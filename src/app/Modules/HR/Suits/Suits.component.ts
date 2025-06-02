import { Component, OnInit } from '@angular/core';
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { CustomColumnDirective } from '../../../shared/components/dataGrid/CustomColumn.directive';
import { ButtonModule } from 'primeng/button';
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools.service';
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
    let places = await this._tools.Network.getAsync("Place") as Array<any>;
    let companies = await this._tools.Network.getAsync("Company") as Array<any>;
    let Shifts = await this._tools.Network.getAsync("Shift") as Array<any>;
    let Managements = await this._tools.Network.getAsync("Mangement") as Array<any>;
    let AttendanceAndDepartureDevice = await this._tools.Network.getAsync("AttendanceAndDepartureDevice") as Array<any>;
    let Departs = await this._tools.Network.getAsync("Depart") as Array<any>;
    let suggestionsData = await this._tools.Network.getAsync("Employee/Suggestions_Code_Concat_Name") as Array<any>
    this.Columns.push(new Column("ID", "رقم البدل"));
    this.Columns.push(new Column("NAME", "اسم البدل","text","text"));
    this.Columns.push(new Column("VALUE", "قيمة البدل","number","numeric"));
    this.Columns.push(new Column('BY_HOURES',"يحسب بالساعة","yes-no","yes-no"));
    this.Columns.push(new Column("COMPANY_ID", "بدل عن شركة","comboBox","comboBox"));
    this.Columns[this.Columns.length-1].apiPathDataSource="Company";
    this.Columns[this.Columns.length-1].columnComboBoxDataSource=companies;
    this.Columns[this.Columns.length-1].columnComboBoxOptionValue="ID";
    this.Columns[this.Columns.length-1].columnComboBoxOptionLabel="NAME";
    this.Columns[this.Columns.length-1].columnComboBoxChange = (select, item, comboBox) => {
      item.DEPART_ID = null;
      item.EMPLOY_ID = null;
      item.MANAGEMENT_ID = null;
    }
    this.Columns.push(new Column("PLACE_ID", "مكان البدل","comboBox","comboBox"));
    this.Columns[this.Columns.length-1].apiPathDataSource="Place";
    this.Columns[this.Columns.length-1].columnComboBoxDataSource=places;
    this.Columns[this.Columns.length-1].columnComboBoxOptionValue="ID";
    this.Columns[this.Columns.length-1].columnComboBoxOptionLabel="NAME";
    this.Columns.push(new Column("DEPART_ID", "بدل لقسم","comboBox","comboBox"));
    this.Columns[this.Columns.length-1].apiPathDataSource="Depart";
    this.Columns[this.Columns.length-1].columnComboBoxDataSource=Departs;
    this.Columns[this.Columns.length-1].columnComboBoxOptionValue="ID";
    this.Columns[this.Columns.length-1].columnComboBoxOptionLabel="NAME";
    this.Columns[this.Columns.length-1].columnComboBoxChange = (select, item, comboBox) => {
      item.EMPLOY_ID = null;
      item.MANAGEMENT_ID = null;
      item.COMPANY_ID = null;
    }
    this.Columns.push(new Column("EMPLOY_ID", "بدل لموظف","comboBox","comboBox"));
    this.Columns[this.Columns.length-1].apiPathDataSource="Employee/Suggestions_Code_Concat_Name";
    this.Columns[this.Columns.length-1].columnComboBoxDataSource=suggestionsData;
    this.Columns[this.Columns.length-1].columnComboBoxOptionValue="ID";
    this.Columns[this.Columns.length-1].columnComboBoxOptionLabel="CODE";
    this.Columns[this.Columns.length-1].columnComboBoxChange = (select, item, comboBox) => {
      item.DEPART_ID = null;
      item.MANAGEMENT_ID = null;
      item.COMPANY_ID = null;
    }
    this.Columns.push(new Column("MANAGEMENT_ID", "بدل عن وظيفة","comboBox","comboBox"));
    this.Columns[this.Columns.length-1].columnComboBoxChange = (select, item, comboBox) => {
      item.EMPLOY_ID = null;
      item.DEPART_ID = null;
      item.COMPANY_ID = null;
    }
    this.Columns[this.Columns.length-1].apiPathDataSource="Mangement";
    this.Columns[this.Columns.length-1].columnComboBoxDataSource=Managements;
    this.Columns[this.Columns.length-1].columnComboBoxOptionValue="ID";
    this.Columns[this.Columns.length-1].columnComboBoxOptionLabel="POSATION";
    this.Columns.push(new Column("DEVICE_ID", "بدل للتوقيع","comboBox","comboBox"));
    this.Columns[this.Columns.length-1].apiPathDataSource="AttendanceAndDepartureDevice";
    this.Columns[this.Columns.length-1].columnComboBoxDataSource=AttendanceAndDepartureDevice;
    this.Columns[this.Columns.length-1].columnComboBoxOptionValue="ID";
    this.Columns[this.Columns.length-1].columnComboBoxOptionLabel="NAME";
    this.Columns.push(new Column("SHIFT_ID", "بدل وردية","comboBox","comboBox"));
    this.Columns[this.Columns.length-1].apiPathDataSource="Shift";
    this.Columns[this.Columns.length-1].columnComboBoxDataSource=Shifts;
    this.Columns[this.Columns.length-1].columnComboBoxOptionValue="ID";
    this.Columns[this.Columns.length-1].columnComboBoxOptionLabel="NAME";
  }
}
