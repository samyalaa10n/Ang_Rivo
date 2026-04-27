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
  selector: 'app-Raspy',
  templateUrl: './Raspy.component.html',
  styleUrls: ['./Raspy.component.css'],
  imports: [GetAddEditDeleteComponent, NgIf, Button, RouterLink, RouterLinkActive, CustomColumnDirective]
})
export class RaspyComponent implements OnInit {
  Units: Array<any> = [];
  Companies: Array<any> = [];
  Departs: Array<any> = [];
  Columns: Array<Column> = [];
  SelectedItemId: number = 0
  ItemInfo: any = null
  constructor(private _tools: Tools, private _router: Router, private _ActiveRouter: ActivatedRoute) { }

  async ngOnInit() {
    this.Units = await this._tools.Network.getAsync("Units") as Array<any>;
    this.Departs = await this._tools.Network.getAsync("Depart") as Array<any>;
    this.Companies = await this._tools.Network.getAsync("Company") as Array<any>;

    this._ActiveRouter.queryParams.subscribe({
      next: async ({ ID }) => {
        console.log(ID)
        if (+ID > 0) {
          this.SelectedItemId = ID
          var dt = await this._tools.Network.getAsync("Items/GetById?id=" + ID)
          if (Array.isArray(dt)) {
            this.ItemInfo = dt[0];
          }
        }
      }
    })

    this.Columns.push(new Column('ID', "Recipe Number", "lapel"))
    this.Columns.push(new Column('RESAPY_NAME', "Chef Name", "text"))
    this.Columns.push(new Column('RESAPY_DATE', "Registration Date", "date-Time", "date", 250))
    this.Columns.push(new Column('COUNT_OUT_PUT', "Final Output", "numberWithFraction"))

    this.Columns.push(new Column('UNIT_OUT_PUT', "Output Unit", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "Select Unit"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = this.Units

    this.Columns.push(new Column('IS_WORK', "Ready to Work", "yes-no"))

    this.Columns.push(new Column('DEPART', "Department", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "Select Department"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = this.Departs

    this.Columns.push(new Column('COMPANY', "Company", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "Select Company"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = this.Companies
  }

  async update() {
    this.Units = await this._tools.Network.getAsync("Units") as Array<any>;
    this.Departs = await this._tools.Network.getAsync("Depart") as Array<any>;
    this.Companies = await this._tools.Network.getAsync("Company") as Array<any>;

    this.Columns[4].columnComboBoxDataSource = this.Units;
    this.Columns[6].columnComboBoxDataSource = this.Departs;
    this.Columns[7].columnComboBoxDataSource = this.Companies;
  }

  onConfigGrid(config: DataGridComponent) {
    config.onRenderItemSource = (item) => {
      item.MAIN_ITEM_ID = this.SelectedItemId;
    }
  }

  GetRaspyForItems(): string {
    return `Resapy/GetRaspyForItems?id=${this.SelectedItemId}`;
  }

  openItemRaspy(item: any) {
    this._router.navigate(['Main', 'ItemsInRaspy'], {
      queryParams: {
        ItemId: this.SelectedItemId,
        RaspyId: item.ID
      }
    })
  }
}