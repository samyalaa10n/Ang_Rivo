import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { ComboBoxComponent } from "../../components/comboBox/comboBox.component";
import { NgIf } from '@angular/common';
import { DateTimeComponent } from "../../components/DateTime/DateTime.component";
import { Tools } from '../../service/Tools.service';
import { MultiselectComponent } from "../../components/multiselect/multiselect.component";
@Component({
  selector: 'app-InputLabel',
  templateUrl: './InputLabel.component.html',
  styleUrls: ['./InputLabel.component.css'],
  standalone: true,
  imports: [IftaLabelModule, FormsModule, InputTextModule, ComboBoxComponent, NgIf, DateTimeComponent, MultiselectComponent]
})
export class InputLabelComponent implements OnInit {
  value: any = null;
  apiData: Array<any> = [];
  CONFIGURATION = { "API_CALLING": "Employee", "FOCUS_PROPERTY": "CODE", "REQUIRED": true, "ArrayOfValues": [], ShowValue: "" }
  @Input() Effect: any
  @Input() effectSelected: any
  @Input() placeholder: string = ""
  constructor(private _tools: Tools, private _el: ElementRef<HTMLElement>) { }

  async ngOnInit() {
    if(this.Effect)
      {
        if (this.Effect.TYPE == 1 || this.Effect.TYPE == 2 || this.Effect.TYPE == 3 || this.Effect.TYPE == 9) {
          this.apiData = await this._tools.Network.getAsync(this.Effect.CONFIGURATION.API_CALLING) as Array<any>
        }
      }
  }
  ngAfterViewInit() {
    this._tools.waitExecuteFunction(100, () => {
      this._el.nativeElement.style.display = "block";
      this._el.nativeElement.style.width = this.getWidth();
    });
  }
  ngOnChanges() {
    if (this.Effect && this.Effect.value == undefined) {
      this.Effect.value = null;
    }
  }
  getWidth(): string {
    let width = "200px"
    if (this.Effect) {
      switch (this.Effect.TYPE) {
        case 4:
          width = "100%"
          break;
      }
      return width;
    }
    return '';
  }
  setEffectValue(data: any, comboBox: boolean = false) {
    let value = 0;
    if (!comboBox) {
      (data as Array<any>).forEach(item => {
        value += item?.VALUE ?? 0;
      });
    }
    else {
      value += data?.VALUE ?? 0;
    }
    
    if (value > 0 && this.Effect.CONFIGURATION.FORCE_VALUE == true) {
      this.effectSelected.EFFECT_INFO.Value = value;
      this.effectSelected.EFFECT_INFO.ForceValue = true;
    }
    else if (this.Effect.CONFIGURATION.FORCE_VALUE == false) {
      this.effectSelected.EFFECT_INFO.Value = value;
      this.effectSelected.EFFECT_INFO.ForceValue = false;
    }
    this.effectSelected.EFFECT_INFO.calcByHours = this.Effect.CONFIGURATION.calculatedByHours;
  }
}
