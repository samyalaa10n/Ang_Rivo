import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { Tools } from '../../service/Tools';

@Component({
  selector: 'app-comboBox',
  templateUrl: './comboBox.component.html',
  styleUrls: ['./comboBox.component.css'],
  standalone: true,
  imports: [DropdownModule, FormsModule, InputTextModule, IftaLabelModule]
})
export class ComboBoxComponent implements OnInit {
  @Input() selected: any = null
  @Input() optionLabel: string = ''
  @Input() optionValue: string = ''
  @Input() placeholder: string = ''
  @Input() IsLoading: boolean = false
  @Input() apiPathDataSource: string = ''
  @Input() Label: string = ''
  @Input() SelectedValue: any = null
  @Input() DefaultClearValue: any = 0;
  @Input() dataSource: Array<any> = []
  @Output() selectedChange: EventEmitter<any> = new EventEmitter();
  @Output() SelectedValueChange: EventEmitter<any> = new EventEmitter();
  constructor(private _tools: Tools) { }

  ngOnInit() {
  }
  ngOnChanges() {
    if (this.optionValue != "") {
      this.selected = this.dataSource.find(x => x[this.optionValue] == this.SelectedValue)
    }
  }
  async onShow() {
    if (this.apiPathDataSource != '') {
      this.IsLoading = true;
      let dataSource = await this._tools.getAsync(this.apiPathDataSource)
      this.IsLoading = false;
      if (dataSource && Array.isArray(dataSource)) {
        this.dataSource = dataSource;
        this.selected = this.selected ? this.dataSource.find(x => x.ID == this.selected.ID) : null;
      }
    }
  }
  selectedItem(item: any) {
    debugger
    if (item && item != "") {
      this.selectedChange.emit(item);
      if (item[this.optionValue] != undefined) {
        this.SelectedValueChange.emit(item[this.optionValue]);
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
