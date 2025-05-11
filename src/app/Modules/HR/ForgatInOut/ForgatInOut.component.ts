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
  selector: 'app-ForgatInOut',
  templateUrl: './ForgatInOut.component.html',
  styleUrls: ['./ForgatInOut.component.css'],
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
export class ForgatInOutComponent implements OnInit {
  @ViewChild("curdOperation") Grid!: DataGridComponent
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
      this.Columns.push(new Column("ID_PLACE", "مكان التوفيع", 'comboBox'))
      this.Columns.push(new Column("IN", "الحضور", "date-Time"))
      this.Columns.push(new Column("OUT", "الأنصراف", "date-Time"))
      this.Columns.push(new Column("RESPONSIBLY", "المدير المسؤل", "text"))
      this.Columns.push(new Column("RAISON", "السبب", "textarea"))
      this.Columns.push(new Column("NOTS", "الملاحطات","textarea"))
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
      let Place = await this._tools.getAsync("Place") as Array<any>
      this.Columns[4].apiPathDataSource = "Place";
      this.Columns[4].columnComboBoxDataSource = Place;
      this.Columns[4].columnComboBoxOptionLabel = "NAME";
      this.Columns[4].columnComboBoxOptionValue = "ID";
      this.Columns[4].columnComboBoxPlaceholder = "حدد مكان التوفيع"
      this.Columns[4].columnComboBoxChange = (select, item, comboBox) => {
        item.ID_PLACE = select.ID;
        comboBox.onClear = () => {
          item.ID_PLACE = null;
        }
      }
      this.Year = this._tools.GetNumberOfYear();
      this.selectedMonth = this._tools.GetNumberOfMonth();
      grid.Columns = this.Columns;
      grid.dataSource = this.AddData;
      grid.onSaveChanges = async (data) => {
        let response = await this._tools.postAsync("ForgatInOut/AddMore", this.AddData);
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
      this.Columns.push(new Column("CODE", "كود الموظف",))
      this.Columns.push(new Column("NAME", "اسم الموظف",))
      this.Columns.push(new Column("DEPART", "القسم"))
      this.Columns.push(new Column("PLACE", "مكان التوفيع"))
      this.Columns.push(new Column("INshow", "الحضور"))
      this.Columns.push(new Column("OUTshow", "الأنصراف"))
      this.Columns.push(new Column("RESPONSIBLY", "المدير المسؤل"))
      this.Columns.push(new Column("RAISON", "السبب"))
      this.Columns.push(new Column("NOTS", "الملاحطات"))
      this.Columns.push(new Column("DATE_TIMEShow", "وقت التسجيل"))
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
        let response = await this._tools.deleteAsync("ForgatInOut?Id=" + item.ID)
        if (response == true) {
          this._tools.Toaster.showInfo("تم الحذف بنجاح");
          grid.onUpdate(grid.dt);
        }
      }
      let data = await this._tools.getAsync("ForgatInOut?filter=" + this.filter) as Array<any>;
      if (data) {
        data.forEach(item => {
          item.INshow = item.IN != null ? this._tools.EditFormateData(item.IN, "dd-MM-yyyy HH:mm:ss") : "";
          item.OUTshow = item.OUT != null ? this._tools.EditFormateData(item.OUT, "dd-MM-yyyy HH:mm:ss") : "";
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
