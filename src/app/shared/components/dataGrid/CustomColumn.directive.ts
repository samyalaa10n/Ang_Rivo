import { Directive, Input, TemplateRef } from '@angular/core';
import { DataGridComponent } from './dataGrid.component';
import { Column } from './Column';

@Directive({
  selector: '[appCustomColumn]'
})
export class CustomColumnDirective {

  @Input() appCustomColumn!: Column
  constructor(private _temp: TemplateRef<any>) {
    console.log(_temp)
  }
  ngOnChanges() {
    if (this.appCustomColumn) {
      this.appCustomColumn.templateColumn = this._temp;
    }
  }

}
