import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.css'],
  standalone: true,
  imports: [MultiSelectModule, FormsModule, ButtonModule,InputTextModule, IftaLabelModule]
})
export class MultiselectComponent implements OnInit {

  @Input() item: any = null;
  @Input() propertyBind: string = '';
  @Input() idItemKey: string = '' // id item;
  @Input() selectIdKey: string = '' // id place;
  @Input() optionValue: string = '' // PLACE_ID;
  @Input() IsInGridMode: boolean = false;


  @Input() appendTo: string = 'body'
  @Input() display: string = 'comma'
  @Input() dataSource: Array<any> = []
  @Input() placeholder: string = 'اختر'
  @Input() Label: string = ''
  @Input() optionLabel: string = 'name'
  @Input() dataSelected: Array<any> = []
  @Input() maxSelectedLabels: number = 3;
  @Input() style: any = { 'width': '100%' }
  @Input() textHeader: string = "العناصر المتاحة"
  @Input() selectedItemsLabel: string = "تم تحديد {0} عناصر"
  @Output() dataSelectedChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  change(selected: Array<any>) {
    if (this.dataSelected == undefined) {
      this.dataSelected = [];
    }
    this.dataSelected = selected;
    this.dataSelectedChange.emit(selected)
    if (this.IsInGridMode) {
      let ArraySelected = this.item[this.propertyBind]==undefined?[]:this.item[this.propertyBind] as Array<any>
      if (ArraySelected) {
        selected.forEach(select => {
          let finder = ArraySelected.find(x => x[this.optionValue] == select.ID)
          if (finder) {
            finder[this.optionValue] = select.ID;
          }
          else {
            finder = {};
            finder[this.selectIdKey] = this.item.ID
            finder[this.optionValue] = select.ID;
            ArraySelected.push(finder)
          }
        })
        this.item[this.propertyBind] = ArraySelected.filter(z => this.dataSelected.find(x => x.ID == z[this.optionValue]) != null)
      }
    }
  }
  ngOnChanges() {
    if (this.IsInGridMode) {
      let ArraySelected = this.item[this.propertyBind] as Array<any>
      if (ArraySelected) {
        let Array: Array<any> = [];
        ArraySelected.forEach(select => {
          let finder = this.dataSource.find(x => x.ID == select[this.optionValue])
          if (finder) {
            Array.push(finder);
          }
        });
        this.dataSelected = Array;
      }
    }
    else
    {
      if(this.dataSelected!=null)
      this.dataSelected =this.dataSource.filter(z=>this.dataSelected.map(x=>x[this.optionValue]).includes(z[this.optionValue]))
    }
  }

}
