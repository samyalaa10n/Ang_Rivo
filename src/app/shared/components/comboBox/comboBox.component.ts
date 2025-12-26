import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { Tools } from '../../service/Tools.service';

@Component({
  selector: 'app-comboBox',
  templateUrl: './comboBox.component.html',
  styleUrls: ['./comboBox.component.css'],
  standalone: true,
  imports: [SelectModule, FormsModule, InputTextModule, IftaLabelModule]
})
export class ComboBoxComponent implements OnInit {
  @Input() selected: any = null
  @Input() selSaveLabelInput: any = null
  @Input() optionLabel: string = ''
  @Input() optionValue: string = ''
  @Input() placeholder: string = ''
  @Input() IsLoading: boolean = false
  @Input() apiPathDataSource: string = ''
  @Input() Label: string = ''
  @Input() SelectedValue: any = null
  @Input() NormalStyle: boolean = false
  @Input() showClear: boolean = true;
  @Input() ShowMode: boolean = false;
  @Input() DefaultClearValue: any = 0;
  @Input() CashId: string = "";
  @Input() dataSource: Array<any> = []
  nativeDataSource: Array<any> = []
  @Input() refreshSource: { func: any, item: any } = { func: null, item: null }
  @Output() selectedChange: EventEmitter<any> = new EventEmitter();
  @Output() SelectedValueChange: EventEmitter<any> = new EventEmitter();
  constructor(private _tools: Tools) { }

  ngOnInit() {
    this.nativeDataSource = this.dataSource
    if (this.CashId != "") {
      let data = localStorage.getItem(this.CashId);
      if (data) {
        this.SelectedValue = data;
        var e :any={}
        e[this.optionValue]= this.SelectedValue;
        this.selectedItem(e)
      }
    }
  }
  ngOnChanges() {
    if (this.optionValue != "") {
      this.selected = this.dataSource?.find(x => x[this.optionValue] == this.SelectedValue)
      if (this.selected == null) {
        this.SelectedValueChange.emit(this.DefaultClearValue);
      }
    }
  }
  async onShow() {
    if (this.apiPathDataSource != '') {
      this.IsLoading = true;
      let dataSource = await this._tools.Network.getAsync(this.apiPathDataSource)
      this.IsLoading = false;
      if (dataSource && Array.isArray(dataSource)) {
        this.dataSource = dataSource;
        this.selected = this.selected ? this.dataSource.find(x => x.ID == this.selected.ID) : null;
      }
    }
    if (this.refreshSource.func) {
      this.dataSource = this.refreshSource.func(this.refreshSource.item, this.nativeDataSource)
    }
  }
  selectedItem(item: any) {
    if (item && item != "") {
      this.selectedChange.emit(item);
      if (item[this.optionValue] != undefined) {
        this.SelectedValueChange.emit(item[this.optionValue]);
        if (this.CashId != "") {
          localStorage.setItem(this.CashId, item[this.optionValue]);
        }
      }
      else {
        this.SelectedValueChange.emit(null);
      }
    }
  }
  clear() {
    this.SelectedValue = null;
    this.selectedChange.emit(null);
    this.SelectedValueChange.emit(this.DefaultClearValue);
    this.onClear();
  }
  onClear() {

  }
}
