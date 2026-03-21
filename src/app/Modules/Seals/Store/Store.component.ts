import { animate, style, transition, trigger } from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { Tools } from "../../../shared/service/Tools.service";
import { NgFor, NgIf } from "@angular/common";

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  standalone:true,
  
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ],
  imports:[NgIf,NgFor]
})
export class StoreComponent implements OnInit {

  departments: any[] = [];
  categories: any[] = [];
  items: any[] = [];

  selectedDepartment: any;
  selectedCategory: any;

  cart: any[] = [];

  view: 'home' | 'cart' | 'checkout' | 'booking' = 'home';

  constructor(private myTols:Tools ) {}

  ngOnInit() {
    this.loadAll();
  }

  async loadAll() {
    const dep = await this.myTols.Network.getAsync("Store/GetDeparts") as any;
    const cat = await this.myTols.Network.getAsync("Store/GetCatigories") as any;
    const items = await this.myTols.Network.getAsync("Store/GetItems") as any;

    this.departments = dep;
    this.categories = cat;
    this.items = items;
  }

  selectDepartment(dep: any) {
    this.selectedDepartment = dep;
    this.selectedCategory = null;
  }

  selectCategory(cat: any) {
    this.selectedCategory = cat;
  }

  get filteredCategories() {
    return this.categories.filter(c => c.DEPART_ID === this.selectedDepartment?.DEPART_ID);
  }

  get filteredItems() {
    return this.items.filter(i => i.CATEGORY_ID === this.selectedCategory?.CATEGORY_ID);
  }

  addToCart(item: any) {
    const exist = this.cart.find(x => x.ITEM_ID === item.ITEM_ID);
    if (exist) {
      exist.qty++;
    } else {
      this.cart.push({ ...item, qty: 1 });
    }
  }

  get total() {
    return this.cart.reduce((sum, i) => sum + i.ITEM_PRICE * i.qty, 0);
  }

  remove(item: any) {
    this.cart = this.cart.filter(x => x !== item);
  }

  go(view: any) {
    this.view = view;
  }
}