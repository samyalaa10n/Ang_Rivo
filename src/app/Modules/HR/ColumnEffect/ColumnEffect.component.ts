import { Component, OnInit, ViewChild } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { NgIf } from '@angular/common';
import { Column } from '../../../shared/components/dataGrid/Column';
import { CustomColumnDirective } from '../../../shared/components/dataGrid/CustomColumn.directive';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";

@Component({
  selector: 'app-ColumnEffect',
  templateUrl: './ColumnEffect.component.html',
  styleUrls: ['./ColumnEffect.component.css'],
  imports: [GetAddEditDeleteComponent, NgIf, FormsModule, CustomColumnDirective, ButtonModule, CheckboxModule, DialogModule, FloatLabelModule, DataGridComponent, ComboBoxComponent]
})
export class ColumnEffectComponent implements OnInit {

  showDialog: boolean = false;
  @ViewChild("curd") curd!: GetAddEditDeleteComponent;
  Columns: Column[] = [];
  Columns_Setting: Column[] = [];
  
  private readonly INITIAL_CONFIGURATION = {
    API_CALLING: "Employee/Suggestions_Code_Concat_Name",
    FOCUS_PROPERTY: "CODE",
    calculatedByHours: false,
    FORCE_VALUE: false,
    REQUIRED: true,
    ArrayOfValues: [],
    ShowValue: ""
  };

  constructor() {
    this.CONFIGURATION = { ...this.INITIAL_CONFIGURATION };
  }

  CONFIGURATION: typeof this.INITIAL_CONFIGURATION;

  ngOnInit() {
    this.initializeColumns();
    this.initializeSettingColumns();
  }

  private initializeColumns(): void {
    this.Columns = [
      new Column("ID", "رقم البند"),
      new Column("COLUMN_NAME", "اسم البند", "text", "text", 200),
      new Column("TYPE", "نوع البند", "comboBox", "comboBox", 200),
      new Column("CONFIGURATION_Edit", "تهيئة", "custom")
    ];

    this.configureTypeColumn();
  }

  private configureTypeColumn(): void {
    const typeColumn = this.Columns[2];
    typeColumn.columnComboBoxDataSource = [
      { ID: 1, NAME: " كود موظف" },
      { ID: 2, NAME: "اسم موظف" },
      { ID: 3, NAME: "نص صغير" },
      { ID: 4, NAME: "نص تفصيلي" },
      { ID: 5, NAME: "تاريخ" },
      { ID: 6, NAME: "نعم ام لا" },
      { ID: 7, NAME: "قيمة من قائمة" },
      { ID: 8, NAME: "اكثر من قيمة من قائمة" },
      { ID: 9, NAME: "مكان عمل" },
    ];
    
    typeColumn.columnComboBoxOptionLabel = "NAME";
    typeColumn.columnComboBoxOptionValue = "ID";
    typeColumn.columnComboBoxPlaceholder = "اختر نوع البند";
    typeColumn.columnComboBoxChange = this.handleTypeChange.bind(this);
  }

  private handleTypeChange(e: any, item: any): void {
    const config = { ...this.INITIAL_CONFIGURATION };
    
    switch (e.ID) {
      case 2:
        config.FOCUS_PROPERTY = "NAME";
        break;
      case 9:
        config.FOCUS_PROPERTY = "NAME";
        config.API_CALLING = "Place";
        break;
    }
    
    item.CONFIGURATION = JSON.stringify(config);
  }

  private initializeSettingColumns(): void {
    this.Columns_Setting = [
      new Column("ID", "الرقم", "number"),
      new Column("NAME", "الأسم", "text"),
      new Column("VALUE", "القيمة", "number")
    ];
  }

  setValue(item: any, event: boolean): void {
    const configuration = JSON.parse(item.CONFIGURATION);
    configuration.REQUIRED = event;
    item.CONFIGURATION = JSON.stringify(configuration);
  }

  getValue(item: any): boolean {
    return JSON.parse(item.CONFIGURATION).REQUIRED;
  }

  openSetting(item: any): void {
    this.CONFIGURATION = JSON.parse(item.CONFIGURATION);
    this.CONFIGURATION.ArrayOfValues = this.CONFIGURATION.ArrayOfValues || [];
    this.showDialog = true;
    (this as any).old_Item = item;
  }

  async confirmSetting(dataGrid: DataGridComponent | null): Promise<void> {
    if (!dataGrid && (this as any).old_Item) {
      (this as any).old_Item.CONFIGURATION = JSON.stringify(this.CONFIGURATION);
      return;
    }

    if (dataGrid) {
      dataGrid.onSaveChanges = async () => {
        this.confirmSetting(null);
        dataGrid.selectedItems = [];
        this.showDialog = false;
        if (this.curd) {
          await this.curd.grid.save();
        }
      };
    }
  }
}
