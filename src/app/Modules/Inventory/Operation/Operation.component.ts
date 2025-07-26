import { Component, OnInit, ViewChild } from '@angular/core';
import { Button } from "primeng/button";
import { DateTimeComponent } from '../../../shared/components/DateTime/DateTime.component';
import { ComboBoxComponent } from '../../../shared/components/comboBox/comboBox.component';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { InputFastItemsComponent } from '../../../shared/pages/InputFastItems/InputFastItems.component';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Column } from '../../../shared/components/dataGrid/Column';
import { RequestOrder } from '../../../shared/Types/Request';
import { DataGridComponent } from '../../../shared/components/dataGrid/dataGrid.component';
import { RealItem } from '../../../shared/Types/RealItem';
import { Tools } from '../../../shared/service/Tools.service';
import { PrintService } from '../../../shared/service/Print.service';
import { OperationOrder } from '../../../shared/Types/OperationOrder';

@Component({
  selector: 'app-Operation',
  templateUrl: './Operation.component.html',
  styleUrls: ['./Operation.component.css'],
  imports: [DateTimeComponent, ComboBoxComponent, Button, FormsModule, InputFastItemsComponent, NgIf, RouterLink]
})
export class OperationComponent implements OnInit {
  @ViewChild('InputFastItems') InputFastItems!: InputFastItemsComponent
  ColumnsInput: Array<Column> = []
  WareHouses: Array<any> = []
  DataRecordedStock: Array<{ ID: number, ITEM_NAME: string, ITEM_UNIT: string, COUNT_STOCK: number, TOTAL_PRICE: number, COUNT_REQUEST: number, TOTAL_PRICE_STOCK: number }> = [];
  Operation: OperationOrder = { ID: 0, ROW_NUMBER: -1, DATE_TIME: new Date(), ITEMS: [], NOTS: '', TYPE: 0, WAREHOUSE_1: 0, WAREHOUSE_2: 0 }
  constructor(private _tools: Tools, private _ActiveRouter: ActivatedRoute, private _printService: PrintService, private _router: Router) { }
  async ngOnInit() {
    this.WareHouses = await this._tools.Network.getAsync<any>("WareHouse")
    this.ColumnsInput.push(new Column('ID', "رقم العملية"))
    this.ColumnsInput.push(new Column('ITEM_ID', "رقم الصنف"))
    this.ColumnsInput.push(new Column('NAME', "اسم الصنف"))
    this.ColumnsInput.push(new Column('UNIT', "وحدة الصنف"))
    this.ColumnsInput.push(new Column('TYPE', "نوع الصنف"))
    this.ColumnsInput.push(new Column('CATEGORY', "التصنيف"))
    this.ColumnsInput.push(new Column('COUNT', "الكمية", "numberWithFraction"))
    this.ColumnsInput.push(new Column('COUNT_STOCK', "الرصيد"))
    this.ColumnsInput.push(new Column('', "الرصيد الجديد في المخزن"))
    this.ColumnsInput[this.ColumnsInput.length - 1].DynamicShow = (item: RealItem) => {
      if (this.Operation.TYPE == 1) {
        return ((item?.COUNT_STOCK ?? 0) + item.COUNT).toString();
      }
      else {
        return ((item?.COUNT_STOCK ?? 0) - item.COUNT).toString();
      }
    }
  }
  ngAfterViewInit() {
    this._tools.waitExecuteFunction(100, () => {
      this._ActiveRouter.queryParams.subscribe({
        next: async ({ ID }) => {
          if (+ID > 0) {
            var response = await this._tools.Network.getAsync<OperationOrder>("Operations/GetById?id=" + ID) as OperationOrder;
            if (response?.ID > 0) {
              this.Operation = response;
              await this.GetDataRecordedStock();
              this.InputFastItems.ITEMS_INPUT = this.Operation.ITEMS;
              this.editStockInEditMode();
              await this.InputFastItems.GetOldData();
              this.ColumnsInput.forEach(col=>col.columnType="lapel")
              this.ColumnsInput[this.ColumnsInput.length-2].InShow=false;
              this.ColumnsInput[this.ColumnsInput.length-1].InShow=false;
            }
            else {
              this._tools.Toaster.showError("تم حذف العملية")
              this._router.navigate(['Main', 'OperationList']);
            }
          }
        }
      })
    })
  };
  async GetDataRecordedStock() {
    if (this.Operation.WAREHOUSE_1 != 0) {
      var data = await this.GetDataRecord();
      this.DataRecordedStock = data;
      this.InputFastItems.ITEMS_INPUT.forEach(item => {
        this.calculate(item)
      })
    }
    this.editStockInEditMode();
  }
  editStockInEditMode() {
    //edit Stock In EditMode
    if (this.Operation.ID > 0) {
      this.InputFastItems.ITEMS_INPUT.forEach(item => {
        let older = this.DataRecordedStock.find(x => x.ID == item.ITEM_ID)
        if (older) {
          if (this.Operation.TYPE == 1) {
            older.COUNT_STOCK = older.COUNT_STOCK + item.COUNT;
          }
          else {
            older.COUNT_STOCK = older.COUNT_STOCK - item.COUNT;
          }
        }
      })
    }
  }
  calculate(item: RealItem) {
    item.TOTAL_COUNT = item.PRICE * item.COUNT;
    item.COUNT_STOCK = this.DataRecordedStock.find(x => x.ID == item.ITEM_ID)?.COUNT_STOCK ?? 0;
  }
  GridLoaded(dataGrid: DataGridComponent) {
    dataGrid.Columns = this.ColumnsInput;
    dataGrid.onRenderItemSource = (item: RealItem) => {
      this.calculate(item)
    }
    dataGrid.GridActionFunc = (action) => {
      action.itemEdit.TOTAL_COUNT = action.itemEdit.COUNT * action.itemEdit.PRICE;
    }

  }
  Total_Count(): number {
    return this.Operation.ITEMS.map(x => x.COUNT).reduce((a, b) => a + b, 0);
  }
  Save() {
    this.Operation.ITEMS = this.InputFastItems.GeneratRequestItems();
    this._tools.Network.putAsync("Operations/EditMore", [this.Operation]).then(async (res: any) => {
      if (res?.ID > 0) {
        this.Operation = res;
        this.InputFastItems.oldData = [];
        await this.InputFastItems.UpdateOnSave();
        this._tools.waitExecuteFunction(500, () => {
          this.print();
          this._tools.waitExecuteFunction(500, () => {
            this._router.navigate(['Main', 'Operation'], { queryParams: { ID: `${this.Operation.ID}` } });
          })
        })
      }
    })
  }
  print() {
    let Oper = this._tools.cloneObject(this.Operation) as OperationOrder;
    Oper.WAREHOUSE_ADDED_NAME = this.WareHouses.find(x => x.ID == Oper.WAREHOUSE_1)?.NAME;
    Oper.WAREHOUSE_GET_NAME = this.WareHouses.find(x => x.ID == Oper.WAREHOUSE_2)?.NAME;
    Oper.ITEMS = this.InputFastItems.ITEMS_INPUT;
    Oper.ITEMS = Oper.ITEMS.filter(x => x.TOTAL_COUNT > 0);
    this._printService.printOperation(Oper)
  }
  AddNew() {
    this._router.navigate(['Main', 'Operation'], { queryParams: { ID: `0` } })
    this._tools.waitExecuteFunction(100, () => {
      window.location.reload();
    });
  }
  async delete() {
    this._tools.Confermation.show().then(async result => {
      if (result) {
        await this._tools.Network.deleteAsync("Operations?id=" + this.Operation.ID)
        this._router.navigate(['Main', 'Operation'], { queryParams: { ID: this.Operation.ID } })
        this._tools.waitExecuteFunction(100, () => {
          window.location.reload();
        });
      }
    })
  }
  async AddInhert() {
    this.Operation.ID = 0;
    this.Operation.ROW_NUMBER = -1;
    this.Operation.ITEMS.forEach(item => {
      item.ID = -1;
      item.ROW_NUMBER = -1;
    })
    this.InputFastItems.ITEMS_INPUT = this.Operation.ITEMS;
    this.InputFastItems.ItemsRecorded = [];
    this.InputFastItems.reSelect();
    await this.GetDataRecordedStock();
    this.editStockInEditMode();
    this.ColumnsInput[6].columnType="numberWithFraction"
    this.ColumnsInput.forEach(col=>col.InShow=true);
  }
  async GetDataRecord(): Promise<Array<{ ID: number, ITEM_NAME: string, ITEM_UNIT: string, COUNT_STOCK: number, TOTAL_PRICE: number, COUNT_REQUEST: number, TOTAL_PRICE_STOCK: number }>> {
    let data = await this._tools.Network.getAsync<any>(`Operations/GetItemsStock?WareHouse=${this.Operation.WAREHOUSE_1}`);
    return data;
  }
}
