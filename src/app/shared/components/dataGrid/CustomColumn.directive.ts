import { Directive, Input, TemplateRef } from '@angular/core';
import { DataGridComponent } from './dataGrid.component';
import { Column } from './Column';

@Directive({
  selector: '[appCustomColumn]'
})
export class CustomColumnDirective {

  @Input() appCustomColumn!: Column | DataGridComponent
  constructor(private _temp: TemplateRef<any>) {
  
  }
  ngOnChanges() {
    if (this.appCustomColumn) {
      if (this.appCustomColumn instanceof Column) {
        this.appCustomColumn.templateColumn = this._temp;
      }
      if (this.appCustomColumn instanceof DataGridComponent) {
        this.appCustomColumn.templateBtn = this._temp;
      }
    }
  }

}
