import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Tools } from '../../service/Tools.service';
import { DataGridComponent } from "../../components/dataGrid/dataGrid.component";
import { Column } from '../../components/dataGrid/Column';
import { HttpClientModule } from '@angular/common/http';
import { CustomColumnDirective } from '../../components/dataGrid/CustomColumn.directive';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-get-add-edit-delete',
  templateUrl: './get-add-edit-delete.component.html',
  styleUrls: ['./get-add-edit-delete.component.css'],
  standalone: true,
  imports: [DataGridComponent, ButtonModule],
})
export class GetAddEditDeleteComponent implements OnInit {
  @ViewChild('grid') grid!: DataGridComponent
  table: Table | null = null;
  @Input() ApiPage: string = ""
  @Input() GetApiPage: string = ""
  @Input() header: string = ""
  @Input() FilterInEdit: string = ""
  @Input() Columns: Array<Column> = []
  @Output() onUpdate: EventEmitter<any> = new EventEmitter()
  @Output() onConfigGrid: EventEmitter<DataGridComponent> = new EventEmitter()

  constructor(private _tools: Tools) { }

  ngOnInit() {
  }
  ngOnChanges() {
    this.ApiPage = this.ApiPage
    this.GetApiPage = this.GetApiPage
    this.FilterInEdit = this.FilterInEdit
  }
  ngAfterViewInit() {
    this._tools.waitExecuteFunction(100, () => {
      if (this.Columns.length == 0) {
        this.Columns.push(new Column('ID', "الكود", "lapel", "text"))
        this.Columns.push(new Column('NAME', "الأسم", "text", "text", 600))
        this.grid.Columns = this.Columns
      }
      else {
        this.grid.Columns = this.Columns
      }
      this.onConfigGrid.emit(this.grid);
      this.grid.onSaveChanges = (data: any) => this.saveChanges(data);
      this.grid.dataKey = "ID";
      this.grid.IsLoading = true;
      this._tools.Network.getAsync(this.GetApiPage == "" ? this.ApiPage : this.GetApiPage).then((data: any) => {
        this.grid.IsLoading = false;
        this.grid.dataSource = data
      })
      this.grid.onUpdate = async (t) => {
        this.table = t
        await this.Update();
      }
    })
  }
  deleteItem(item: any) {
    this.grid.dataSource.splice(this.grid.dataSource.indexOf(item), 1)
    this.grid.dt.reset();
  }
  async saveChanges(dataSaved: any = null) {
    let data: any = await this._tools.Network.putAsync(this.ApiPage + '/EditMore', dataSaved, this.FilterInEdit)
    if (data) {
      if (Array.isArray(data)) {
        this._tools.Toaster.showSuccess("تم التحديث بنجاح");
        if (this.GetApiPage == "" || this.GetApiPage == null) {
          this.grid.dataSource = data
        }
        else {
          data = await this.Update();
        }
        this.onUpdate.emit(data)
      }
      else {
        this._tools.Toaster.showError(data.MESSAGE);
      }

    }
    else {
      this._tools.Toaster.showError("رجاء ادخال البيانات بشكل صحيح و كامل");
    }
    return data
  }
  async Update() {
    if (this.table) this.table.loading = true;
    let data: any = await this._tools.Network.getAsync(this.GetApiPage == "" ? this.ApiPage : this.GetApiPage)
    if (data) {
      this.grid.dataSource = data
      this.onUpdate.emit(data)
    }
    else {
      this.grid.dataSource = []
      this.onUpdate.emit([])
    }
    if (this.table) {
      this.table.reset()
      this.table.loading = false;
    }
    return data
  }
}
