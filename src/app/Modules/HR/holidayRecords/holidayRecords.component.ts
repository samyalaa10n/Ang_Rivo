

import { Component, OnInit, ViewChild } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { NgIf } from '@angular/common';
import { Tools } from '../../../shared/service/Tools';
import { Column } from '../../../shared/components/dataGrid/Column';
import { InputLabelComponent } from "../../../shared/pages/TextLabel/InputLabel.component";
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { StepperComponent } from "../../../shared/components/stepper/stepper.component";
import { StepConfigurationDirective } from '../../../shared/components/stepper/Step-Configuration.directive';
import { StepConfiguration, StepperConfiguration } from '../../../shared/components/stepper/stepper.configuration';
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";

@Component({
  selector: 'app-holidayRecords',
  templateUrl: './holidayRecords.component.html',
  styleUrls: ['./holidayRecords.component.css'],
  imports: [
    StepConfigurationDirective,
    InputNumberModule,
    FormsModule,
    StepperComponent,
    InputLabelComponent,
    ComboBoxComponent,
    DataGridComponent
  ]
})
export class HolidayRecodesComponent implements OnInit {
  MonthsDataSource = [
    { name: "1-يناير", Id: 1 },
    { name: "2-فبراير", Id: 2 },
    { name: "3-مارس", Id: 3 },
    { name: "4-إبريل", Id: 4 },
    { name: "5-مايو", Id: 5 },
    { name: "6-ينيو", Id: 6 },
    { name: "7-يوليو", Id: 7 },
    { name: "8-اغسطس", Id: 8 },
    { name: "9-سبتمبر", Id: 9 },
    { name: "10-أكتوبر", Id: 10 },
    { name: "11-نوفمبر", Id: 11 },
    { name: "12-ديسمبر", Id: 12 }
  ]
  TYPES_DataSource = [
    { name: "اعتيادي", Id: 1 },
    { name: "عارضة", Id: 2 },
    { name: "بالخصم", Id: 3 },
    { name: "اخري", Id: 4 },
  ]
  @ViewChild("curdOperation") Grid!: DataGridComponent
  AddData: Array<any> = [];
  Year: number = 0;
  filter: string = "{}";
  selectedMonth: any = null;
  Columns: Array<Column> = [];
  StepperConfig: StepperConfiguration = new StepperConfiguration(this);
  constructor(private _tools: Tools) {
    this.Year = this._tools.GetNumberOfYear();
    this.selectedMonth = this._tools.GetNumberOfMonth();
    this.EditFilterText()
  }

  async ngOnInit() {


    this.EditFilterText()
  }
  async gridLoaded(grid: DataGridComponent, AddMode: boolean) {
    if (AddMode) {
      this.Columns = [];
      this.Columns.push(new Column("ID", "رقم النظام"))
      this.Columns.push(new Column("ID_EMPLOY", "كود الموظف", "comboBox"))
      this.Columns.push(new Column("ID_EMPLOY", "اسم الموظف", "comboBox"))
      this.Columns.push(new Column("DEPART", "القسم"))
      this.Columns.push(new Column("START", "تبداء من", "date"))
      this.Columns.push(new Column("END", "تنتهي في", "date"))
      this.Columns.push(new Column("TYPE", "نوع الأجازة", "comboBox"))
      this.Columns.push(new Column("ID_EMPLOY_REPLACE", "كود الموظف", "comboBox"))
      this.Columns.push(new Column("ID_EMPLOY_REPLACE", "اسم الموظف", "comboBox"))
      this.Columns.push(new Column("DEPART_REP", "القسم"))
      this.Columns.push(new Column("NOTS", "الملاحطات","textarea"))
      this.Columns.push(new Column("RESPONSIBLY", "المدير المسؤل", "text"))
      this.Columns.push(new Column("USER_RECORD_NAME", "حساب مدخل البيان"))
      let suggestionsData = await this._tools.getAsync("Employee/Suggestions_Code_and_Name") as Array<any>
      this.Columns[1].apiPathDataSource = "Employee/Suggestions_Code_and_Name";
      this.Columns[1].columnComboBoxDataSource = suggestionsData;
      this.Columns[1].columnComboBoxOptionLabel = "CODE";
      this.Columns[1].columnComboBoxOptionValue = "ID";
      this.Columns[1].columnComboBoxPlaceholder = "حدد كود الموظف"
      this.Columns[1].columnComboBoxChange = (select, item, comboBox) => {
        var userData = localStorage.getItem("logInfo")
        if (userData != null) {
          item.USER_RECORD_NAME = JSON.parse(userData).useR_NAME
        }
        item.ID_EMPLOY = select.ID;
        item.DEPART = select.DEPART;
        comboBox.onClear = () => {
          item.ID_EMPLOY = null;
          item.DEPART = null;
        }
      }

      this.Columns[2].apiPathDataSource = "Employee/Suggestions_Code_and_Name";
      this.Columns[2].columnComboBoxDataSource = suggestionsData;
      this.Columns[2].columnComboBoxOptionLabel = "NAME";
      this.Columns[2].columnComboBoxOptionValue = "ID";
      this.Columns[2].columnComboBoxPlaceholder = "حدد اسم الموظف"
      this.Columns[2].columnComboBoxChange = (select, item, comboBox) => {
        var userData = localStorage.getItem("logInfo")
        if (userData != null) {
          item.USER_RECORD_NAME = JSON.parse(userData).useR_NAME
        }
        item.ID_EMPLOY = select.ID;
        item.DEPART = select.DEPART;
        comboBox.onClear = () => {
          item.ID_EMPLOY = null;
          item.DEPART = null;
        }
      }


      this.Columns[6].columnComboBoxDataSource = this.TYPES_DataSource;
      this.Columns[6].columnComboBoxOptionLabel = "name";
      this.Columns[6].columnComboBoxOptionValue = "name";
      this.Columns[6].columnComboBoxPlaceholder = "حدد نوع الاجازة"


      this.Columns[7].apiPathDataSource = "Employee/Suggestions_Code_and_Name";
      this.Columns[7].columnComboBoxDataSource = suggestionsData;
      this.Columns[7].columnComboBoxOptionLabel = "CODE";
      this.Columns[7].columnComboBoxOptionValue = "ID";
      this.Columns[7].columnComboBoxPlaceholder = "حدد كود الموظف"
      this.Columns[7].columnComboBoxChange = (select, item, comboBox) => {
        var userData = localStorage.getItem("logInfo")
        if (userData != null) {
          item.USER_RECORD_NAME = JSON.parse(userData).useR_NAME
        }
        item.ID_EMPLOY_REPLACE = select.ID;
        item.DEPART_REP = select.DEPART;
        comboBox.onClear = () => {
          item.ID_EMPLOY_REPLACE = null;
          item.DEPART_REP = null;
        }
      }
      this.Columns[8].apiPathDataSource = "Employee/Suggestions_Code_and_Name";
      this.Columns[8].columnComboBoxDataSource = suggestionsData;
      this.Columns[8].columnComboBoxOptionLabel = "NAME";
      this.Columns[8].columnComboBoxOptionValue = "ID";
      this.Columns[8].columnComboBoxPlaceholder = "حدد اسم الموظف"
      this.Columns[8].columnComboBoxChange = (select, item, comboBox) => {
        var userData = localStorage.getItem("logInfo")
        if (userData != null) {
          item.USER_RECORD_NAME = JSON.parse(userData).useR_NAME
        }
        item.ID_EMPLOY_REPLACE = select.ID;
        item.DEPART_REP = select.DEPART;
        comboBox.onClear = () => {
          item.ID_EMPLOY_REPLACE = null;
          item.DEPART_REP = null;
        }
      }

      this.Year = this._tools.GetNumberOfYear();
      this.selectedMonth = this._tools.GetNumberOfMonth();
      grid.Columns = this.Columns;
      grid.dataSource = this.AddData;
      grid.onSaveChanges = async (data) => {
        let response = await this._tools.postAsync("Holiday/AddMore", this.AddData);
        if (response != null) {
          if (Array.isArray(response)) {
            this.AddData = [];
            grid.dataSource=[];
            this._tools.Toaster.showSuccess("تم الحفظ بنجاح")

          }
        }
      }
    }
    else {
      this.Columns = [];
      this.Columns.push(new Column("ID", "رقم النظام"))
      this.Columns.push(new Column("CODE", "كود الموظف"))
      this.Columns.push(new Column("NAME", "اسم الموظف"))
      this.Columns.push(new Column("DEPART", "القسم"))
      this.Columns.push(new Column("STARTshow", "تبداء من"))
      this.Columns.push(new Column("ENDshow", "تنتهي في"))
      this.Columns.push(new Column("TYPE", "نوع الأجازة"))
      this.Columns.push(new Column("MANY_DAY", "عدد الأيام"))
      this.Columns.push(new Column("CODE_REP", "كود الموظف"))
      this.Columns.push(new Column("NAME_REP", "اسم الموظف"))
      this.Columns.push(new Column("DEPART_REP", "القسم"))
      this.Columns.push(new Column("RESPONSIBLY", "المدير المسؤل"))
      this.Columns.push(new Column("NOTS", "الملاحطات"))
      this.Columns.push(new Column("DATE_TIMEShow", "تاريخ التسجيل"))
      this.Columns.push(new Column("USER_RECORD_NAME", "حساب مدخل البيان"))
      grid.Columns = this.Columns;
      grid.AllowUpdate = true;
      grid.AllowAdd = false;
      grid.AllowEdit = true;
      this.Grid = grid;
      grid.onUpdate = async () => {
        this.gridLoaded(grid, false);
      };
      grid.AllowSave = false;
      grid.AllowDeleteSelected = false;
      grid.onEditItem = async (item) => {
        if (item.IS_CALCULATED == false) {
          this.AddData.push(item);
          this.StepperConfig.Steps[0].select();
        }
      }
      grid.onDeleteItem = async (item) => {
        let response = await this._tools.deleteAsync("Holiday?Id=" + item.ID)
        if (response == true) {
          this._tools.Toaster.showInfo("تم الحذف بنجاح");
          grid.onUpdate(grid.dt);
        }
      }
      let data = await this._tools.getAsync("Holiday?filter=" + this.filter) as Array<any>;
      if (data) {
        console.log(data)
        data.forEach(item => {
          item.STARTshow = item.START != null ? this._tools.EditFormateData(item.START, "dd-MM-yyyy") : "";
          item.ENDshow = item.END != null ? this._tools.EditFormateData(item.END, "dd-MM-yyyy") : "";
          item.DATE_TIMEShow = item.DATE_TIME != null ? this._tools.EditFormateData(item.DATE_TIME, "dd-MM-yyyy HH:mm:ss") : "";
        })
        grid.dataSource = data;
      }
    }

  }
  async update() {

  }
  EditFilterText() {
    if (this.selectedMonth && this.Year) {
      var lockUp = { Month: this.selectedMonth, Year: this.Year }
      this.filter = JSON.stringify(lockUp);
      if (this.Grid != null) {
        this.Grid.onUpdate(this.Grid.dt)
      }
    }
  }
}

