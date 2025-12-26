import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { NgIf } from '@angular/common';
import { DataGridComponent } from '../../../shared/components/dataGrid/dataGrid.component';
import { Tools } from '../../../shared/service/Tools.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from "primeng/button";
import { CustomColumnDirective } from "../../../shared/components/dataGrid/CustomColumn.directive";


@Component({
  selector: 'app-ItemsInRaspy',
  templateUrl: './ItemsInRaspy.component.html',
  styleUrls: ['./ItemsInRaspy.component.css'],
  imports: [GetAddEditDeleteComponent, NgIf, Button, RouterLinkActive]
})
export class ItemsInRaspyComponent implements OnInit {
  Units: Array<any> = [];
  Columns: Array<Column> = [];
  RaspyId: number = 0
  ItemId: number = 0
  constructor(private _tools: Tools, private _router: Router, private _ActiveRouter: ActivatedRoute) { }
  async ngOnInit() {
    this.Units = await this._tools.Network.getAsync("Units") as Array<any>;
    this._ActiveRouter.queryParams.subscribe({
      next: async ({ RaspyId, ItemId }) => {
        if (+RaspyId > 0 && ItemId) {
          this.RaspyId = +RaspyId
          this.ItemId = +ItemId
        }
      }
    })
    this.Columns.push(new Column('ID', "رقم الربطة", "lapel"))
    this.Columns.push(new Column('ITEM_ID', "الصنف / الخامة", "comboBox", "comboBox", 350))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر الصنف"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = await this.getItems()

    this.Columns.push(new Column('COUNT_IN', "كمية الصنف", "numberWithFraction"))
    this.Columns.push(new Column('COUNT_OUT_PUT', "الكمية بعد الهالك", "numberWithFraction"))
    this.Columns.push(new Column('UNIT', "الوحدة", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر وحدةالتكوين"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = this.Units
    // this.Columns[this.Columns.length - 1].columnComboBoxRefreshSource.func = (item: any, source: Array<any>) => {
    //   if (item.ITEM_ID == null || item.ITEM_ID == 0) {
    //     source = [];
    //   }
    //   else {
    //     let ItemInfo = this.Columns[1].columnComboBoxDataSource.find(z => z.ID == item.ITEM_ID)
    //     let unitInfo = this.Units.find(x => x.ID == ItemInfo?.Unit)
    //     source = this.getRelatedUnits(source, unitInfo)
    //   }
    //   return source;
    // }
  }
  getRelatedUnits(units: Array<any>, targetUnit: any) {
    let result: Array<any> = [];
    let searchUnits = (Unit: any) => {
      if (result.find(x => x.ID == Unit.ID) == null) {
        result.push(Unit);
      }
      units.filter(x => x.FROM_UNIT == Unit.ID).forEach(UN => {
        searchUnits(UN)
      })
      if (units.filter(x => x.FROM_UNIT == Unit.ID).length == 0) {
        units.filter(x => x.ID == Unit.FROM_UNIT).forEach(UN => {
          searchUnits(UN)
        })
      }
    }
    return result
  }
  async update() {
    this.Columns[1].columnComboBoxDataSource = await this.getItems();
    this.Units = await this._tools.Network.getAsync("Units") as Array<any>;
    this.Columns[4].columnComboBoxDataSource = this.Units;
  }
  onConfigGrid(config: DataGridComponent) {
    config.onRenderItemSource = (item) => {
      item.RESAPY_ID = this.RaspyId;
    }
  }
  GetItemsForRaspy(): string {
    return `ResapyItems/GetItemsForRaspy?id=${this.RaspyId}`;
  }
  async getItems(): Promise<any[]> {
    let Items = await this._tools.Network.getAsync("Items") as Array<any>;
    return Items.map(item => { return { ID: item.ID, NAME: `${item.ID} - ${item.NAME} - ${item.TYPE} - ${item.PRICE_SEAL} EGP`, Unit: item.UNIT_RESAPY } })
  }
  Back() {
    this._router.navigate(['Main', 'Raspy'], { queryParams: { ID: this.ItemId } })
  }
}
