import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { NgIf } from '@angular/common';
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools.service';
import { FormsModule } from '@angular/forms';
import { DataGridComponent } from '../../../shared/components/dataGrid/dataGrid.component';
import { RequestOrder } from '../../../shared/Types/Request';

@Component({
  selector: 'app-DeliveryControl',
  templateUrl: './DeliveryControl.component.html',
  styleUrls: ['./DeliveryControl.component.css'],
  imports: [FormsModule, DataGridComponent]
})
export class DeliveryControlComponent implements OnInit {

  ID: number = -1;
  Name: string = "";
  Email: string = "";
  DefultHour: string = "";
  Columns: Column[] = [];
  Placses: Array<any> = []
  Customers: Array<any> = []
  dataSorce: Array<any> = [];
  constructor(private _myTools: Tools) {
    
    this.Columns.push(new Column('ID', 'Reservation Number', "lapel"))
    this.Columns.push(new Column('PLACE_NAME', 'Branch', "lapel"))
    this.Columns.push(new Column('CUSTOMER_NAME', 'Company Name', "lapel"))
    this.Columns.push(new Column('CUSTOMER_BUY_NAME', 'Customer Name', "lapel"))
    this.Columns.push(new Column('PHONE', 'Phone Number', "lapel"))
    this.Columns.push(new Column('SELLER', 'Sales Representative', "lapel"))
    this.Columns.push(new Column('ItemsCount', 'Count Items', "lapel", "date"))
    this.Columns.push(new Column('SEND_DATE', 'Sending Date', "lapel", "date"))
    this.Columns[this.Columns.length - 1].Style_Show = (value) => {
      return this._myTools.DateTime.EditFormateData(value);
    }
    this.Columns.push(new Column('RESAVE_DATE', 'Recive Date', "lapel", "date"))
    this.Columns[this.Columns.length - 1].Style_Show = (value) => {
      return this._myTools.DateTime.EditFormateData(value);
    }
    this.Columns.push(new Column('DELIVERY_DATE', 'Delivery Date', "date-Time", "date", 200))
    this.Columns.push(new Column('DELIVERYNOTS', 'Delivery Date', "textarea", "date", 300))
  }

  async ngOnInit() {
    await this.StartPoint();
  }
  async StartPoint() {
    this.Placses = await this._myTools.Network.getAsync<any>("Place");
    this.Customers = await this._myTools.Network.getAsync<any>("Customer");
    var Mdata = await this._myTools.Network.getAsync("Delivery")
    if (Array.isArray(Mdata)) {
      if (Mdata.length > 0) {
        let Fobject = Mdata[0];
        this.ID = Fobject.ID;
        this.Name = Fobject.NAME;
        this.Email = Fobject.EMAIL;
        this.DefultHour = Fobject.DEFULTHOURTODELIVER;
      }
      else {
        this.ID = -1;
      }
    }

    this.dataSorce = await this.getOrders();
  }
  async saveStaticData() {
    if (this.ID > 0) {
      let Res = await this._myTools.Network.putAsync("Delivery/EditMore", [{
        ID: this.ID,
        ROW_NUMBER: 1,
        NAME: this.Name,
        EMAIL: this.Email,
        DEFULTHOURTODELIVER: this.DefultHour
      }])
      if (Array.isArray(Res) && Res.length > 0) {
        this._myTools.Toaster.showSuccess("Update Successful")
      }
    }
    else {
      let Res = await this._myTools.Network.postAsync("Delivery/AddMore", [{
        ID: this.ID,
        ROW_NUMBER: -1,
        NAME: this.Name,
        EMAIL: this.Email,
        DEFULTHOURTODELIVER: this.DefultHour
      }])
      if (Array.isArray(Res) && Res.length > 0) {
        this._myTools.Toaster.showSuccess("Update Successful")
      }
    }

    await this.StartPoint();
  }
  async ConfigGrid(grid: DataGridComponent) {

    grid.AllowAdd = false;
    grid.AllowDeleteSelected = false;
    grid.AllowDelete = false;
    grid.canSelectRow = false;

    grid.onUpdate = async () => {
      this.dataSorce = await this.getOrders();
    }
    grid.onEditItem = async (req:RequestOrder) => {
      req.ROW_NUMBER = 1;
      req.DELIVERYEDIT=true;
      this._myTools.Network.putAsync("Requstes/EditMore", [req], "").then(async (res: any) => {
        if (res?.ID > 0) {
          this._myTools.Toaster.showSuccess("Update Successful")
        }
      })
    }
  }
  async getOrders() {
    var data: Array<RequestOrder> = await this._myTools.Network.getAsync<RequestOrder>("Requstes/GetForDeliry") as any
    if (Array.isArray(data)) {
      data.forEach(order => {
        (order as any).ItemsCount = order.ITEMS.length;
        this.RenderItem(order)
      })
      return data;
    }
    return [];
  }
  RenderItem(item: RequestOrder) {
    item.SEND_DATE = this._myTools.DateTime.getDataFromJson(item.SEND_DATE as any)
    item.RESAVE_DATE = this._myTools.DateTime.getDataFromJson(item.RESAVE_DATE as any)
    item.CUSTOMER_NAME = this.Customers.find(Z => Z.ID == item.CUSTOMER)?.NAME ?? '';
    item.PLACE_NAME = this.Placses.find(Z => Z.ID == item.PLACE)?.NAME ?? '';
  }
}
