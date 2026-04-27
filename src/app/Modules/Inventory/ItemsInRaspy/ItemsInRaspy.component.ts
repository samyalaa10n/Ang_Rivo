import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { NgIf } from '@angular/common';
import { DataGridComponent } from '../../../shared/components/dataGrid/dataGrid.component';
import { Tools } from '../../../shared/service/Tools.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from "primeng/button";
import { CustomColumnDirective } from "../../../shared/components/dataGrid/CustomColumn.directive";
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";


@Component({
  selector: 'app-ItemsInRaspy',
  templateUrl: './ItemsInRaspy.component.html',
  styleUrls: ['./ItemsInRaspy.component.css'],
  imports: [GetAddEditDeleteComponent, NgIf, Button, RouterLinkActive, CustomColumnDirective, ComboBoxComponent]
})
export class ItemsInRaspyComponent implements OnInit {
  Units: Array<any> = [];
  Columns: Array<Column> = [];
  RaspyId: number = 0
  ItemId: number = 0
  grid!: DataGridComponent;
  Items: Array<any> = [];
  Recipy: any
  ItemComoBoxItemSource: Array<any> = [];
  constructor(private _tools: Tools, private _router: Router, private _ActiveRouter: ActivatedRoute) { }
  async ngOnInit() {

    this._ActiveRouter.queryParams.subscribe({
      next: async ({ RaspyId, ItemId }) => {
        if (+RaspyId > 0 && ItemId) {
          this.RaspyId = +RaspyId
          this.ItemId = +ItemId
        }
      }
    })
    let recpyList = await this._tools.Network.getAsync(`Resapy/GetById?id=${this.RaspyId}`) as Array<any>;
    this.Recipy = recpyList[0];
    this.Items = await this._tools.Network.getAsync("Items") as Array<any>;
    this.Units = await this._tools.Network.getAsync("Units") as Array<any>;
    
    this.getUnitsTree();
    this.Columns.push(new Column('ID', "Bundle Number", "lapel"))
    this.Columns.push(new Column('ITEM_ID', "Item / Raw Material", "comboBox", "comboBox", 350))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "Select Item"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = this.getItems()
    this.Columns[this.Columns.length - 1].columnComboBoxChange = (selected) => {
      this.ItemComoBoxItemSource = this.GetItemComoBoxItemSource({ITEM_ID:selected.ID})
    }

    this.Columns.push(new Column('UNIT', "Unit", "custom"))
    this.Columns[this.Columns.length - 1].Style_Show = (value, ITEM) => {
      let mItem = this.Items.find(x => x.ID == ITEM?.ITEM_ID);
      let unit = this.Units.find(x => x.ID == mItem?.UNIT_RESAPY)
      return this.GetSumUnits(unit)?.find(x => x.ID == ITEM.UNIT)?.NAME || ""
    }
    this.Columns.push(new Column('COUNT_IN', "Item Quantity", "numberWithFraction"))
    this.Columns.push(new Column('COUNT_OUT_PUT', "Quantity After Waste", "numberWithFraction"))
    this.Columns.push(new Column('PRICE_IN_RECIPY', "Price", "lapel"))
  }
  GetItemComoBoxItemSource(ITEM: any): any[] {
    let mItem = this.Items.find(x => x.ID == ITEM?.ITEM_ID);
    let unit = this.Units.find(x => x.ID == mItem?.UNIT_RESAPY)

    return this.GetSumUnits(unit)
  }
  getRecipyForSimeAnd()
  {
    
  }
  GetColumn() {
    if (this.grid?.Columns[2]) {
      return this.grid.Columns[2];
    }
    return new Column();
  }
  GetSumUnits(unit: any): Array<any> {
    if (unit == null) {
      return []
    }
    let data = this.Units.filter(x => x.CollectionNumber == unit.CollectionNumber).map(u => {
      if (u?.BASE_UNIT) {
        return { ...u, NAME: `${u.NAME} = ${u.COUNT} ${u?.BASE_UNIT?.NAME ?? ""}` }
      }
      return u
    })
    return data
  }

  async update() {
    this.Items = await this._tools.Network.getAsync("Items") as Array<any>;

    this.Columns[1].columnComboBoxDataSource = this.getItems();
    this.Units = await this._tools.Network.getAsync("Units") as Array<any>;
    this.Columns[2].columnComboBoxDataSource = this.Units;
    this.getUnitsTree();
  }
  onConfigGrid(config: DataGridComponent) {
    this.grid = config;
    config.onRenderItemSource = (item) => {
      item.RESAPY_ID = this.RaspyId;
      this.CalculateCostPrice(item)
    }
    config.onShowEditItem = (item) => {
      this.ItemComoBoxItemSource = this.GetItemComoBoxItemSource(item)
    }

  }
  CalculateCostPrice(item: any) {
    let mItem = this.Items.find(x => x.ID == item?.ITEM_ID);
    let unit = this.Units.find(x => x.ID == mItem?.UNIT_RESAPY)
    let SelectedUnitInRecipy = this.Units.find(x => x.ID == item?.UNIT)
    if (mItem && unit && SelectedUnitInRecipy) {
      item.PRICE_IN_RECIPY = (mItem.PRICE_GET / unit.GNUMBER) * (SelectedUnitInRecipy.GNUMBER * item.COUNT_IN) + " EGP";
    }
  }

  getUnitsTree(): any[] {
    let BaseUnit = this.Units.filter(x => x.FROM_UNIT == 0);
    if (BaseUnit != null) {
      let GenerateTree = (pArray: any[], Lavel: number, BASE_UNIT: any) => {
        pArray.forEach((l, index) => {
          if (BASE_UNIT != null) {
            l.GNUMBER = (l.COUNT * BASE_UNIT.GNUMBER)
            l.CollectionNumber = BASE_UNIT.CollectionNumber;
          }
          else {
            l.GNUMBER = l.COUNT
            l.CollectionNumber = index;
          }
          l.BASE_UNIT = BASE_UNIT;
          l.Level = Lavel;
          l.UnitUsers = this.Units.filter(x => x.FROM_UNIT == l.ID);

          GenerateTree(l.UnitUsers, Lavel + 1, l);
        })
      }
      GenerateTree(BaseUnit, 0, null);
      return BaseUnit
    }
    return []
  }

  GetItemsForRaspy(): string {
    return `ResapyItems/GetItemsForRaspy?id=${this.RaspyId}`;
  }
  getItems(): any[] {
    return this.Items.filter(X => X.ID != this.ItemId).map(item => { return { ID: item.ID, NAME: `${item.ID} - ${item.NAME} - ${item.TYPE} - ${item.PRICE_GET} EGP -${this.Units.find(x => x.ID == item.UNIT_RESAPY)?.NAME ?? ""}`, Unit: item.UNIT_RESAPY } })
  }
  Back() {
    this._router.navigate(['Main', 'Raspy'], { queryParams: { ID: this.ItemId } })
  }
  GetMainItemInfo() {
    return this.Items.find(x => x.ID == this.ItemId);
  }
  getRecipyUnit() {
    return this.Units.find(x => x.ID == this.Recipy.UNIT_OUT_PUT)?.NAME
  }

}