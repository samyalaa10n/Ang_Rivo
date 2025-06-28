import { Component, Input, OnInit } from '@angular/core';
import { DataGridComponent } from "../../../../shared/components/dataGrid/dataGrid.component";
import { Column } from '../../../../shared/components/dataGrid/Column';
import { Tools } from '../../../../shared/service/Tools.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ComboBoxComponent } from "../../../../shared/components/comboBox/comboBox.component";
import { ButtonModule } from 'primeng/button';
import { DateTimeComponent } from "../../../../shared/components/DateTime/DateTime.component";
import { DialogModule } from 'primeng/dialog';
import { SpeedDialModule } from 'primeng/speeddial';
import { InputLabelComponent } from "../../../../shared/pages/TextLabel/InputLabel.component";


@Component({
  selector: 'app-revisionAttendance',
  templateUrl: './revisionAttendance.component.html',
  styleUrls: ['./revisionAttendance.component.css'],
  imports: [NgFor, ComboBoxComponent, ButtonModule, NgIf, DialogModule, DateTimeComponent, NgClass, SpeedDialModule, InputLabelComponent],
  standalone: true,
})
export class RevisionAttendanceComponent implements OnInit {
  @Input() TargetForget: Array<any> = [];
  @Input() Attendance: Array<any> = [];
  @Input() AttendanceDelete: Array<any> = [];
  @Input() Data: any = null;
  @Input() AttSelected: any = null;
  @Input() DataLoaded: any = true;
  @Input() employSelected: any = null;
  ShowDialogDeleted: boolean = false
  ShowDialogEdit: boolean = false
  ShowDialogForget: boolean = false
  constructor(public _tools: Tools) {
  }
  getTotalHours(): string {
    let TOTAL_NUMBER = this.Attendance.filter(x => x.TotalHoursWithNumber != undefined).map(x => x.TotalHoursWithNumber).reduce((a, b) => a + b, 0);
    return this._tools.DateTime.convertNumberToTimeString(TOTAL_NUMBER);
  }
  ngOnInit() {
    this.InitialAttendance()
  }
  ngOnChange() {
    this.InitialAttendance()
  }
  InitialAttendance() {
    this._tools.Loading.startLoading();
    this.Attendance = this._tools.dynamicSortMutable(this.Attendance, ["DATETIME"])
    for (let index = 0; index < this.Attendance.length; index++) {
      const Att = this.Attendance[index];
      Att.MainIndex = index;
      Att.TIME = this._tools.DateTime.getDataFromJson(Att.DATETIME)
      Att.RecordChanges = [this._tools.cloneObject(Att)];
    }
    this.CheckerAttendance();
    this.DataLoaded = true
    this._tools.waitExecuteFunction(100, () => {
      this._tools.Loading.stopLoading();
    })
  }
  ShowAttRecords(Att: any) {
    this.AttSelected = Att;
    this.ShowDialogEdit = true;
  }
  // التحقق من التكرار في أنواع البصمات
  validateDuplicateTypes() {
    for (let index = 0; index < this.Attendance.length; index++) {
      const AttIn = this.Attendance[index];
      const AttOut = this.Attendance[index + 1];
      if (AttIn && AttOut) {
        if (AttIn.TYPE == AttOut.TYPE) {
          AttOut.ERROR = true;
          AttOut.MESSAGE = "يوجد تكرار في نوع البصمة";
        } else {
          AttOut.ERROR = false;
          AttOut.MESSAGE = "";
        }
      }
    }
  }
  // تجهيز أوقات الشيفت مقارنة بالحضور والانصراف
  prepareShiftTimes(shift: any, actualIn: any, actualOut: any) {
    let shiftIn = this._tools.DateTime.convertDataToMoment(shift.IN);
    let shiftOut = this._tools.DateTime.convertDataToMoment(shift.OUT);

    shiftIn.set({ date: actualIn.date(), month: actualIn.month(), year: actualIn.year() });
    shiftOut.set({ date: actualOut.date(), month: actualOut.month(), year: actualOut.year() });

    if (shift.TYPE === "ليلية") {
      if (actualIn.hour() < 6) shiftIn.subtract(1, "day");
      if (actualOut.hour() < 6) shiftOut.subtract(1, "day");
    }

    return { shiftIn, shiftOut };
  }
  // معالجة التأخير والمبكر للحضور
  handleLateAndEarlyIn(AttIn: any, actualIn: any, shiftIn: any, shift: any) {
    const shiftInNum = this._tools.DateTime.convertDateToNumber(shiftIn.toDate());
    const actualInNum = this._tools.DateTime.convertDateToNumber(actualIn.toDate());
    if (actualInNum > shiftInNum) {
      let late = this._tools.DateTime.convertNumberToTime(actualInNum - shiftInNum);
      if (late.HOUR === 0 && late.MINUTE <= shift.LATE_AFTER_MINT) {
        actualIn = shiftIn.clone();
        AttIn.TIME = shiftIn.toISOString();
        this.addChangeRecord(AttIn)
      } else {
        AttIn.LATE = this._tools.DateTime.TimeToString(late);
      }
    }
    if (actualInNum < shiftInNum) {
      let early = this._tools.DateTime.convertNumberToTime(shiftInNum - actualInNum);
      if (early.HOUR === 0 && early.MINUTE <= shift.EARLY_BEFORE_MINT) {
        actualIn = shiftIn.clone();
        AttIn.TIME = shiftIn.toISOString();
        this.addChangeRecord(AttIn)
      } else {
        AttIn.EARLY = this._tools.DateTime.TimeToString(early);
      }
    }

    return actualIn;
  }
  // معالجة الانصراف المبكر والإضافي
  handleEarlyLeaveAndOvertime(AttOut: any, actualOut: any, shiftOut: any, shift: any) {
    const shiftOutNum = this._tools.DateTime.convertDateToNumber(shiftOut.toDate());
    const actualOutNum = this._tools.DateTime.convertDateToNumber(actualOut.toDate());

    if (actualOutNum < shiftOutNum) {
      let earlyLeave = this._tools.DateTime.convertNumberToTime(shiftOutNum - actualOutNum);
      if (earlyLeave.HOUR === 0 && earlyLeave.MINUTE <= 0) {
        // actualOut = shiftOut.clone();
        // AttOut.TIME = shiftOut.toISOString();
      } else {
        AttOut.EARLY_LEAVE = this._tools.DateTime.TimeToString(earlyLeave);
      }
    }

    if (actualOutNum > shiftOutNum) {
      let overTime = this._tools.DateTime.convertNumberToTime(actualOutNum - shiftOutNum);
      if (overTime.HOUR === 0 && overTime.MINUTE <= shift.ADTIONAFTER) {
        actualOut = shiftOut.clone();
        AttOut.TIME = shiftOut.toISOString();
        this.addChangeRecord(AttOut)
      } else {
        AttOut.OVERTIME = this._tools.DateTime.TimeToString(overTime);
      }
    }

    return actualOut;
  }
  // معالجة الحضور والانصراف مع احتساب التأخير والمبكر والإضافي
  processAttendancePair(AttIn: any, AttOut: any) {
    let actualIn = this._tools.DateTime.convertDataToMoment(AttIn.TIME);
    let actualOut = this._tools.DateTime.convertDataToMoment(AttOut.TIME);

    AttIn.LATE = null;
    AttIn.EARLY = null;
    AttOut.OVERTIME = null;
    AttOut.EARLY_LEAVE = null;
    let shift = null;
    if (AttIn.Shift == 0 || AttIn.Shift == undefined) {
      shift = (this.Data.SHIFTS as Array<any>).find(x => this._tools.DateTime.inRange(x.REANG_START, AttIn.TIME, x.REANG_END) && x.PLACE_ID == (AttIn?.ID_PLACE != null ? AttIn.ID_PLACE : this.getDevicePlace(AttIn.ID_DIVICE_IN_SYSTEM).ID));
    }
    else {
      shift = (this.Data.SHIFTS as Array<any>).find(x => x.ID == AttIn.Shift);
    }
    if (!shift) {
      AttIn.Shift = 0;
      const attInTimeNumber = this._tools.DateTime.convertDateToNumber(actualIn.toDate());
      const attOutTimeNumber = this._tools.DateTime.convertDateToNumber(actualOut.toDate());
      AttIn.TotalHoursWithNumber = attOutTimeNumber - attInTimeNumber;
      AttIn.HOURS = this._tools.DateTime.convertNumberToTimeString(attOutTimeNumber - attInTimeNumber);
      AttOut.HOURS = "";
      return;
    }

    AttIn.Shift = shift.ID;

    const { shiftIn, shiftOut } = this.prepareShiftTimes(shift, actualIn, actualOut);

    actualIn = this.handleLateAndEarlyIn(AttIn, actualIn, shiftIn, shift);
    actualOut = this.handleEarlyLeaveAndOvertime(AttOut, actualOut, shiftOut, shift);

    const attInTimeNumber = this._tools.DateTime.convertDateToNumber(actualIn.toDate());
    const attOutTimeNumber = this._tools.DateTime.convertDateToNumber(actualOut.toDate());

    AttIn.TotalHoursWithNumber = attOutTimeNumber - attInTimeNumber;
    AttIn.HOURS = this._tools.DateTime.convertNumberToTimeString(attOutTimeNumber - attInTimeNumber);
    AttOut.HOURS = "";
  }
  CheckerAttendance() {
    this.validateDuplicateTypes();
    let IsRightCount = 0;
    for (let index = 0; index < this.Attendance.length; index++) {
      const AttIn = this.Attendance[index];
      const AttOut = this.Attendance[index + 1];

      if (!AttIn?.ERROR && !AttOut?.ERROR && AttIn?.TYPE === "c/in" && AttOut?.TYPE === "c/out") {
        this.processAttendancePair(AttIn, AttOut);
        IsRightCount++;
        if (IsRightCount % 2 == 0) {
          AttIn.classColor = true
          AttOut.classColor = true
          AttIn.classColor2 = false;
          AttOut.classColor2 = false;
        }
        else {
          AttIn.classColor2 = true
          AttOut.classColor2 = true
          AttIn.classColor = false;
          AttOut.classColor = false;
        }
      } else {
        if (AttIn) AttIn.TotalHoursWithNumber = 0;
        if (AttIn) AttIn.HOURS = "";
        if (AttOut) AttOut.HOURS = "";
      }
    }
  }
  onChangeAttendance(Att: any, event: any) {
    if (Att.TIME != null) {
      if (typeof Att.TIME == "string") {
        Att.TIME = this._tools.DateTime.getDataFromJson(Att.TIME)
        Att.TIME = this._tools.DateTime.convertDataToMoment(Att.DATETIME).set("hours", (Att.TIME as Date).getHours()).set("minutes", (Att.TIME as Date).getMinutes()).set("seconds", (Att.TIME as Date).getSeconds()).clone().toDate();
      }
      else {
        Att.TIME = this._tools.DateTime.convertDataToMoment(Att.DATETIME).set("hours", (Att.TIME as Date).getHours()).set("minutes", (Att.TIME as Date).getMinutes()).set("seconds", (Att.TIME as Date).getSeconds()).clone().toDate();
      }

      this.addChangeRecord(Att)
    }
    if (this.AttSelected?.FORGET_ID != null) this.AttSelected.FORGET_ID = undefined;
    this.CheckerAttendance()
  }
  ShowDeleted() {
    this.ShowDialogDeleted = true;
  }
  searchInForget(Att: any) {
    this.AttSelected = Att;
    let IsIn = (F: any, Att: any): boolean => {
      if (Att.CompleteAtt.TYPE == 'c/in') {
        if (F.IN == null) {
          return false
        }
        let TargetDate = this._tools.DateTime.convertDataToMoment(this._tools.DateTime.getDataFromJson(Att.CompleteAtt.DATETIME)).clone();
        let startDate = this._tools.DateTime.convertDataToMoment(F.IN).add("day", -1).clone();
        let endDate = this._tools.DateTime.convertDataToMoment(F.IN).add("day", 1).clone();
        return TargetDate.isBetween(startDate, endDate);
      }
      else {
        if (F.OUT == null) {
          return false
        }
        let TargetDate = this._tools.DateTime.convertDataToMoment(this._tools.DateTime.getDataFromJson(Att.CompleteAtt.DATETIME)).clone();
        let startDate = this._tools.DateTime.convertDataToMoment(F.OUT).add("day", -1).clone();
        let endDate = this._tools.DateTime.convertDataToMoment(F.OUT).add("day", 1).clone();
        return TargetDate.isBetween(startDate, endDate);
      }
    }
    this.TargetForget = (this.Data.FORGITS as Array<any>).filter(x => x.ID_EMPLOY == this.employSelected.ID && IsIn(x, Att.CompleteAtt))
    this.ShowDialogForget = true;
    this.CheckerAttendance()
  }
  selectForgetAtt(Forg: any) {
    if (this.AttSelected.TYPE == "c/in") {
      this.AttSelected.TIME = Forg.IN;
    }
    else {
      this.AttSelected.TIME = Forg.OUT;
    }
    this.AttSelected.FORGET_ID = Forg.ID;
    this.AttSelected.ID_PLACE = Forg.ID_PLACE;
    this.ShowDialogForget = false;
    this.AttSelected.Shift = (this.Data.SHIFTS as Array<any>).find(x => x.PLACE_ID == Forg.ID_PLACE)?.ID;
    this.addChangeRecord(this.AttSelected)
    this.CheckerAttendance();

  }
  Delete(index: number) {
    if (!this.Attendance[index].IsAdded) {
      let deleted = this._tools.cloneObject(this.Attendance[index]);
      this.AttendanceDelete.push(deleted)
    }
    this.Attendance.splice(index, 1);
    this.CheckerAttendance()
  }
  UnDelete(index: number) {
    this.Attendance.splice(this.AttendanceDelete[index].MainIndex, 0, this._tools.cloneObject(this.AttendanceDelete[index]))
    this.AttendanceDelete.splice(index, 1);
    if (this.AttendanceDelete.length == 0) {
      this.ShowDialogDeleted = false;
    }
    this.CheckerAttendance()
  }
  AddIn(Att: any, index: number) {
    let nAdd = this._tools.cloneObject(Att)
    nAdd.RecordChanges = [this._tools.cloneObject(nAdd)];
    nAdd.TYPE = "c/in"
    Att.CompleteAtt = nAdd;
    nAdd.CompleteAtt = Att;
    nAdd.IsAdded = true
    nAdd.Shift = 0;
    nAdd.ID_Place = this.getDevicePlace(nAdd.ID_DIVICE_IN_SYSTEM).ID
    this.Attendance.splice(index, 0, nAdd)
    this.CheckerAttendance()
  }
  AddOut(Att: any, index: number) {
    let nAdd = this._tools.cloneObject(Att);
    nAdd.RecordChanges = [this._tools.cloneObject(nAdd)];
    nAdd.TYPE = "c/out"
    nAdd.IsAdded = true
    nAdd.Shift = 0;
    Att.CompleteAtt = nAdd;
    nAdd.CompleteAtt = Att;
    nAdd.ID_Place = this.getDevicePlace(nAdd.ID_DIVICE_IN_SYSTEM).ID
    this.Attendance.splice(index + 1, 0, nAdd)
    this.CheckerAttendance()
  }
  getDeviceInfo(idDevice: any): any {
    return (this.Data.DEVICES as Array<any>).find(x => x.ID == idDevice)
  }
  getDevicePlace(idDevice: any): any {
    return (this.Data.PLACES as Array<any>).find(x => x.ID == (this.Data.DEVICES as Array<any>).find(x => x.ID == idDevice).PLACE_ID)
  }
  getPlace(idPlace: any): any {
    return (this.Data.PLACES as Array<any>).find(x => x.ID == idPlace)
  }
  SelectOldEdit(Att: any) {
    let OldAtt = this._tools.cloneObject(this.AttSelected)
    let index = this.Attendance.indexOf(this.AttSelected)
    if (index > -1) {
      this.Attendance[index] = Att;
      this.Attendance[index].RecordChanges = OldAtt.RecordChanges;
      let nAtt = this._tools.cloneObject(Att);
      nAtt.RecordChanges = [];
      (this.Attendance[index].RecordChanges as Array<any>).push(nAtt);
    }
    this.ShowDialogEdit = false;
    this.CheckerAttendance();
  }
  getBtnItems(Att: any) {
    let btnAdd = {
      label: "اضافة " + (Att.TYPE == "c/in" ? "c/out" : "c/in"),
      icon: 'pi pi-plus',
      command: () => {
        if (Att.TYPE == "c/in") {
          this.AddOut(Att, this.Attendance.indexOf(Att))
        } else {
          this.AddIn(Att, this.Attendance.indexOf(Att))
        }
      }
    };
    let btnCancel = {
      label: 'الغاء',
      icon: 'pi pi-trash',
      command: () => {
        this.Delete(this.Attendance.indexOf(Att))
      },
    }
    let btnSearchForget = {
      label: 'بحث في النواقص',
      icon: 'pi pi-search',
      command: () => {
        this.searchInForget(Att)
      },
    };
    let btnShowRecords = {
      label: 'عرض سجل التعديلات',
      icon: 'pi pi-external-link',
      command: () => {
        this.ShowAttRecords(Att)
      },
    };

    let items: any[] = [];
    items.push(btnAdd);
    items.push(btnCancel);
    if (Att?.IsAdded) {
      items.push(btnSearchForget);
    }
    if (Att?.RecordChanges?.length > 1) {
      items.push(btnShowRecords);
    }
    return items;
  }
  addChangeRecord(Att: any) {
    let compare = (item1: any, item2: any): boolean => {
      let result = item1.TIME == item2.TIME && item1.DATETIME == item2.DATETIME && item1.TYPE == item2.TYPE && item1.ID_DIVICE_IN_SYSTEM == item2.ID_DIVICE_IN_SYSTEM && item1.ID_PLACE == item2.ID_PLACE
      return result
    }
    let old = (Att.RecordChanges as Array<any>).find(z => compare(z, Att));
    if (old == null) {
      let nAtt = this._tools.cloneObject(Att);
      (Att.RecordChanges as Array<any>).push(nAtt);
    }
  }
  setTrColor(Att: any, Tr: HTMLElement) {
    Tr.classList.remove("bgTIn")
    Tr.classList.remove("bgTrOut")
    Tr.classList.remove("bg2TIn")
    Tr.classList.remove("bg2TrOut")
    if ((Att.IsAdded == false || Att.IsAdded == undefined ) && (Att.ERROR==false || Att.ERROR==undefined)) {
      if (Att.classColor) {
        if (Att.TYPE == 'c/in') {
          Tr.classList.add("bgTIn")
        }
        if (Att.TYPE == 'c/out') {
          Tr.classList.add("bgTrOut")
        }
      }
      if (Att.classColor2) {
        if (Att.TYPE == 'c/in') {
          Tr.classList.add("bg2TIn")
        }
        if (Att.TYPE == 'c/out') {
          Tr.classList.add("bg2TrOut")
        }
      }
    }
  }
}
