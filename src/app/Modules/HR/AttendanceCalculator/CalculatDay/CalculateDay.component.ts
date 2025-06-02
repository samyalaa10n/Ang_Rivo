import { Component, Input, OnInit } from '@angular/core';
import { Tools } from '../../../../shared/service/Tools.service';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass, NgFor } from '@angular/common';
import { AttendanceCalculatorComponent } from '../AttendanceCalculator.component';

@Component({
  selector: 'app-CalculateDay',
  templateUrl: './CalculateDay.component.html',
  styleUrls: ['./CalculateDay.component.css'],
  standalone: true,
  imports: [InputTextModule, NgFor, NgClass]
})
export class CalculateDayComponent implements OnInit {
  @Input() Attendance: Array<any> = [];
  @Input() AttendanceInDay: Array<any> = [];
  @Input() SHIFTS_TARGET: Array<any> = [];
  @Input() Employ: any = null;
  @Input() depart: any = null;
  @Input() Day: any = null
  @Input() Data: any = null
  constructor(public _tools: Tools, private AttendanceCalculator: AttendanceCalculatorComponent) { }
  ngOnInit() {
    this.GetAttendanceDay()
  }
  ngOnChanges() {
    this.GetAttendanceDay()
  }
  removeAttendanceWithId(ID:number)
  {
    this.AttendanceInDay= this.AttendanceInDay.filter(x=>x.ID!=ID)
  }
  GetAttendanceDay() {
    if (Array.from(this.AttendanceCalculator.CalcDays).length > 0) {
      this.AttendanceInDay = this.Attendance.filter(Att => this.CompareAttendance(Att))
      if (this.AttendanceInDay.length > 0) {
        if (this.AttendanceInDay[this.AttendanceInDay.length-1].TYPE == "c/in" && this.AttendanceInDay[this.AttendanceInDay.length-2].TYPE == "c/out") {
          let index = this.Attendance.indexOf(this.AttendanceInDay[this.AttendanceInDay.length-1]);
          if (index > 0) {
            this.AttendanceInDay.push(this._tools.cloneObject(this.Attendance[index + 1]))
            this.AttendanceInDay = this._tools.dynamicSortMutable(this.AttendanceInDay, ["DATETIME"])
          }
        }
      }
      this.GetFocusAttendance();
    }

  }
  GetFocusAttendance() {
    for (let index = 0; index < this.AttendanceInDay.length; index++) {
      const attIn = this.AttendanceInDay[index];
      const attOut = this.AttendanceInDay[index + 1];
      if (attIn != null && attOut != null) {
        if (attIn.TYPE == "c/in" && attOut.TYPE == "c/out") {
          const attInTimeNumber = this._tools.DateTime.convertDateToNumber(this._tools.DateTime.getDataFromJson(attIn.DATETIME))
          const attOutTimeNumber = this._tools.DateTime.convertDateToNumber(this._tools.DateTime.getDataFromJson(attOut.DATETIME))
          var time = this._tools.DateTime.convertNumberToTime((attOutTimeNumber - attInTimeNumber));
          attOut.Time = `${time.HOUR}:${time.MINUTE}:${time.SECOND}`;
          attIn.Time = "0:0:0";
          attIn.IsImpotent = true;
          attOut.IsImpotent = true;
        }
      }
    }
  }
  getDeviceInfo(idDevice: any): any {
    return (this.Data.DEVICES as Array<any>).find(x => x.ID == idDevice)
  }
  getDevicePlace(idDevice: any): any {
    return (this.Data.PLACES as Array<any>).find(x => x.ID == (this.Data.DEVICES as Array<any>).find(x => x.ID == idDevice).PLACE_ID)
  }
  CompareAttendance(Att: any): boolean {
    var number_day = this._tools.DateTime.convertDateToNumber(this.Day).toString()
    if (number_day.includes(".")) {
      number_day = number_day.split(".")[0];
    }
    var number_Att = this._tools.DateTime.convertDateToNumber(this._tools.DateTime.getDataFromJson(Att.DATETIME)).toString()
    if (number_Att.includes(".")) {
      number_Att = number_Att.split(".")[0];
    }
    return number_day == number_Att;
  }
}
