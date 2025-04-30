import { Component, EventEmitter, Input, OnInit, Output, ViewChild, input } from '@angular/core';
import { DataGridComponent } from '../../../shared/components/dataGrid/dataGrid.component';
import { Tools } from '../../../shared/service/Tools';
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { DialogModule } from "primeng/dialog"
import { ButtonModule } from 'primeng/button';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputLabelComponent } from "../../../shared/pages/TextLabel/InputLabel.component";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-EmployeSelection',
  templateUrl: './EmployeSelection.component.html',
  styleUrls: ['./EmployeSelection.component.css'],
  imports: [DataGridComponent, AutoCompleteModule, FormsModule, NgTemplateOutlet, InputTextModule, NgIf, ComboBoxComponent, DialogModule, ButtonModule, InputLabelComponent],
  standalone: true,
})
export class EmployeSelectionComponent implements OnInit {
  Departs: Array<any> = [];
  departSelected: any = null;
  showDialog: boolean = false;
  filteredData: Array<any> = [];
  LABEL: string = "تحديد الموظفين"
  suggestionsData: Array<any> = [];
  @Input() showInModel: boolean = true;
  @Input() selectedEmploys: Array<any> = [];
  @Output() selectedEmploysChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('grid') grid!: DataGridComponent
  @ViewChild('comboBox') comboBox!: ComboBoxComponent
  constructor(private _tools: Tools) { }
  async ngOnInit() {
    this.Departs = await this._tools.getAsync("Depart") as Array<any>
    this.suggestionsData = await this._tools.getAsync("Employee/Suggestions_Code_and_Name") as Array<any>
  }
  ngAfterViewInit() {
    this._tools.waitExecuteFunction(100, () => {
      this.grid.AllowDelete = false;
      this.grid.AllowSave = false;
      this.grid.AllowUpdate = false;
      this.grid.AllowAdd = false;
      this.grid.singleSelectedMode = false;
      this.grid.AllowDeleteSelected = false;
      this.grid.canSelectedSomeColumns = false;
      this.grid.Columns.push(new Column("CODE", "كود الموظف"));
      this.grid.Columns.push(new Column("NAME", "اسم الموظف"));
      this.grid.Columns.push(new Column("DEPART", "قسم الموظف"));
      this.grid.Columns = this.grid.Columns;
      this.grid.onSelectRow = (e) => {
        if (this.grid.selectedItems.length > 0) {
          this.LABEL = ` تم تحديد ${this.grid.selectedItems.length} موظف`
        }
        else {
          this.LABEL = "بحث عن موظف"
        }
        this.grid.selectedItems.forEach(item => this.Add_Selected(item));
        this.selectedEmploysChange.emit(this.selectedEmploys);
      }
      this.grid.onUnSelectRow = (e) => {
        this.Remove_Selected(e.data);
      }
      this.grid.onSelectAllChange = (e) => {
        if (this.grid.selectedItems.length == 0) {
          this.selectedEmploys.forEach(item => {
            if (item.DEPART_ID === this.comboBox.selected.ID) {
              this.Remove_Selected(item);
            }
          });
        }
        else {
          this.grid.selectedItems.forEach(item => { this.Add_Selected(item); });
        }
        this.selectedEmploysChange.emit(this.selectedEmploys);
      }
    });
  }
  Add_Selected(item: any) {
    if (this.selectedEmploys.find(x => x.ID == item.ID) == null) {
      this.selectedEmploys.push(item);
    }
    this.selectedEmploysChange.emit(this.selectedEmploys);
  }
  ngOnChanges() {
    if (this.selectedEmploys == undefined) {
      this.selectedEmploys = [];
    }
  }
  Remove_Selected(item: any, cancelByHand: boolean = false) {
    if (!cancelByHand) {
      this.selectedEmploys = this.selectedEmploys.filter(x => x.ID !== item.ID);
    }
    else {
      this.selectedEmploys = this.selectedEmploys.filter(x => x.ID !== item.ID);
      this.grid.selectedItems = this.grid.dataSource.filter(x => this.selectedEmploys.map(z => z.ID).includes(x.ID));
    }
    this.selectedEmploysChange.emit(this.selectedEmploys);
  }
  clearAll() {
    this.selectedEmploys.forEach(item => {
      this.Remove_Selected(item, true)
    })
    this.selectedEmploysChange.emit(this.selectedEmploys);
  }
  async SelectedChange(selected: any) {
    let employesSelectes = await this._tools.getAsync(`Employee/GetEmployesByDepartId?DepartId=${selected.ID}`) as Array<any>
    if (employesSelectes) {
      employesSelectes.forEach(x => x.DEPART = selected.NAME)
      this.grid.dataSource = employesSelectes;
    }
    this.selectedEmploysChange.emit(this.selectedEmploys);
  }
  filterEmploy(event: any, optionLabel: string) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.suggestionsData as any[]).length; i++) {
      let item = (this.suggestionsData as any[])[i];
      if (item[optionLabel].toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }
    this.filteredData = filtered;
    this.selectedEmploysChange.emit(this.selectedEmploys);
  }
  selectedData() {
    this.showDialog = false;
    this.grid.selectedItems.forEach(item => this.Add_Selected(item));
    this.selectedEmploysChange.emit(this.selectedEmploys);
  }
  async Selected(e: any) {
    let selectedDepart = this.comboBox.dataSource.find(x => x.ID == e.value.DEPART_ID);
    if (selectedDepart) {
      this.comboBox.selected = selectedDepart;
      await this.SelectedChange(this.comboBox.selected)
      let selected = this.grid.dataSource.find(x => x.ID == e.value.ID)
      this.Add_Selected(selected);
      this.grid.selectedItems = this.grid.dataSource.filter(x => this.selectedEmploys.map(z => z.ID).includes(x.ID));
      this.selectedEmploysChange.emit(this.selectedEmploys);
    }
  }
  search(elem: HTMLElement) {
    let searched = (elem as any).value as string;
    let elements = Array.from(document.querySelectorAll(".item-Selected")) as Array<HTMLElement>;
    elements.forEach(element => {
      if (element.textContent?.includes(searched) || searched == "") {
        element.style.display = "flex"
      }
      else {
        element.style.display = "none"
      }
    });
  }
}
