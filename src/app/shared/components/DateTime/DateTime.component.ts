import { Component, ElementRef, EventEmitter, Input, OnInit, OnChanges, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Tools } from '../../service/Tools.service';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-DateTime',
  templateUrl: './DateTime.component.html',
  styleUrls: ['./DateTime.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, DatePickerModule]
})
export class DateTimeComponent implements OnInit, OnChanges {

  @Input() maxDate: Date | null = null;
  @Input() minDate: Date | null = null;
  @Input() dateFormat: string = "";
  @Input() saveTempInput: any = null;
  @Input() hourFormat: string = "24";
  @Input() selectedDate: any = null;
  @Input() showTime: boolean = false;
  @Input() showOnFocus: boolean = false;
  @Input() ShowMode: boolean = false;
  @Input() ShowModeFormat: string = "YYYY-MM-DD";
  @Input() selectOnFocus: boolean = false;
  @Input() showTimeOnly: boolean = false;
  @Input() forceMaxOrEqualDay: boolean = false;
  @Input() view: 'date' | 'month' | 'year' = "date";
  @Input() placeholder: string = "Enter date...";
  @Output() selectedDateChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('calendarRef') calendarRef: any;

  segments = { day: '', month: '', year: '', hour: '', minute: '' };
  justFocused: { [key: string]: boolean } = {};
  calendarDate: Date | null = null;

  constructor(public _tools: Tools, private el: ElementRef<HTMLElement>) { }

  ngOnInit() {
    if (this.saveTempInput) {
      this.selectedDate = this._tools.DateTime.getDataFromJson(
        this._tools.getInputLabel(this.saveTempInput)
      );
    }
    this.syncSegmentsFromDate();
  }

  ngOnChanges() {
    this.syncSegmentsFromDate();
  }

  syncSegmentsFromDate() {
    if (!this.selectedDate) {
      this.segments = { day: '', month: '', year: '', hour: '', minute: '' };
      this.calendarDate = null;
      return;
    }
    const d = new Date(this.selectedDate);
    if (isNaN(d.getTime())) return;
    this.segments.day    = String(d.getDate()).padStart(2, '0');
    this.segments.month  = String(d.getMonth() + 1).padStart(2, '0');
    this.segments.year   = String(d.getFullYear());
    this.segments.hour   = String(d.getHours()).padStart(2, '0');
    this.segments.minute = String(d.getMinutes()).padStart(2, '0');
    this.calendarDate    = d;
  }

  toggleCalendar() {
    if (!this.calendarRef) return;

    if (this.hasValue()) {
      const d = parseInt(this.segments.day || "1");
      const m = parseInt(this.segments.month || "1") - 1;
      const y = parseInt(this.segments.year || String(new Date().getFullYear()));
      const h = parseInt(this.segments.hour || "0");
      const min = parseInt(this.segments.minute || "0");
      const date = new Date(y, m, d, h, min);
      if (!isNaN(date.getTime())) this.calendarDate = date;
    }

    // نضغط على الـ input الخاص بـ p-datePicker عشان يفتح في مكانه الصح
    const inputEl = this.el.nativeElement.querySelector(".calendar-anchor input") as HTMLElement;
    if (inputEl) inputEl.click();
  }

  onCalendarSelect(date: Date) {
    if (!date) return;
    this.segments.day    = String(date.getDate()).padStart(2, '0');
    this.segments.month  = String(date.getMonth() + 1).padStart(2, '0');
    this.segments.year   = String(date.getFullYear());
    this.segments.hour   = String(date.getHours()).padStart(2, '0');
    this.segments.minute = String(date.getMinutes()).padStart(2, '0');
    this.tryEmit();
  }

  onSegmentFocus(event: FocusEvent, field: string) {
    const input = event.target as HTMLInputElement;
    this.justFocused[field] = true;
    setTimeout(() => input.select(), 0);
  }

  onSegmentInput(field: string, event: any, nextEl: any) {
    let val = event.target.value.replace(/\D/g, '');

    // لو أول ضغطة بعد focus - ابدأ من الصفر بدل ما تكمل
    if (this.justFocused[field]) {
      this.justFocused[field] = false;
      val = val.slice(-1); // خد آخر رقم بس (اللي اتكتب دلوقتي)
    }

    (this.segments as any)[field] = val;
    event.target.value = val;

    const maxLen: any = { day: 2, month: 2, year: 4, hour: 2, minute: 2 };
    if (val.length >= maxLen[field] && nextEl) {
      nextEl.focus();
      nextEl.select();
    }
    this.tryEmit();
  }

  onSegmentKeydown(field: string, event: KeyboardEvent, prevEl: any, nextEl: any) {
    const val = (this.segments as any)[field];
    if (event.key === 'Backspace' && val === '' && prevEl) {
      prevEl.focus();
      prevEl.select();
    }
    if (event.key === 'ArrowRight' && nextEl) {
      nextEl.focus();
      nextEl.select();
    }
    if (event.key === 'ArrowLeft' && prevEl) {
      prevEl.focus();
      prevEl.select();
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const inc = event.key === 'ArrowUp' ? 1 : -1;
      this.incrementSegment(field, inc);
    }
  }

  incrementSegment(field: string, inc: number) {
    let val = parseInt((this.segments as any)[field] || '0') + inc;
    const limits: any = {
      day:    [1, 31],
      month:  [1, 12],
      year:   [1900, 2100],
      hour:   [0, 23],
      minute: [0, 59]
    };
    const [min, max] = limits[field];
    if (val < min) val = max;
    if (val > max) val = min;
    const pad = field === 'year' ? 4 : 2;
    (this.segments as any)[field] = String(val).padStart(pad, '0');
    this.tryEmit();
  }

  padSegment(field: string) {
    const val = (this.segments as any)[field];
    if (!val) return;
    const pad = field === 'year' ? 4 : 2;
    (this.segments as any)[field] = val.padStart(pad, '0');
  }

  tryEmit() {
    const { day, month, year, hour, minute } = this.segments;
    if (!day || !month || !year || year.length < 4) return;

    const d = parseInt(day), m = parseInt(month) - 1, y = parseInt(year);
    let date: Date;

    if (this.showTime || this.showTimeOnly) {
      date = new Date(y, m, d, parseInt(hour || '0'), parseInt(minute || '0'));
    } else {
      date = new Date(y, m, d);
    }

    if (isNaN(date.getTime())) return;
    if (this.maxDate && date > this.maxDate) return;
    if (this.minDate && date < this.minDate) return;

    if (this.forceMaxOrEqualDay) {
      const now = new Date();
      now.setDate(1);
      const check = new Date(y, m, 1);
      if (check < now) {
        this._tools.Toaster.showError("Date must be greater than or equal to current month");
        return;
      }
    }

    this.selectedDate = date;
    this.calendarDate = date;
    if (this.saveTempInput) this._tools.saveInputInLabel(this.saveTempInput, date);

    if (this.showTime || this.showTimeOnly) {
      this.selectedDateChange.emit(this._tools.DateTime.getValueJsonWithGMT(date));
    } else {
      this.selectedDateChange.emit(date);
    }
  }

  hasValue(): boolean {
    return !!(this.segments.day || this.segments.month || this.segments.year);
  }

  clear() {
    this.segments = { day: '', month: '', year: '', hour: '', minute: '' };
    this.calendarDate = null;
    this.selectedDate = null;
    this.selectedDateChange.emit(null);
  }

  copy() {
    navigator.clipboard.writeText(JSON.stringify(this.segments));
    this._tools.Toaster.showInfo("Data copied to clipboard");
  }

  async past() {
    var data = JSON.parse(await navigator.clipboard.readText());
    if (data) {
      this.segments = data;
      this.tryEmit();
    }
  }
}