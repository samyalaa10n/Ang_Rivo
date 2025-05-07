import { Component, OnInit, Type } from '@angular/core';
import { Tools } from '../../../shared/service/Tools';
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { CustomColumnDirective } from '../../../shared/components/dataGrid/CustomColumn.directive';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-EmploysRecodes',
  templateUrl: './EmploysRecodes.component.html',
  styleUrls: ['./EmploysRecodes.component.css'],
  imports: [DataGridComponent, CustomColumnDirective, ButtonModule, DialogModule]
})
export class EmploysRecodesComponent implements OnInit {
  Columns: Array<Column> = [];
  Employees: Array<any> = [];
  showDialog: boolean = false;
  constructor(private _tools: Tools) { }

  async ngOnInit() {
    this.Columns.push(new Column('FILES', "تحميل الملفات", "custom"))
    this.Columns.push(new Column('ID', "رقم النظام"))
    this.Columns.push(new Column('CODE', "كود الموظف"))
    this.Columns.push(new Column('NAME', "أسم الموظف"))
    this.Columns.push(new Column('NATIONAL_ID', "الرقم القومي"))
    this.Columns.push(new Column('DATE_OF_BIRTH', "تاريخ الميلاد"))
    this.Columns.push(new Column('MARITAL_STATUS', "الحالة الأجتماعية"))
    this.Columns.push(new Column('TYPE', "النوع"))
    this.Columns.push(new Column('RELIGION', "الديانة"))
    this.Columns.push(new Column('NATIONALITY', "الجنسية"))
    this.Columns.push(new Column('CONSCRIPTION_POSITION', "موقف التجنيد"))
    this.Columns.push(new Column('QUALIFICATION_DEGREE', "درجة المؤهل"))
    this.Columns.push(new Column('NAME_OF_ACADEMIC_QUALIFICATION', "اسم المؤهل الدراسي"))
    this.Columns.push(new Column('PHONE_NUMBER', "رقم التيلفون"))
    this.Columns.push(new Column('EMAIL', "البريد الألكتروني"))
    this.Columns.push(new Column('ADDRESS', "العنوان بالتفصيل"))
    this.Columns.push(new Column('POSATION', "الوظيفة"))
    this.Columns.push(new Column('JOB_GRADE', "الدرجة الوظيفية"))
    this.Columns.push(new Column('TYPE_OF_CONTRACT', "نوع التعاقد"))
    this.Columns.push(new Column('SALARY', "قيمة الراتب"))
    this.Columns.push(new Column('SUITS', "قيمة البدلات"))
    this.Columns.push(new Column('DEPART', "القسم"))
    this.Columns.push(new Column('DATE_OF_APPOINTMENT', "تاريخ التعين"))
    this.Columns.push(new Column('ASSIGNMENT_MODE', "وضع التعين"))
    this.Columns.push(new Column('APPOINTMENT_END_DATE', "تاريخ انتهاء التعين"))
    this.Columns.push(new Column('INSURANCE_NUMBER', "الرقم التاميني"))
    this.Columns.push(new Column('INSURANCE_COMPANY', "جهة التأمين"))
    this.Columns.push(new Column('INSURANCE_FILE_NUMBER', "رقم ملف التأمينات"))
    this.Columns.push(new Column('INSURANCE_SUBSCRIPTION_DATE', "تاريخ الاشتراك في التأمين"))
    this.Columns.push(new Column('INSURANCE_AMOUNT_PER_PERSON', "مبلغ التأمين للفرد"))
    this.Columns.push(new Column('COMPANY_INSURANCE_AMOUNT', "مبلغ التأمين للشركة"))
    this.Columns.push(new Column('PLACES_INFO', "مكان العمل"))
    this.Columns.push(new Column('METHOD_OF_TRANSITION', "طريقة الانتقال"))
    this.Columns.push(new Column('BUS_NAME', "اسم الباص"))
    this.Columns.push(new Column('EMPLOYEE_MEAL', "وجبة الموظف"))
    this.Columns.push(new Column('OPENING_BALANCE_FOR_REGULAR', "رصيد الأفتتاحي لأعتيادي"))

    let data = await this._tools.getAsync("Employee") as Array<any>
    if (data != null) {
      this.Employees = data;
    }
    else {
      this.Employees = [];
    }
  }
  Config(dataGrid: DataGridComponent) {
    dataGrid.onUpdate = async () => {
      let data = await this._tools.getAsync("Employee") as Array<any>
      if (data != null) {
        this.Employees = data;
      }
      else {
        this.Employees = [];
      }
    }
    dataGrid.AddNew = async () => {
      this._tools._router.navigate(["Main", "Employs", "Control"], { queryParams: { Type: 'Add' } })
    }
    dataGrid.AllowEdit = true;
    dataGrid.onEditItem = (item) => {
      this._tools.tempData = item;
      this._tools._router.navigate(["Main", "Employs", "Control"], { queryParams: { Type: 'Edit_Item=' + item.ID } })
    }
    dataGrid.onAddInert = (item) => {
      this._tools.tempData = item;
      this._tools._router.navigate(["Main", "Employs", "Control"], { queryParams: { Type: 'Add_Inherit=' + item.ID } })
    }
    dataGrid.onDeleteItem = async (item) => {
      item.ROW_NUMBER = 0
      let data = await this._tools.putAsync("Employee/EditMore", [item]) as Array<any>
      if (data) {
        this._tools.Toaster.showInfo("تم حذف الموظف بنجاج")
        dataGrid.onUpdate(dataGrid.dt);
      }
    }
    dataGrid.DeleteSelectedData = async () => {
      dataGrid.selectedItems.forEach(item => {
        item.ROW_NUMBER = 0
      });
      let data = await this._tools.putAsync("Employee/EditMore", dataGrid.selectedItems) as Array<any>
      if (data) {
        this._tools.Toaster.showInfo("تم حذف الموظف بنجاج")
        dataGrid.onUpdate(dataGrid.dt);
      }
    }
  }

}
