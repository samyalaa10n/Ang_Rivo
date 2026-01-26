import { Component, OnInit } from '@angular/core';
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools.service';
import { Dialog } from "primeng/dialog";
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";
import { Button } from "primeng/button";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-AtivateItemsControl',
  templateUrl: './AtivateItemsControl.component.html',
  styleUrls: ['./AtivateItemsControl.component.css'],
  imports: [DataGridComponent, Dialog, ComboBoxComponent, Button, FormsModule]
})
export class AtivateItemsControlComponent implements OnInit {
  selectedItem: ItemActivate = { ID: -1, NAME: "", CATEGORY: "", DEPART: "", ROW_NUMBER: 0, Resson: "", IS_ACTIVATED: false }
  Resson: string = "";
  Items: Array<any> = [];
  Departs: Array<any> = [];
  Categories: Array<any> = [];
  ItemsInsert: Array<ItemActivate> = [];
  columns: Array<Column> = [];
  ShowModel: boolean = false;
  grid!: DataGridComponent
  constructor(private _myTools: Tools) {
    this.columns.push(new Column("ID", "Item Id"))
    this.columns.push(new Column("NAME", "Name"))
    this.columns.push(new Column("CATEGORY", "Category"))
    this.columns.push(new Column("DEPART", "Depart"))
    this.columns.push(new Column("Resson", "Reason"))
  }

  async ngOnInit() {
    await this.start();
  }
  async start() {
    this.ItemsInsert = [];
    let Items = await this._myTools.Network.getAsync("Items") as Array<any>
    this.Departs = await this._myTools.Network.getAsync("Depart") as Array<any>
    this.Categories = await this._myTools.Network.getAsync("Category") as Array<any>
    this.ItemsInsert = Items.filter(x => x.IS_ACTIVATED == false).map(x => {
      let item: ItemActivate = { ID: x.ID, NAME: x.NAME, CATEGORY: "", DEPART: "", Resson: x.STOP_ACTIVATED_REASON, ROW_NUMBER: 1, IS_ACTIVATED: x.IS_ACTIVATED }
      let cat = this.Categories.find(z => z.ID == x.CATEGORY);
      item.CATEGORY = cat?.NAME
      item.DEPART = this.Departs.find(z => z.ID == cat.DEPART_ID)?.NAME
      return item
    });
    Items = Items.filter(X => X.IS_ACTIVATED == true)
    this.Items = Items.map(x => {
      let item: ItemActivate = { ID: x.ID, NAME: x.NAME, CATEGORY: "", DEPART: "", Resson: "", ROW_NUMBER: 1, IS_ACTIVATED: x.IS_ACTIVATED }
      let cat = this.Categories.find(z => z.ID == x.CATEGORY);
      item.CATEGORY = cat?.NAME
      item.DEPART = this.Departs.find(z => z.ID == cat.DEPART_ID)?.NAME
      item.NAME = `${x.NAME} - ${item.CATEGORY} - ${item.DEPART}`
      return item
    });
  }
  GridLoaded(grid: DataGridComponent) {
    this.grid = grid
    grid.GridMode="EfectInRows";
    grid.AllowAdd = true;
    grid.AllowDeleteSelected = false;
    grid.AllowUpdate = false;
    grid.AllowSave = false;
    grid.AllowCurdOperation = true;
    grid.AddNew = async (e) => {
      this.ShowModel = true;
    }
    grid.dataSource = this.ItemsInsert.filter(x => x.ROW_NUMBER != 0)
    grid.onDeleteItem = (itemEdit) => {
      let item = this.ItemsInsert.find(X => X.ID == itemEdit.ID);
      if (item) {
        item.ROW_NUMBER = 0;
      }
      grid.dataSource = this.ItemsInsert.filter(x => x.ROW_NUMBER != 0)
    }
  }
  Add() {
    let clonSelected: ItemActivate = this._myTools.cloneObject(this.selectedItem)
    clonSelected.ROW_NUMBER = -1;
    clonSelected.NAME = clonSelected.NAME.split("-")[0]
    if (this.ItemsInsert.find(X => X.ID == clonSelected.ID && X.ROW_NUMBER != 0) == null) {
      this.ItemsInsert.push(clonSelected)
      this.ShowModel = false
    }
    else {
      this._myTools.Toaster.showError("this Item Added Before")
    }
    this.grid.dataSource = this.ItemsInsert.filter(x => x.ROW_NUMBER != 0)

  }
  async Send() {
    await this._myTools.Loading.startLoading();
    if (this.ItemsInsert.filter(x => x.ROW_NUMBER < 0).length > 0) {
      let Req = {
        REASON: this.Resson,
        ITEMS: this.ItemsInsert.filter(x => x.ROW_NUMBER < 0).map(x => {
          return { ID: x.ID, ROW_NUMBER: x.ROW_NUMBER, RESSON: x.Resson }
        })
      }
      let StopedResponse = await this._myTools.Network._httpClient.post<any>(this._myTools.Network.baseUrlApi + "Items/StopActiveItems", Req).toPromise() as any
      if (StopedResponse) {
        if (StopedResponse.SUCCESS == true) {
          this._myTools.Toaster.showSuccess(StopedResponse.MESSAGE)
        }
        else {
          this._myTools.Toaster.showError(StopedResponse.MESSAGE)
        }
      }
    }


    if (this.ItemsInsert.filter(x => x.ROW_NUMBER == 0).length > 0) {
      let ReqAct = {
        REASON: this.Resson,
        ITEMS: this.ItemsInsert.filter(x => x.ROW_NUMBER == 0).map(x => {
          return { ID: x.ID, ROW_NUMBER: x.ROW_NUMBER, RESSON: x.Resson }
        })
      }
      let ActiveResponse = await this._myTools._httpClient.post<any>(this._myTools.Network.baseUrlApi + "Items/OpenActiveItems", ReqAct).toPromise() as any
      if (ActiveResponse) {
        if (ActiveResponse.SUCCESS == true) {
          this._myTools.Toaster.showSuccess(ActiveResponse.MESSAGE)
        }
        else {
          this._myTools.Toaster.showError(ActiveResponse.MESSAGE)
        }
      }
    }
    await this.start();
    await this._myTools.Loading.stopLoading();
  }
}

interface ItemActivate { ID: number, NAME: string, IS_ACTIVATED: boolean, CATEGORY: string, DEPART: string, ROW_NUMBER: number, Resson: string }