import { Component, EventEmitter, Input, OnInit, Output, ViewChild, output } from '@angular/core';
import { DataGridComponent } from "../../components/dataGrid/dataGrid.component";
import { MultiselectComponent } from "../../components/multiselect/multiselect.component";
import { AutoComplete } from "primeng/autocomplete";
import { InputLabelComponent } from "../TextLabel/InputLabel.component";
import { InputNumber } from "primeng/inputnumber";
import { Button } from "primeng/button";
import { Column } from '../../components/dataGrid/Column';
import { Tools } from '../../service/Tools.service';
import { FormsModule } from '@angular/forms';
import { RealItem } from '../../Types/RealItem';
import { Item } from '../../Types/Item';
import { NgIf } from '@angular/common';

type SelectItem = { ID: number, NAME: string }

@Component({
  selector: 'app-InputFastItems',
  templateUrl: './InputFastItems.component.html',
  styleUrls: ['./InputFastItems.component.css'],
  imports: [NgIf, DataGridComponent, MultiselectComponent, AutoComplete, InputLabelComponent, InputNumber, Button, FormsModule]
})
export class InputFastItemsComponent implements OnInit {

  @ViewChild('StepInput1') StepInput1!: AutoComplete
  @ViewChild('StepInput2') StepInput2!: InputNumber
  @ViewChild('StepInput3') StepInput3!: InputNumber
  @ViewChild('StepInput4') StepInput4!: Button
  @Output() OnGridLoaded: EventEmitter<any> = new EventEmitter<any>();
  Category: Array<SelectItem> = [];
  CategorySelected: Array<SelectItem> = [];
  suggestionsData: Array<SelectItem> = [];
  filteredData: Array<SelectItem> = [];
  SelectedItem: RealItem = { NAME: "", ID: 0, COUNT: 0, ITEM_ID: 0, MAIN_PRICE: 0, PRICE: 0, UNIT: "", TYPE: "", TOTAL_COUNT: 0, ROW_NUMBER: -1, CATEGORY: '' };
  ITEMS: Array<Item> = [];
  oldData: Array<RealItem> = [];
  ItemsRecorded: Array<RealItem> = [];
  @Input() ITEMS_INPUT: Array<RealItem> = [];
  @Input() showPrice: boolean = true;
  @Input() Header: string = 'أصناف الطلبية';
  constructor(private _tools: Tools) { }
  async ngOnInit() {
    await this.GetOldData();
    this.reSelect();
  }
  async GetOldData() {
    this.Category = await this._tools.Network.getAsync("Category") as Array<any>;
    this.ITEMS = await this._tools.Network.getAsync("Items") as Array<any>;
    if (this.ITEMS_INPUT.length > 0) {
      let ItemsSelect = this.ITEMS.filter(item => this.ITEMS_INPUT.map(real_item => real_item.ITEM_ID).includes(item.ID))
      this.CategorySelected = this.Category.filter(cat => ItemsSelect.map(z => z.CATEGORY).includes(cat.ID));
      console.log(this.CategorySelected)
      this.SelectCategory();
    }
  }
  ngOnChanges() {
    if (this.ITEMS_INPUT.filter(x => x.ID > 0).length > 0) {
      this.ItemsRecorded = this._tools.cloneObject(this.ITEMS_INPUT.filter(x => x.ID > 0));
    }
  }
  async UpdateOnSave() {
    this.ItemsRecorded = this._tools.cloneObject(this.ITEMS_INPUT);
    this.Category = await this._tools.Network.getAsync("Category") as Array<any>;
    this.ITEMS = await this._tools.Network.getAsync("Items") as Array<any>;
    this.reSelect()
  }
  onGridLoaded(grid: DataGridComponent) {
    grid.AllowUpdate = true;
    grid.onUpdate = async () => {
      grid.dataSource = this.ITEMS_INPUT;
    }
    this.OnGridLoaded.emit(grid);
  }
  reSelect() {
    this.ITEMS_INPUT.forEach(item => { this.oldData.push(this._tools.cloneObject(item)) });
    this.ITEMS_INPUT = this.ITEMS.filter(z => this.CategorySelected.map(X => X.ID).includes(z.CATEGORY)).map(m_Item => { return { ID: this.ITEMS_INPUT.find(x => x.ITEM_ID == m_Item.ID)?.ID ?? -1, ITEM_ID: m_Item.ID, NAME: m_Item.NAME, UNIT: m_Item.UNIT, TYPE: m_Item.TYPE, MAIN_PRICE: m_Item.PRICE_SEAL, PRICE: this.getLastElemnt(m_Item.ID)?.PRICE ?? m_Item.PRICE_SEAL, COUNT: this.getLastElemnt(m_Item.ID)?.COUNT ?? 0, TOTAL_COUNT: 0, ROW_NUMBER: this.ITEMS_INPUT.find(x => x.ITEM_ID == m_Item.ID) != null ? 1 : -1, CATEGORY: this.Category.find(z => z.ID == m_Item.CATEGORY)?.NAME ?? '' } });
    this.suggestionsData = this.ITEMS_INPUT.map(x => { return { NAME: ` ${x.ITEM_ID} - ${x.NAME}`, ID: x.ITEM_ID } });
  }
  getLastElemnt(ITEM_ID: number): RealItem | null {
    return this.oldData.filter(x => x.ITEM_ID == ITEM_ID)[this.oldData.filter(x => x.ITEM_ID == ITEM_ID).length - 1]
  }
  SelectCategory() {
    this.reSelect()
  }
  RenderItemSource(e: { item: RealItem }) {
    e.item.TOTAL_COUNT = e.item.COUNT * e.item.PRICE;
  }
  GridAction(e: { itemEdit: RealItem }) {
    e.itemEdit.TOTAL_COUNT = e.itemEdit.COUNT * e.itemEdit.PRICE;
  }
  Enter(e: KeyboardEvent, next: number) {
    if (e.key == "Enter") {
      this.next(next)
    }
  }
  async Selected(e: { value: RealItem }) {
    let selected = this.ITEMS_INPUT.find(x => x.ITEM_ID == e.value.ID);
    if (selected) {
      this.SelectedItem = this._tools.cloneObject(selected);
      this.next(2)
    }
  }
  filterEmploy(event: any) {
    let query = event.query;
    this.filteredData = this.suggestionsData.filter(x => x.NAME.includes(query))
  }
  SetItem() {
    let selected = this.ITEMS_INPUT.find(x => x.ITEM_ID == this.SelectedItem.ITEM_ID);
    if (selected) {
      selected.COUNT = this.SelectedItem.COUNT;
      selected.PRICE = this.SelectedItem.PRICE;
      this.GridAction({ itemEdit: selected });
      this._tools.Toaster.showInfo("تم التسجيل")
      this.next(1)
    }
  }
  next(number: number) {
    window.getSelection()?.removeAllRanges();
    var element: HTMLInputElement | HTMLButtonElement | null = null;
    if (number == 1) {
      element = (this.StepInput1.el?.nativeElement as HTMLElement)?.children[0]?.children[0] as HTMLInputElement;
    }
    else if (number == 2) {
      if (!this.showPrice) {
        this.next(3)
      }
      element = (this.StepInput2.el?.nativeElement as HTMLElement)?.children[0] as HTMLInputElement;
    }
    else if (number == 3) {

      element = (this.StepInput3.el?.nativeElement as HTMLElement)?.children[0] as HTMLInputElement;
    }
    else if (number == 4) {
      element = (this.StepInput4.el.nativeElement as HTMLElement)?.children[0] as HTMLButtonElement;

    }
    if (element) {
      this._tools.waitExecuteFunction(100, () => { element?.focus(); if (number == 1 || number == 2 || number == 3) { (element as any)?.select(); } if (number == 4) { element?.click() } });
    }
  }

  Claer() {
    if (this.ITEMS_INPUT.map(x => x.COUNT).reduce((a, b) => a + b, 0) > 0) {
      this.ITEMS_INPUT.forEach(item => { this.oldData.push(this._tools.cloneObject(item)) });
    }
    this.ITEMS_INPUT.forEach(item => { item.COUNT = 0; this.ITEMS.find(x => x.ID == item.ITEM_ID)?.PRICE_SEAL })
  }
  Back() {
    this.ITEMS_INPUT.forEach(item => { console.log(this.getLastElemnt(item.ITEM_ID)); item.COUNT = this.getLastElemnt(item.ITEM_ID)?.COUNT ?? 0; item.PRICE = this.getLastElemnt(item.ITEM_ID)?.PRICE ?? 0; });
  }
  GeneratRequestItems(): Array<RealItem> {
    let DataOutPut: Array<RealItem> = [];
    this.ITEMS_INPUT.forEach(item => {
      item.ROW_NUMBER = item.ID;
      if (item.COUNT == 0) {
        item.ROW_NUMBER = 0;
      }
      if (!this.CategorySelected.map(x => x.ID).includes(this.ITEMS.find(x => x.ID == item.ITEM_ID)?.CATEGORY ?? 0)) {
        item.ROW_NUMBER = 0;
      }
      DataOutPut.push(this._tools.cloneObject(item))
    });
    this.ItemsRecorded.forEach(item => {
      if (this.ITEMS_INPUT.find(x => x.ITEM_ID == item.ITEM_ID) == null) {
        item.ROW_NUMBER = 0;
        item.NAME = this.ITEMS.find(x => x.ID == item.ITEM_ID)?.NAME ?? ''
        DataOutPut.push(this._tools.cloneObject(item));
      }
    })


    let distincit: Array<RealItem> = [];
    DataOutPut.forEach(item => {
      if (distincit.find(x => x.ITEM_ID == item.ITEM_ID) == null) {
        distincit.push(item);
      }
    })
    DataOutPut = distincit;
    console.log(DataOutPut)
    return DataOutPut;
  }

}
