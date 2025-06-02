

import { Component, OnInit, ViewChild } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { NgIf } from '@angular/common';
import { Tools } from '../../../shared/service/Tools.service';
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
  
  @ViewChild("curdOperation") Grid!: DataGridComponent
  AddData: Array<any> = [];
  Year: number = 0;
  filter: string = "{}";
  selectedMonth: any = null;
  Columns: Array<Column> = [];
  StepperConfig: StepperConfiguration = new StepperConfiguration(this);
  constructor(public _tools: Tools) {
    this.Year = this._tools.DateTime.GetNumberOfYear();
    this.selectedMonth = this._tools.DateTime.GetNumberOfMonth();
    this.EditFilterText()
  }

  async ngOnInit() {


    this.EditFilterText()
  }
  async gridLoaded(grid: DataGridComponent, AddMode: boolean) {
    if (AddMode) {
      this.Columns = [];
      this.Columns.push(new Column("ID", "رقم النظام"))
      this.Columns.push(new Column("ID_EMPLOY", "الموظف", "comboBox"))
      this.Columns.push(new Column("DEPART", "القسم"))
      this.Columns.push(new Column("START", "تبداء من", "date"))
      this.Columns.push(new Column("END", "تنتهي في", "date"))
      this.Columns.push(new Column("TYPE", "نوع الأجازة", "comboBox"))
      this.Columns.push(new Column("ID_EMPLOY_REPLACE", "الموظف البديل", "comboBox"))
      this.Columns.push(new Column("DEPART_REP", "القسم"))
      this.Columns.push(new Column("NOTS", "الملاحطات","textarea"))
      this.Columns.push(new Column("RESPONSIBLY", "المدير المسؤل", "text"))
      this.Columns.push(new Column("USER_RECORD_NAME", "حساب مدخل البيان"))
      let suggestionsData = await this._tools.Network.getAsync("Employee/Suggestions_Code_Concat_Name") as Array<any>    
      this.Columns[1].apiPathDataSource = "Employee/Suggestions_Code_Concat_Name";
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
        this.Columns[6].columnComboBoxDataSource =suggestionsData.filter(x=>x.DEPART_ID==select.DEPART_ID && select.DEPART_ID!=null && item.ID_EMPLOY!=x.ID)
        item.DEPART = select.DEPART;
        comboBox.onClear = () => {
          item.ID_EMPLOY = null;
          item.DEPART = null;
          this.Columns[6].columnComboBoxDataSource=[];
        }
      }

      


      this.Columns[5].columnComboBoxDataSource = this._tools.TYPES_DataSource;
      this.Columns[5].columnComboBoxOptionLabel = "name";
      this.Columns[5].columnComboBoxOptionValue = "name";
      this.Columns[5].columnComboBoxPlaceholder = "حدد نوع الاجازة"


      
      this.Columns[6].columnComboBoxOptionLabel = "CODE";
      this.Columns[6].columnComboBoxOptionValue = "ID";
      this.Columns[6].columnComboBoxPlaceholder = "حدد كود الموظف"
      this.Columns[6].columnComboBoxChange = (select, item, comboBox) => {
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
     

      this.Year = this._tools.DateTime.GetNumberOfYear();
      this.selectedMonth = this._tools.DateTime.GetNumberOfMonth();
      grid.Columns = this.Columns;
      grid.dataSource = this.AddData;
      grid.onSaveChanges = async (data) => {
        let response = await this._tools.Network.postAsync("Holiday/AddMore", this.AddData);
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
        let response = await this._tools.Network.deleteAsync("Holiday?Id=" + item.ID)
        if (response == true) {
          this._tools.Toaster.showInfo("تم الحذف بنجاح");
          grid.onUpdate(grid.dt);
        }
      }
      let data = await this._tools.Network.getAsync("Holiday?filter=" + this.filter) as Array<any>;
      if (data) {
        console.log(data)
        data.forEach(item => {
          item.STARTshow = item.START != null ? this._tools.DateTime.EditFormateData(item.START, "YYYY-MM-DD") : "";
          item.ENDshow = item.END != null ? this._tools.DateTime.EditFormateData(item.END, "YYYY-MM-DD") : "";
          item.DATE_TIMEShow = item.DATE_TIME != null ? this._tools.DateTime.EditFormateData(item.DATE_TIME, "HH:mm:ss YYYY-MM-DD") : "";
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

