import { Component, OnInit } from '@angular/core';
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools.service';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { NgIf } from '@angular/common';
import { DataGridComponent } from '../../../shared/components/dataGrid/dataGrid.component';

@Component({
  selector: 'app-SpeciaPrice',
  templateUrl: './SpeciaPrice.component.html',
  styleUrls: ['./SpeciaPrice.component.css'],
  imports: [GetAddEditDeleteComponent, NgIf]
})
export class SpeciaPriceComponent implements OnInit {

  Customers: Array<any> = [];
  Seasons: Array<any> = [];
  Items: Array<any> = [];
  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }
  async ngOnInit() {
    this.Customers = await this._tools.Network.getAsync("Customer") as Array<any>;
    this.Seasons = await this._tools.Network.getAsync("Season") as Array<any>;
    this.Items = await this._tools.Network.getAsync("Items") as Array<any>;
    this.Columns.push(new Column('ID', "الكود", "lapel"))
    this.Columns.push(new Column('ID_CUSTOMER', "العميل", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر العميل"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = this.Customers;
    this.Columns.push(new Column('ID_ITEM', "الصنف", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر الصنف"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = this.Items;
    this.Columns.push(new Column('PRICE', "السعر الجديد", "numberWithFraction"))
    this.Columns.push(new Column('SESON', "الموسم", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر الموسم"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = this.Seasons;
  }
  GridConfig(grid: DataGridComponent) {
    grid.AllowCopyPest = true;
    grid.Copy = () => {
      this._tools.Toaster.showInfo("لا يمكن نسخ من هذه القائمة")
    }
    grid.Pest = async () => {
      var data = JSON.parse(await navigator.clipboard.readText()) as Array<any>;
      let result = await this._tools.DecisionMaker.Show("اختر العميل", this.Customers.map(x => x.NAME))
      if (result) {
        let Customer_Id = this.Customers.find(x => x.NAME == result).ID;
        if (Customer_Id) {
          let Season = await this._tools.DecisionMaker.Show("اختر الموسم", this.Seasons.map(x => x.NAME))
          if (Season) {
            let Season_Id = this.Seasons.find(x => x.NAME == Season).ID;
            if (Season_Id) {
              let ItemsSelected = this.Items.filter(x => data.map(c => c.NAME).includes(x.NAME))
              if (ItemsSelected) {
                let oldData=grid.dataSource;
                ItemsSelected.forEach(item=>{
                  let Insertrd={ID_ITEM:item.ID,PRICE:item.PRICE_SEAL,ID_CUSTOMER:Customer_Id,SESON:Season_Id,ID:-1,ROW_NUMBER:-1}
                  oldData.push(Insertrd)
                })
                grid.dataSource=oldData;
              }
            }
          }
        }
      }
    }
  }
}
