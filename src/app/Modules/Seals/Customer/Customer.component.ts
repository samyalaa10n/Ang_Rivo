import { Component, OnInit } from '@angular/core';
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools.service';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-Customer',
  templateUrl: './Customer.component.html',
  styleUrls: ['./Customer.component.css'],
  imports: [GetAddEditDeleteComponent, NgIf]
})
export class CustomerComponent implements OnInit {

  Columns: Array<Column> = [];
  constructor(private _tools: Tools, private _ActiveRouter: ActivatedRoute) {

  }

  async ngOnInit() {
    this._ActiveRouter.queryParams.subscribe({
      next: async ({ TYPE }) => {
        if (TYPE == 'sherd') {
          this._tools.transfareSherdData.sherdMood=true;
        }
      }
    })
    let Accounts = await this._tools.Network.getAsync("Accounts") as Array<any>;
    this.Columns.push(new Column("ID", "Code"))
    this.Columns.push(new Column("NAME", "Name", "text"))
    this.Columns.push(new Column("ACCOUNT_ID", "Company Account", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "Select Account"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = Accounts;
    this.Columns.push(new Column("ACTIVE", "Active", "yes-no"))
    this.Columns.push(new Column("NOTS", "Notes", "textarea"))
  }

}