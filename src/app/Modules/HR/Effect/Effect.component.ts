import { Component, OnInit, ViewChild } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { Tools } from '../../../shared/service/Tools';
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { EmployeSelectionComponent } from "../EmployeSelection/EmployeSelection.component";
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { InputLabelComponent } from "../../../shared/pages/TextLabel/InputLabel.component";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { StepperModule } from 'primeng/stepper';
import { smoothScrollPagesComponent } from "../../../shared/components/SmothScrollPages/smoothScrollPages.component";
import { RouterLink } from '@angular/router';
import { StepperComponent } from "../../../shared/components/stepper/stepper.component";
import { StepConfigurationDirective } from '../../../shared/components/stepper/Step-Configuration.directive';
import { StepConfiguration, StepperConfiguration } from '../../../shared/components/stepper/stepper.configuration';
import { Table } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';

interface EffectInfo {
  ID: number;
  EFFECT_DATE_MONTH_FROM: number;
  EFFECT_DATE_YEAR_FROM: number;
  Count: number;
  ForceValue: boolean;
  Value?: number;
  calcByHours?: boolean;
  divedThem?: boolean;
  COLUMNS: any[];

}

interface EffectColumn {
  ID: number;
  COLUMN_NAME: string;
  TYPE: number;
  CONFIGURATION: any;
  value?: any;
}

@Component({
  selector: 'app-Effect',
  templateUrl: './Effect.component.html',
  styleUrls: ['./Effect.component.css'],
  standalone: true,
  imports: [
    InputLabelComponent,
    StepperModule,
    RouterLink,
    DataGridComponent,
    CheckboxModule,
    StepConfigurationDirective,
    ToggleSwitchModule,
    IftaLabelModule,
    SelectButtonModule,
    FormsModule,
    ComboBoxComponent,
    InputTextModule,
    InputNumberModule,
    EmployeSelectionComponent,
    NgIf,
    NgFor,
    ButtonModule,
    StepperComponent
  ]
})
export class EffectComponent implements OnInit {
  @ViewChild('grid') grid!: DataGridComponent;
  EFFECT_Fast_ADD_TYPE: boolean = false;
  effectPage: any = {};
  employ: Array<any> = [];
  effects: Array<any> = [];
  colsInfo: Array<any> = [];
  Columns: Array<Column> = [];
  selectedEmployee: Array<any> = [];
  _stepperConfig: StepperConfiguration;
  effectSelected: { COLUMNS: EffectColumn[], EFFECT_INFO: EffectInfo | null } = { COLUMNS: [], EFFECT_INFO: null };

  options: any[] = [
    { label: 'الوضع الطبيعي', value: false },
    { label: 'الوضع السريع', value: true },
  ];

  constructor(public _tools: Tools) {
    this._stepperConfig = new StepperConfiguration(this);
  }

  async ngOnInit() {
    this.effects = await this._tools.getAsync("EffectInSystem") as Array<any>
    this.colsInfo = await this._tools.getAsync("EffectColumn") as Array<any>;
  }
  async selectChange(effect: EffectInfo) {
    this.Columns = [];
    this.effectSelected.COLUMNS = [];
    this.effectSelected.EFFECT_INFO = effect;
    if (this.effectSelected.EFFECT_INFO) {
      this.effectSelected.EFFECT_INFO.EFFECT_DATE_MONTH_FROM = new Date().getMonth() + 1;
      this.effectSelected.EFFECT_INFO.EFFECT_DATE_YEAR_FROM = new Date().getFullYear();
      this.effectSelected.EFFECT_INFO.Count = 1;
      this.effectSelected.EFFECT_INFO.ForceValue = false;
    }
    
    if (effect.COLUMNS) {
      effect.COLUMNS.forEach((col) => {
        let col_data = this.ColumnInfo(col);
        if (col_data) {
          col_data.CONFIGURATION = col_data.CONFIGURATION != "" && typeof col_data.CONFIGURATION == "string" 
            ? JSON.parse(col_data.CONFIGURATION) 
            : col_data.CONFIGURATION == "" 
              ? null 
              : col_data.CONFIGURATION;
          this.effectSelected.COLUMNS.push(col_data);
        }
      });
    }
    this.addEffect();
  }
  ColumnInfo(col: any): EffectColumn | undefined {
    return this.colsInfo.find(x => x.ID == col.EFFECT_COLUMN_ID);
  }
  getTypeColumn(col: any, column: Column) {
    column.columnType = "text";
    column.width = 100;
  }
  afterSelected(e: any) {
    this.selectedEmployee = e;
  }
  addEffect() {
    let sourceInput: Array<any> = [];
    if (!this.effectSelected.EFFECT_INFO) return;
    //generate Data Source
    for (let index = 0; index < this.effectSelected.EFFECT_INFO.Count; index++) {
      this.selectedEmployee.forEach(emp => {
        let empInput = this._tools.cloneObject(emp);
        empInput.EMPLOY_ID = emp.ID;
        empInput.calcByHours = this.effectSelected.EFFECT_INFO?.calcByHours;
        empInput.value = this.effectSelected.EFFECT_INFO?.Value ?? 0;
        this.effectSelected.COLUMNS.forEach(col => {
          empInput["val_" + col.ID] = col.value;
        });

        if (this.effectSelected.EFFECT_INFO) {
          const effectDate = new Date(
            this.effectSelected.EFFECT_INFO.EFFECT_DATE_YEAR_FROM,
            this.effectSelected.EFFECT_INFO.EFFECT_DATE_MONTH_FROM + (index - 1),
            1, 0, 0, 0, 0
          );
          empInput.EFFECT_DATE = new Date(effectDate.toLocaleDateString("en") + " GMT");
        }
        empInput.ID = sourceInput.length + 1;
        sourceInput.push(empInput);
      });
    }
    if (this.effectSelected.EFFECT_INFO?.divedThem) {
      sourceInput.forEach(item => item.value = (item.value / sourceInput.length));
    }

    //generate Data Configuration
    this._tools.waitExecuteFunction(100, async () => {
      if (this.grid) {
        this.grid.rowsPerPageOptions = [10, 20, 40];
        this.grid.ManyRowsInShow = 10;
        
        this.grid.dataSource = [];
        this.grid.Columns = [];

        // On Save
        this.grid.onSaveChanges = async () => {
          if (this.grid.dataSource.length > 0) {
            if (!this.validationAll()) {
              return
            }
            let DB_EFFECTS: Array<any> = [];
            this.grid.dataSource.forEach(ef => {
              let sender: any = {};
              sender.DATE_TIME = new Date();
              sender.EFFECT_DATE = ef.EFFECT_DATE;
              sender.EMPLOY_ID = ef.EMPLOY_ID;
              sender.EFFECT_VALUE = ef.value;
              sender.CALCULATOR_BY_HOURS = ef.calcByHours;
              sender.EFFECT_SYSTEM_ID = this.effectSelected.EFFECT_INFO?.ID;
              sender.VALUES = [];
              (this.effectSelected.COLUMNS as Array<any>).forEach(col => {
                let v_E: any = {};
                v_E.VALUE = JSON.stringify(ef["val_" + col.ID]);
                v_E.EFFECT_ID = 0;
                v_E.EFFECT_COLUMN_ID = col.ID;
                if (v_E.VALUE == undefined) {
                  v_E.VALUE = "{}";
                }
                (sender.VALUES as Array<any>).push(v_E)
              });
              DB_EFFECTS.push(sender)
            });
            this.grid.IsLoading = true;
            this._tools.postAsync("Effect/AddMore", DB_EFFECTS).then(result => {
              if (result == true) {
                this._tools.Toaster.showSuccess("تم التسجيل بنجاح");
                this.grid.IsLoading = false;
                // this._tools._router.navigate(["Main","Effects"])
              }
            })
          }

        }
        this.grid.dataKey = "ID";
        this.grid.AddNew = async (_Table: Table) => {
          if (this.grid.dataSource.length > 0) {
            if (!this.validationAll()) {
              return
            }
          }
          let row = { ID: this.grid.dataSource.length + 1, EFFECT_DATE: new Date(new Date().toLocaleDateString("en") + " GMT") }
          row.EFFECT_DATE.setDate(1)
          this.grid.dataSource.push(row);
          _Table.reset();
        };
        this.grid.renderItems = (item, row, index) => {
          item.index = index + 1;
        }
        this.grid.dataSource = [];
        this.grid.Columns.push(new Column("index", "مسلسل", "lapel"))
        this.grid.Columns.push(new Column("CODE", "الكود", "comboBox"))
        this.grid.Columns.push(new Column("NAME", "الأسم", "comboBox"))
        this.grid.Columns.push(new Column("DEPART", "القسم", "lapel"))
        let suggestionsData = await this._tools.getAsync("Employee/Suggestions_Code_and_Name") as Array<any>
        this.grid.Columns[1].apiPathDataSource = "Employee/Suggestions_Code_and_Name";
        this.grid.Columns[1].columnComboBoxDataSource = suggestionsData;
        this.grid.Columns[1].columnComboBoxOptionLabel = "CODE";
        this.grid.Columns[1].columnComboBoxOptionValue = "CODE";
        this.grid.Columns[1].columnComboBoxPlaceholder = "حدد كود الموظف"
        this.grid.Columns[1].columnComboBoxChange = (select, item, comboBox) => {
          item.NAME = select.NAME;
          item.EMPLOY_ID = select.ID;
          item.DEPART = select.DEPART;
          comboBox.onClear = () => {
            item.NAME = null;
            item.EMPLOY_ID = null;
            item.DEPART = null;
          }
        }

        this.grid.Columns[2].apiPathDataSource = "Employee/Suggestions_Code_and_Name";
        this.grid.Columns[2].columnComboBoxDataSource = suggestionsData;
        this.grid.Columns[2].columnComboBoxOptionLabel = "NAME";
        this.grid.Columns[2].columnComboBoxOptionValue = "NAME";
        this.grid.Columns[2].columnComboBoxPlaceholder = "حدد اسم الموظف"
        this.grid.Columns[2].columnComboBoxChange = (select, item, comboBox) => {
          item.CODE = select.CODE;
          item.EMPLOY_ID = select.ID;
          item.DEPART = select.DEPART;
          comboBox.onClear = () => {
            item.CODE = null;
            item.EMPLOY_ID = null;
            item.DEPART = null;
          }
        }
        this.grid.Columns.push(new Column("EFFECT_DATE", "تاريخ التطبيق", "date"))
        let FORCE_VALUE = (this.effectSelected.COLUMNS as Array<any>).find(col => (col.TYPE == 7 || col.TYPE == 8) && col?.CONFIGURATION?.FORCE_VALUE == true) != null
        this.grid.Columns.push(new Column("value", "القيمة", FORCE_VALUE ? "lapel" : "number", "numeric"));
        this.grid.Columns.push(new Column("calcByHours", "تحسب بالساعة", "yes-no"))
        if (FORCE_VALUE) {
          this.grid.Columns[this.grid.Columns.length - 1].columnType = "lapel";
          this.grid.Columns[this.grid.Columns.length - 1].Style_Show = (value) => {
            return value == true ? "ساعة" : "قيمة"
          }
        }
        this.grid.onSelectColumnData = (row: any, value: Date, col) => {
          if (value != null && col.name == "EFFECT_DATE") {
            value.setDate(1)
            let data_now = new Date(new Date().toLocaleDateString("en") + " GMT")
            data_now.setDate(1);
            if (value < data_now) {
              this._tools.Toaster.showError("يجب ادخال تاريخ اكبر من تاريخ الشهر او يساوي")
              row.EFFECT_DATE = null
              return
            }
            row.EFFECT_DATE = value;
          }
        };
        (this.effectSelected.COLUMNS as Array<any>).forEach(async col => {
          let columnConfig = new Column("val_" + col.ID, col.COLUMN_NAME)
          switch (col.TYPE) {
            case 1:
            case 2:
            case 9:
              columnConfig.apiPathDataSource = col.CONFIGURATION.API_CALLING;
              columnConfig.columnComboBoxDataSource = await this._tools.getAsync(col.CONFIGURATION.API_CALLING) as Array<any>;
              columnConfig.columnComboBoxOptionLabel = col.CONFIGURATION.FOCUS_PROPERTY;
              columnConfig.columnComboBoxOptionValue = col.CONFIGURATION.FOCUS_PROPERTY;
              columnConfig.columnComboBoxPlaceholder = col.COLUMN_NAME;
              columnConfig.columnType = "comboBox";
              break;
            case 3:
              columnConfig.columnType = "text";
              break;
            case 4:
              columnConfig.columnType = "textarea";
              break;
            case 5:
              columnConfig.columnType = "date";
              break;
            case 7:
              columnConfig.columnType = "comboBox";
              columnConfig.columnComboBoxDataSource = col.CONFIGURATION.ArrayOfValues
              columnConfig.columnComboBoxOptionLabel = col.CONFIGURATION.ShowValue;
              columnConfig.columnComboBoxOptionValue = col.CONFIGURATION.ShowValue;
              columnConfig.columnComboBoxPlaceholder = col.COLUMN_NAME;
              columnConfig.columnComboBoxChange = (item, row) => {
                row.value = item.VALUE
                row.calcByHours = (this.effectSelected.COLUMNS as Array<any>).find(col => (col.TYPE == 7 || col.TYPE == 8) && col?.CONFIGURATION?.calculatedByHours == true) != null
              }
              break;
            case 8:
              columnConfig.columnType = "multiSelectObjectMode";
              columnConfig.columnMultiSelectDataSource = col.CONFIGURATION.ArrayOfValues
              columnConfig.columnMultiOptionLabel =col.CONFIGURATION.ShowValue;
              columnConfig.columnMultiSelectOptionValue = col.CONFIGURATION.ShowValue;
              columnConfig.columnMultiPlaceholder = col.COLUMN_NAME;
              columnConfig.columnMultiSelectChange = (multi, row) => {
                let value = 0;
                multi.dataSelected.forEach(item => {
                  value += item.VALUE;
                })
                row.value = value;
                row.calcByHours = (this.effectSelected.COLUMNS as Array<any>).find(col => (col.TYPE == 7 || col.TYPE == 8) && col?.CONFIGURATION?.calculatedByHours == true) != null
              }
              break;
          }
          this.grid.Columns.push(columnConfig);
        });
        this.grid.dataSource = [];
        this.grid.Columns[4].Style_Show = (e: Date) => {
          return e.toLocaleDateString("en")
        }
      }
      this.grid.dataSource = sourceInput;
    });
  }

  // Validate
  validationAll(): boolean {
    for (let index = 0; index < this.grid.dataSource.length; index++) {
      const row = this.grid.dataSource[index];
      if (row.CODE == null || row.NAME == null || row.DEPART == null) {
        this._tools.Toaster.showError("يجب ادخال بيانات الموظف" + " في مسلسل " + row.index)
        return false
      }
      if (row.EFFECT_DATE == null) {
        this._tools.Toaster.showError("يجب ادخال تاريخ التطبيق" + " في مسلسل " + row.index)
        return false
      };
      if (row.value == null || row.value == 0) {
        this._tools.Toaster.showError("يجب ادخال قيمة المؤثر" + " في مسلسل " + row.index)
        return false
      };
      for (let index = 0; index < this.effectSelected.COLUMNS.length; index++) {
        const col = this.effectSelected.COLUMNS[index];
        if ((row["val_" + col.ID] == null || row["val_" + col.ID] == "" || row["val_" + col.ID] == "") && col.CONFIGURATION.REQUIRED == true) {
          this._tools.Toaster.showError(`في مسلسل { ${row.index} } يجب ادخال { ${col.COLUMN_NAME} }`)
          return false
        }
      }
    }
    return true
  }
  ValidateEffectKind(): boolean {
    if (this.effectPage.TypeEffect == null) {
      this._tools.Toaster.showError("يجب ادخال نوع المؤثر")
      return false;
    }
    return true;
  }
  ValidateEmploySelected(): boolean {
    if (this.effectPage.selectedEmploys == null || (this.effectPage.selectedEmploys != null && this.effectPage.selectedEmploys.length == 0)) {
      this._tools.Toaster.showError("يجب تحديد الموظفين")
      return false;
    }
    return true;
  }
  ValidateEffectValue(): boolean {
    if (!this.effectSelected.EFFECT_INFO) {
      this._tools.Toaster.showError("يجب تحديد قيمة المؤثر");
      return false;
    }
    
    const effectInfo = this.effectSelected.EFFECT_INFO;
    if (!effectInfo.Value || effectInfo.Value <= 0) {
      this._tools.Toaster.showError("يجب تحديد قيمة المؤثر");
      return false;
    }
    else if (effectInfo.EFFECT_DATE_MONTH_FROM <= 0) {
      this._tools.Toaster.showError("يجب تحديد شهر البداية للتطبيق المؤثر");
      return false;
    }
    else if (effectInfo.EFFECT_DATE_YEAR_FROM <= 0) {
      this._tools.Toaster.showError("يجب تحديد سنة البداية للتطبيق المؤثر");
      return false;
    }
    else if (effectInfo.Count <= 0) {
      this._tools.Toaster.showError("يجب تحديد عدد الشهور المطبق عليها المؤثر");
      return false;
    }
    return true;
  }
  ValidateEffectType(): boolean {
    let result = (this.effectSelected.COLUMNS as Array<any>).find(col => col.CONFIGURATION.REQUIRED == true && (col.value == null || (col.value != null && col.value == 0) || (col.value != null && col.value == "")));
    if (result != null) {
      this._tools.Toaster.showError(` يجب ادخال قيمة ${result.COLUMN_NAME}`);
      return false
    }
    return true
  }
}
