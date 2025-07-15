import { Component, OnInit } from '@angular/core';
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";
import { DateTimeComponent } from "../../../shared/components/DateTime/DateTime.component";
import { Button } from "primeng/button";
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";

@Component({
  selector: 'app-RequstesList',
  templateUrl: './RequstesList.component.html',
  styleUrls: ['./RequstesList.component.css'],
  imports: [ComboBoxComponent, DateTimeComponent, Button, DataGridComponent]
})
export class RequstesListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
