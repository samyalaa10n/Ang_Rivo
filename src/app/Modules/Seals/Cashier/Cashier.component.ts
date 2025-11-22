import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from "primeng/dialog";
import { Tools } from '../../../shared/service/Tools.service';
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";
import { InvoiceOrder } from '../../../shared/Types/InvoiceOrder';
import QRCode from 'qrcode';
import { InputNumber } from "primeng/inputnumber";
interface MenuItem {
  id: number;
  name: string;
  price: number;
  Tex: number;
  category: number;
  UNIT: string,
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Category {
  name: string;
  icon: string;
  id: number;
}
interface AccountType {
  name: string;
  id: number;
  isCash: boolean;
}
interface ResTable {
  itemsCared: Array<CartItem>
  id: number;
}

@Component({
  selector: 'app-restaurant-cashier',
  standalone: true,
  imports: [CommonModule, FormsModule, Dialog, ComboBoxComponent, InputNumber],
  templateUrl: './Cashier.component.html',
  styleUrls: ['./Cashier.component.css'],
})
export class RestaurantCashierComponent implements OnInit {

  categories: Category[] = [];
  menuItems: MenuItem[] = [];
  tables: Array<ResTable> = [];
  WareHouses: Array<any> = []
  cart: CartItem[] = [];
  SpecialDescound: Array<any> = []
  SpecialItemPrice: Array<any> = []
  SesonActive: number = 0;
  PayDirect: ResTable = { id: -2, itemsCared: [] }
  AccountTypes: AccountType[] = [];
  selectedTable: number = 0;
  Customers: Array<any> = []
  selectedCategory = 1;
  showPaymentModal = false;
  paymentMethod!: AccountType;
  paidAmount = 0;
  Invoice: InvoiceOrder = { ID: 0, ROW_NUMBER: -1, CUSTOMER_NAME: '', CUSTOMER: 0, DESCOUND_PERCENT: 0, DATE_TIME: new Date(), ITEMS: [], PRICE_AFTER_DESCOUND: 0, NOTS: '', PAYMENT_TYPE: 0, WAREHOUSE: 0, WAREHOUSE_NAME: '', PAYMENT: 0, TYPE: 0 }
  constructor(private _myTools: Tools) { }
  async ngOnInit(): Promise<void> {
    await this.getCategories();
    await this.getItems();
    await this.getPayAway();
    this.WareHouses = await this._myTools.Network.getAsync<any>("WareHouse")
    this.Customers = await this._myTools.Network.getAsync<any>("Customer")
    this.SpecialDescound = await this._myTools.Network.getAsync<any>("SpecialDescound")
    this.SpecialItemPrice = await this._myTools.Network.getAsync<any>("SpecialItemPrice")
    this.SesonActive = (await this._myTools.Network.getAsync<any>("Season/GetActiveSeson") as any)?.SESON ?? 0
  }
  ngAftrViewChecked(): void {
    this.Invoice.PRICE_AFTER_DESCOUND = this.TotalAfterDescound()
    this.Invoice.TOTAL_AFTER_PAYMENT = this.TotalAfterPayment()
  }


  selectTable(table: ResTable): void {
    this.selectedTable = table.id;
    this.cart = table.itemsCared || [];
  }

  selectCategory(category: number): void {
    this.selectedCategory = category;
  }

  getItemsByCategory(): MenuItem[] {
    let selectedMenuItems = this.menuItems.filter(item => item.category === this.selectedCategory);
    selectedMenuItems.forEach(item => {
      let spcialPrice = this.SpecialItemPrice.find(x => x.ID_ITEM == item.id && x.ID_CUSTOMER == this.Invoice.CUSTOMER && x.SESON == this.SesonActive);
      if (spcialPrice != null) {
        item.price = spcialPrice.PRICE;
      }
    })
    return selectedMenuItems
  }

  addToCart(item: MenuItem): void {
    const existing = this.cart.find(c => c.id === item.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ ...item, quantity: 1 });
    }
  }

  removeFromCart(itemId: number): void {
    this.cart = this.cart.filter(c => c.id !== itemId);
  }

  updateQuantity(itemId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
    } else {
      const item = this.cart.find(c => c.id === itemId);
      if (item) {
        item.quantity = quantity;
      }
    }
  }
  async getDiscountPercentForCustomer() {
    var desc = this.SpecialDescound.find(x => x.ID_CUSTOMER == this.Invoice.CUSTOMER && x.SESON == this.SesonActive)
    if (this.Invoice.ROW_NUMBER < 0) {
      this.Invoice.DESCOUND_PERCENT = desc?.DESCOUND ?? 0;
    }
  }
  get totalPrice(): number {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }


  get finalTotal(): number {

    return this.totalPrice;
  }

  get totalItems(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  get changeAmount(): number {
    return this.paidAmount - this.TotalAfterDescound();
  }

  clearCart(): void {
    this.cart.splice(0, this.cart.length);
  }

  openPaymentModal(): void {
    if (this.cart.length > 0 && this.selectedTable) {
      this.showPaymentModal = true;
      this.Invoice.DESCOUND_PERCENT = 0;
      this.paidAmount = this.finalTotal
    }
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.paidAmount = this.finalTotal
  }
  Total(): number {
    return this.cart?.map(x => x.price * x.quantity)?.reduce((a, b) => a + b, 0);
  }
  TotalAfterDescound(): number {

    return this.Total() - (this.Total() * (this.Invoice.DESCOUND_PERCENT / 100));
  }
  DescoundValue(): number {
    return (this.Total() * (this.Invoice.DESCOUND_PERCENT / 100));
  }
  TotalAfterPayment(): number {
    return this.TotalAfterDescound() - this.Invoice.PAYMENT;
  }
  EditPaidAmount() {
    this.paidAmount = this.TotalAfterDescound()
  }
  async completePayment(): Promise<void> {
    this.Invoice.ID = 0;
    this.Invoice.PAYMENT_TYPE = this.paymentMethod.id;
    if (this.selectedTable == -2) {
      this.Invoice.NOTS = "بيع من الفرع مباشر";
    }
    else {
      this.Invoice.NOTS = "مسجل من الكاشير طاولة رقم " + this.selectedTable + " بتاريخ " + new Date().toLocaleDateString();
    }
    this.Invoice.ITEMS = this.cart.map(x => { return { COUNT: x.quantity, ITEM_ID: x.id, CATEGORY: "", PRICE: x.price, ROW_NUMBER: -1, UNIT: x.UNIT, TYPE: "", NAME: x.name, TOTAL_COUNT: x.price * x.quantity, MAIN_PRICE: x.price, COUNT_INVOICE: 0, COUNT_REQUEST: 0, COUNT_STOCK: 0, ID: -1 } })
    this.Invoice.PAYMENT = this.paidAmount;
    this.Invoice.TOTAL = this.paidAmount;
    this.Invoice.ROW_NUMBER = -1;
    this.Invoice.TYPE = 1;
    this.Invoice.PRICE_AFTER_DESCOUND = this.TotalAfterDescound()
    this.Invoice.TOTAL_AFTER_PAYMENT = this.TotalAfterPayment()
    this._myTools.Network.putAsync("Invoices/EditMore", [this.Invoice]).then(async (res: any) => {
      if (res?.ID > 0) {
        this.Invoice.ID = res.ID;
        let DecreptId: string = await this._myTools.Network.getAsync<string>("Invoices/EncryptText?text=" + res?.ID) as string;
        let CODED = encodeURIComponent(DecreptId)
        let Http = window.location.href.split(":")[0]
        let Link = `${Http}://${window.location.host}/#/Show_QR?TEXT=${CODED}&TYPE=1`
        var image = await QRCode.toDataURL(Link);
        this.Invoice.QRImage = image;
        this._myTools.waitExecuteFunction(500, async () => {
          this.print(true);
        })
        this.clearCart();
        this.closePaymentModal();
      }
    })

  }
  print(showPrice: boolean = true) {
    let Inv = this._myTools.cloneObject(this.Invoice) as InvoiceOrder;
    Inv.CUSTOMER_NAME = "المطعم";
    Inv.PAYMENT_NAME = this.AccountTypes.find(x => x.id == Inv.PAYMENT_TYPE)?.name;
    Inv.ITEMS = Inv.ITEMS.filter(x => x.COUNT > 0);
    this._myTools.printService.printInvoice(Inv, false, showPrice)
  }
  public async getTabels(e: any) {
    this.tables = [];
    for (let index = 1; index <= e.TABLE_COUNT; index++) {
      this.tables.push({ id: index, itemsCared: [] });
    }
  }

  cashData() {
    // Get all enumerable properties of the component
    const componentData: any = {};

    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        const value = this[key];

        // Skip functions and Angular internal properties
        if (typeof value !== 'function' && !key.startsWith('_')) {
          try {
            // Test if the property is serializable
            JSON.stringify(value);
            componentData[key] = value;
          } catch (e) {
            // Skip properties that can't be serialized
            console.warn(`Cannot serialize property: ${key}`);
          }
        }
      }
    }

    localStorage.setItem("cashier_seal_data", JSON.stringify(componentData));
  }
  loadCashData() {
    const savedData = localStorage.getItem("cashier_seal_data");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        // Restore all properties
        Object.keys(parsedData).forEach(key => {
          (this as any)[key] = parsedData[key];
        });
      } catch (e) {
        console.error('Error loading cached data:', e);
      }
    }
  }
  // API Calls
  public async getCategories(): Promise<Category[]> {
    const response = await this._myTools.Network.getAsync("Category") as Array<any>;
    this.categories = response.map(item => { return { id: item.ID, name: item.NAME, icon: "" } });;
    return this.categories;
  }
  public async getItems(): Promise<MenuItem[]> {
    const response = await this._myTools.Network.getAsync("Items") as Array<any>;
    this.menuItems = response.map(item => { return { id: item.ID, name: item.NAME, price: item.PRICE_SEAL, Tex: item.TEX, category: item.CATEGORY, UNIT: item.UNIT } });
    return this.menuItems;
  }
  public async getPayAway(): Promise<AccountType[]> {
    var response = await this._myTools.Network.getAsync("AccountType") as Array<any>;
    response = response.filter(X => X.IS_ADDED == true || X.IS_ADDED_IN_BANK == true || X.IS_AGAL_ADD == true)
    this.AccountTypes = response.map(item => { return { id: item.ID, name: item.NAME, isCash: item.IS_ADDED } });
    return this.AccountTypes;
  }
}