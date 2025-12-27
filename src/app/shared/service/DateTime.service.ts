import { Injectable } from '@angular/core';

import excelDateToJSDate from 'excel-date-to-js';
import moment, * as momentLP from 'moment';
import { DateTime } from 'luxon';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class TDateTime {
  _dateFormat!: DatePipe;
  Date_Data = {
    dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    dayNamesShort: ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
    dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
    monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    monthNamesShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    today: 'اليوم',
    clear: 'مسح',
    dateFormat: 'dd/mm/yy',
    weekHeader: 'أسبوع',
    firstDayOfWeek: 0
  }
  constructor() {
    moment.locale('ar');
  }
  GetNumberOfMonth(): number {
    return this.EditData(new Date()).getMonth() + 1;
  }
  GetNumberOfYear(): number {
    return this.EditData(new Date()).getFullYear();
  }
  EditData(dateTime: Date, GMT: any = ''): Date {
    if (dateTime instanceof Date) return new Date(dateTime.toLocaleDateString("en") + ' GMT+' + GMT)
    else if (typeof dateTime == "string") return new Date(dateTime + ' GMT+' + GMT)
    return new Date()
  }
  convertNumberToData(_number: any): Date {
    return excelDateToJSDate.getJsDateFromExcel(_number)
  }
  EditFormateData(dateTime: any, format: string = "HH:mm:ss YYYY-MM-DD"): string {
    if (dateTime != null && dateTime != "") {
      let Mdata = this.convertDataToMoment(dateTime)
      return Mdata.format(format);
    }
    return "";
  }
  getDataFromJson(selectedDate: string): Date {
    if (typeof selectedDate == "string") {
      const utcDate = DateTime.fromISO(selectedDate, { zone: 'Africa/Cairo' }).toUTC().toJSDate();
      return utcDate;
    }
    else return selectedDate
  }
  getValueJsonWithGMT(E: Date) {
    let toLocalISOString = (date: Date) => {
      const pad = (n: any) => n.toString().padStart(2, '0');
      return date.getFullYear() + '-' +
        pad(date.getMonth() + 1) + '-' +
        pad(date.getDate()) + 'T' +
        pad(date.getHours()) + ':' +
        pad(date.getMinutes()) + ':' +
        pad(date.getSeconds());
    }
    const localISO = toLocalISOString(E);
    return localISO;
  }
  getValueFromTime(e: Date): { HOUR: number, MINUTE: number, SECOND: number } {
    let value: any = { HOUR: null, MINUTE: null, SECOND: null }
    value.HOUR = e.getHours();
    value.MINUTE = e.getMinutes();
    value.SECOND = e.getSeconds();
    return value;
  }
  getTimeFromValue(e: any) {
    let date = new Date(new Date().toLocaleDateString("en") + " GMT")
    date.setHours(e.HOUR);
    date.setMinutes(e.MINUTE);
    date.setSeconds(e.SECOND);
    return date;
  }
  convertDataToMoment(JSdate: Date | string): momentLP.Moment {
    if (typeof JSdate == "string") {
      (JSdate as any) = this.getDataFromJson(JSdate);
    }
    const date = moment(JSdate);
    return date;
  }
  getDayName(date: momentLP.Moment | Date | string): string {
    if (date instanceof Date) {
      date = this.convertDataToMoment(date)
    }
    if (typeof date == "string") {
      date = this.convertDataToMoment(this.getDataFromJson(date))
    }
    if (date != null) {
      return this.Date_Data.dayNames[date.day()];
    }
    else return '';
  }
  convertDateToNumber(date: Date): number {
    if (typeof date == "string") {
      date = this.getDataFromJson(date)
    }
    const msPerDay = 24 * 60 * 60 * 1000;
    return date.getTime() / msPerDay + 25569;
  }
  convertNumberToTime(value: number): { HOUR: number, MINUTE: number, SECOND: number } {
    const totalSeconds = value * 24 * 60 * 60; // عدد الثواني في اليوم مضروب في القيمة
    const HOUR = Math.floor(totalSeconds / 3600);
    const MINUTE = Math.floor((totalSeconds % 3600) / 60);
    const SECOND = Math.round(totalSeconds % 60);
    return { HOUR, MINUTE, SECOND };
  }
  convertNumberToTimeOnly(value: number): { HOUR: number, MINUTE: number, SECOND: number } {
    let stN = Number.parseFloat(`0.${`${value}`.split('.').length == 2 ? `${value}`.split('.')[1] : `${value}`}`);
    return this.convertNumberToTime(stN);
  }
  convertNumberToTimeString(value: number): string {
    var totalSeconds = value * 24 * 60 * 60; // عدد الثواني في اليوم مضروب في القيمة
    var HOUR = Math.floor(totalSeconds / 3600);
    var MINUTE = Math.floor((totalSeconds % 3600) / 60);
    var SECOND = Math.round(totalSeconds % 60);
    if (SECOND == 60) {
      MINUTE = MINUTE + 1;
      SECOND = 0;
    }
    if (MINUTE == 60) {
      HOUR = HOUR + 1;
      MINUTE = 0;
    }
    return this.TimeToString({ HOUR, MINUTE, SECOND });
  }
  TimeToString(time: { HOUR: number, MINUTE: number, SECOND: number }) {
    let editNumber = (N: number) => {
      if (`${N}`.length == 1) {
        return `0${N}`;
      }
      else {
        return `${N}`
      }
    }
    return `${editNumber(time.HOUR)}:${editNumber(time.MINUTE)}:${editNumber(time.SECOND)}`;
  }
  convertTimeToNumber(time: { HOUR: number, MINUTE: number, SECOND: number }): number {
    const totalSeconds = time.HOUR * 3600 + time.MINUTE * 60 + time.SECOND;
    const value = totalSeconds / (24 * 60 * 60); // نقسم على عدد الثواني في اليوم
    return value;
  }
  inRange(START: any, DATE_TIME: any, END: any): boolean {
    const format = "HH:mm:ss";

    const time = moment(this.convertDataToMoment(DATE_TIME).format(format), format);
    const start = moment(this.convertDataToMoment(START).format(format), format);
    const end = moment(this.convertDataToMoment(END).format(format), format);

    if (start.isBefore(end)) {
      // Normal case (e.g., 09:00 to 17:00)
      return time.isBetween(start, end, undefined, '[]');
    } else {
      // Cross-midnight case (e.g., 22:00 to 03:00)
      return time.isSameOrAfter(start) || time.isSameOrBefore(end);
    }
  }
  // 1. إذا كنت تحفظ الوقت كـ string وتريد تحويله بشكل صحيح
  fixTimezoneIssue(dateString:string, offsetHours = 2) {
    const date = new Date(dateString);
    // أضف الفرق الزمني
    date.setHours(date.getHours() + offsetHours);
    return date;
  }

  // 2. تحويل التاريخ مع تصحيح التايم زون
  convertToLocalTimezone(dateString:string) {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset(); // بالدقائق
    const correctedDate = new Date(date.getTime() - offset * 60 * 1000);
    return correctedDate;
  }

  // 3. الطريقة الأفضل - استخدم ISO format مع التصحيح
  getCorrectDateTime(dateString:string, timezoneOffset:number = 2) {
    const date = new Date(dateString);
    // حول إلى UTC أولاً ثم أضف المنطقة الزمنية
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    const localDate = new Date(utcDate.getTime() + timezoneOffset * 60 * 60 * 1000);
    return localDate;
  }

  // 4. إذا كنت تريد حفظ الوقت بشكل صحيح في database
  saveWithCorrectTimezone(date:Date, timezoneOffset = 2) {
    // احفظ كـ UTC في database
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    return utcDate.toISOString();
  }

  // 5. واسترجع الوقت الصحيح من database
  getWithCorrectTimezone(isoString:string, timezoneOffset = 2) {
    const date = new Date(isoString);
    const localDate = new Date(date.getTime() + timezoneOffset * 60 * 60 * 1000);
    return localDate;
  }

  // 6. صيغة formatted للعرض
  formatWithTimezone(dateString:string, timezoneOffset = 2) {
    const date = this.getCorrectDateTime(dateString, timezoneOffset);
    return date.toLocaleString('ar-EG'); // تنسيق عربي
  }
}
