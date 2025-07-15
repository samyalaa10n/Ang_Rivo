import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { InputLabelComponent } from "../../../shared/pages/TextLabel/InputLabel.component";
import { DateTimeComponent } from "../../../shared/components/DateTime/DateTime.component";
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";
import { ButtonModule } from 'primeng/button';
import { Tools } from '../../../shared/service/Tools.service';
import { MultiselectComponent } from "../../../shared/components/multiselect/multiselect.component";
import { NgClass, NgFor, NgIf } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { CalculateDayComponent } from "./CalculatDay/CalculateDay.component";
import { InputTextModule } from 'primeng/inputtext';
import { RevisionAttendanceComponent } from "./revisionAttendance/revisionAttendance.component";
import { DialogModule } from 'primeng/dialog';
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { CustomColumnDirective } from '../../../shared/components/dataGrid/CustomColumn.directive';
@Component({
  selector: 'app-AttendanceCalculator',
  templateUrl: './AttendanceCalculator.component.html',
  styleUrls: ['./AttendanceCalculator.component.css'],
  imports: [CustomColumnDirective,DialogModule, InputLabelComponent, DateTimeComponent, ButtonModule, MultiselectComponent, NgIf, NgFor, AccordionModule, CalculateDayComponent, InputTextModule, RevisionAttendanceComponent, DataGridComponent]
})
export class AttendanceCalculatorComponent implements OnInit {
  @ViewChildren("CalcDay") CalcDays! :QueryList<CalculateDayComponent>
  request = { START: null, END: null, SELECTED_Departs: [] }
  Departs: Array<any> = [];
  Columns: Array<Column> = [];
  Days: Array<any> = [];
  Data: any = null;
  ShowEmploySelection: boolean = false;
  StepNumber: number = 0;
  AttendanceList: Array<any> = [];
  employSelected: any = null;
  DepartSelected: any = null;
  SelectedDepartEmploys: Array<any> = [];
  constructor(public _tools: Tools) {
    this.Columns.push(new Column("CODE","الكود"))
    this.Columns.push(new Column("NAME","الأسم"))
    this.Columns.push(new Column("TOTAL_HOURS","اجمالي الساعات المحسوبة","numberWithFraction"))
   }
  async ngOnInit() {
    this.Departs = await this._tools.Network.getAsync("Depart") as Array<any>
  }
  async showData() {
    let startDate = this._tools.DateTime.convertDataToMoment(this._tools.DateTime.EditData(this.request.START as any));
    let endDate = this._tools.DateTime.convertDataToMoment(this._tools.DateTime.EditData(this.request.END as any));
    if (this.request.START == null) {
      this._tools.Toaster.showError("يجب اختيار تاريخ البداية")
      return;
    }
    if (this.request.END == null) {
      this._tools.Toaster.showError("يجب اختيار تاريخ النهاية")
      return;
    }
    if (this.request.SELECTED_Departs.length == 0) {
      this._tools.Toaster.showError("يجب اختيار الأقسام")
      return;
    }
    this.Days = [];
    for (let day = startDate.clone(); day <= endDate; day.add(1, "day")) {
      this.Days.push(day.clone().toDate());
    }
    var response = await this._tools.Network.getAsync("AttendanceRecord/GetAttendanceToCalculator?filter=" + JSON.stringify(this.request)) as Array<any>;
    if (response) {
      this.Data = response;
      this.SelectedDepartEmploys = [];
      this.request.SELECTED_Departs.forEach(idDep => {
        this.SelectedDepartEmploys.push({ DepName: this.getDepartName(idDep), Employs: this.getSelectedDepartEmploys(idDep) })
      })
    }
    else
    {
      this.Data=null
    }
  }
  selectEmploy(employ: any) {
    this.employSelected=null;
    this._tools.waitExecuteFunction(100,()=>{
      this.employSelected = employ
    })
    this.DepartSelected = this.Departs.find(x => x.ID == employ.DEPART_ID);
    this.AttendanceList = [];
    (this.Data.ATTENDANCERECORDS as Array<any>).filter(x => x.ID_EMPLOYE == employ.ID).forEach(att => {
      this.AttendanceList.push(att);
    });
    this.ShowEmploySelection=false;
  }
  Search(html: HTMLElement, txt: HTMLElement) {
    let value = (txt as any).value as string;
    let btns = Array.from(html.querySelectorAll(".btn"));
    if (value != null) {
      btns.forEach(btn => {
        if (btn.innerHTML.toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
          (btn as HTMLElement).style.display = "block";
        }
        else {
          (btn as HTMLElement).style.display = "none";
        }
      })
    }
    else {
      btns.forEach(btn => {
        (btn as HTMLElement).style.display = "block";
      })
    }
  }
  getSelectedDepartEmploys(Depart_Id: any): Array<any> {
    return (this.Data.EMPLOYES as Array<any>).filter(x => x.DEPART_ID == Depart_Id)
  }
  getDepartName(Depart_Id: any): string {
    return (this.Departs as Array<any>).find(x => x.ID == Depart_Id).NAME
  }
  ActionTest(e:any)
  {
    
  }
}
