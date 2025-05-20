import { Component, OnInit, ViewChild } from '@angular/core';
import { DataGridComponent } from '../../../shared/components/dataGrid/dataGrid.component';
import { Column } from '../../../shared/components/dataGrid/Column';
import { StepperConfiguration } from '../../../shared/components/stepper/stepper.configuration';
import { Tools } from '../../../shared/service/Tools';
import { StepperComponent } from "../../../shared/components/stepper/stepper.component";
import { InputLabelComponent } from "../../../shared/pages/TextLabel/InputLabel.component";
import { StepConfigurationDirective } from '../../../shared/components/stepper/Step-Configuration.directive';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ComboBoxComponent } from '../../../shared/components/comboBox/comboBox.component';
import { CustomColumnDirective } from '../../../shared/components/dataGrid/CustomColumn.directive';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-SomeEmployRule',
  templateUrl: './SomeEmployRule.component.html',
  styleUrls: ['./SomeEmployRule.component.css'],
  imports: [
    StepConfigurationDirective,
    InputNumberModule,
    FormsModule,
    StepperComponent,
    InputLabelComponent,
    ComboBoxComponent,
    DataGridComponent,
    CustomColumnDirective,
    ButtonModule,
  ]
})
export class SomeEmployRuleComponent implements OnInit {

  @ViewChild("curdOperation") Grid!: DataGridComponent
  @ViewChild("G_Target") G_Target!: DataGridComponent
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
    grid.onRenderItemSource = (item,index) => {
      if(item.IN!=null)item.INDay = this._tools.getDayName(item.IN)
      if(item.IN!=null)item.OUTDay = this._tools.getDayName(item.OUT)
    }
    if (AddMode) {
      this.Columns = [];
      this.Columns.push(new Column("ID", "رقم النظام"))
      this.Columns.push(new Column("EMPLOY_ID", "كود الموظف", "comboBox"))
      this.Columns.push(new Column("EMPLOY_ID", "اسم الموظف", "comboBox"))
      this.Columns.push(new Column("DEPART", "القسم"))
      this.Columns.push(new Column("ID_PLACE", "مكان التوفيع", "comboBox"))
      this.Columns.push(new Column("IN", "الحضور", "date-Time"))
      this.Columns.push(new Column("INDay", "يوم",))
      this.Columns.push(new Column("OUT", "الأنصراف", "date-Time"))
      this.Columns.push(new Column("OUTDay", "يوم"))
      this.Columns.push(new Column("LATE_AFTER_MINT", "التأخير من بعد ( بالدقيقة )", "number", "numeric"))
      this.Columns.push(new Column("EARLY_BEFORE_MINT", "المبكر من قبل ( بالدقيقة )", "number", "numeric"))
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
        let response = await this._tools.postAsync("SomeEmployRules/AddMore", this.AddData);
        if (response != null) {
          if (Array.isArray(response)) {
            this.AddData = [];
            grid.dataSource = [];
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
      this.Columns.push(new Column("PLACE", "مكان التوفيع"))
      this.Columns.push(new Column("INshow", "الحضور"))
      this.Columns.push(new Column("OUTshow", "الأنصراف"))
      this.Columns.push(new Column("LATE_AFTER_MINT", "التأخير من بعد ( بالدقيقة )"))
      this.Columns.push(new Column("EARLY_BEFORE_MINT", "المبكر من قبل ( بالدقيقة )"))
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
        let response = await this._tools.deleteAsync("SomeEmployRules?Id=" + item.ID)
        if (response == true) {
          this._tools.Toaster.showInfo("تم الحذف بنجاح");
          grid.onUpdate(grid.dt);
        }
      }
      let data = await this._tools.getAsync("SomeEmployRules?filter=" + this.filter) as Array<any>;
      if (data) {
        data.forEach(item => {
          item.INshow = item.IN != null ? this._tools.EditFormateData(item.IN, "dd-MM-yyyy HH:mm:ss") : "";
          item.OUTshow = item.OUT != null ? this._tools.EditFormateData(item.OUT, "dd-MM-yyyy HH:mm:ss") : "";
          item.DATE_TIMEShow = item.DATE_TIME != null ? this._tools.EditFormateData(item.DATE_TIME, "dd-MM-yyyy HH:mm:ss") : "";
        })
        grid.dataSource =this._tools.dynamicSortMutable(data,["CODE","IN"]);
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
  addNext(item: any, grid: DataGridComponent) {
    let nItem = this._tools.cloneObject(item);
    nItem.ROW_NUMBER = -1;
    nItem.ROW_NUMBER = -1;
    nItem.IN_DATE = null;
    nItem.IN_USER = null;
    nItem.UP_DATE = null;
    nItem.ID = -1;
    nItem.IN = this._tools.getValueJsonWithGMT(this._tools.convertDataToMoment(this._tools.getDataFromJson(item.IN)).add(1, "day").toDate(), 3);
    nItem.OUT = this._tools.getValueJsonWithGMT(this._tools.convertDataToMoment(this._tools.getDataFromJson(item.OUT)).add(1, "day").toDate(), 3);
    let date=grid.dataSource;
    date.push(nItem);
    grid.dataSource=date;
  }
}
