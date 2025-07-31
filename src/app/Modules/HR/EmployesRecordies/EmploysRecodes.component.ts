import { Component, OnInit, Type } from '@angular/core';
import { Tools } from '../../../shared/service/Tools.service';
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { CustomColumnDirective } from '../../../shared/components/dataGrid/CustomColumn.directive';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-EmploysRecodes',
  templateUrl: './EmploysRecodes.component.html',
  styleUrls: ['./EmploysRecodes.component.css'],
  imports: [DataGridComponent, CustomColumnDirective, ButtonModule, DialogModule, NgIf]
})
export class EmploysRecodesComponent implements OnInit {
  Columns: Array<Column> = [];
  Departs: Array<any> = [];
  Managements: Array<any> = [];
  Places: Array<any> = [];
  importedDataColumns: Array<Column> = [];
  Employees: Array<any> = [];
  importedData: Array<any> = [];
  showDialog: boolean = false;
  showExcelDialog: boolean = false;
  constructor(private _tools: Tools) { }

  async ngOnInit() {
    this.Places = await this._tools.Network.getAsync("Place") as Array<any>
    this.Managements = await this._tools.Network.getAsync("Mangement") as Array<any>
    this.Departs = await this._tools.Network.getAsync("Depart") as Array<any>
    this.Columns.push(new Column('FILES', "تحميل الملفات", "custom"))
    this.Columns.push(new Column('ID', "رقم النظام"))
    this.Columns.push(new Column('CODE', "كود الموظف", "text"))
    this.Columns.push(new Column('NAME', "أسم الموظف", "text"))
    this.Columns.push(new Column('DEPART_ID', "القسم", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = this.Departs;
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر القسم";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns.push(new Column('TYPE', "النوع"))

    this.Columns.push(new Column('DATE_OF_BIRTH', "تاريخ الميلاد"))
    this.Columns[this.Columns.length - 1].Style_Show = (VALUE) => {
      return this._tools.DateTime.EditFormateData(VALUE, "YYYY-MM-DD")
    };
    this.Columns.push(new Column('MARITAL_STATUS', "الحالة الأجتماعية", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = [{ name: 'أعزب', id: 1 }, { name: 'متزوج', id: 2 }, { name: 'مطلق', id: 3 }, { name: 'أرمل', id: 4 }];
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "name";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر الحالة";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "name";
    this.Columns.push(new Column('NATIONALITY', "الجنسية"))

    this.Columns.push(new Column('NATIONAL_ID', "الرقم القومي"))
    this.Columns.push(new Column('RELIGION', "الديانة"))

    this.Columns.push(new Column('CONSCRIPTION_POSITION', "موقف التجنيد", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = [{ name: 'اعفاء نهائي', id: 1 }, { name: 'اعفاء مؤقت', id: 2 }, { name: 'قضي الخدمة', id: 3 }, { name: 'بالخدمة', id: 4 }, { name: 'لم يصبة الدور', id: 5 }];
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "name";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر موقف التجنيد";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "name";
    this.Columns.push(new Column('QUALIFICATION_DEGREE', "درجة المؤهل", "comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = [{ name: 'دون مؤهل', id: 1 }, { name: 'محو امية', id: 2 }, { name: 'اعدادية', id: 3 }, { name: 'متوسط', id: 4 }, { name: 'عالي', id: 5 }, { name: 'ماجيستير', id: 6 }, { name: 'دكتوراة', id: 7 }];
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "name";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر المؤهل";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "name";
    this.Columns.push(new Column('NAME_OF_ACADEMIC_QUALIFICATION', "اسم المؤهل الدراسي", "text"))
    this.Columns.push(new Column('PHONE_NUMBER', "رقم التيلفون", "text"))
    this.Columns.push(new Column('EMAIL', "البريد الألكتروني"))
    this.Columns.push(new Column('ADDRESS', "العنوان بالتفصيل"))

    this.Columns.push(new Column('POSATION', "الوظيفة"))
    this.Columns.push(new Column('TYPE_OF_CONTRACT', "نوع التعاقد"))
    this.Columns.push(new Column('SALARY', "قيمة الراتب", "numberWithFraction"))
    this.Columns.push(new Column('SUITS', "قيمة البدلات", "numberWithFraction"))
    this.Columns.push(new Column('DATE_OF_APPOINTMENT', "تاريخ التعين"))
    this.Columns[this.Columns.length - 1].Style_Show = (VALUE) => {
      return this._tools.DateTime.EditFormateData(VALUE, "YYYY-MM-DD ")
    };
    this.Columns.push(new Column('ASSIGNMENT_MODE', "وضع التعين"))
    this.Columns.push(new Column('APPOINTMENT_END_DATE', "تاريخ انتهاء التعين"))
    this.Columns[this.Columns.length - 1].Style_Show = (VALUE) => {
      if (VALUE) {
        return this._tools.DateTime.EditFormateData(VALUE, "YYYY-MM-DD")
      }
      return ""
    };
    this.Columns.push(new Column('INSURANCE_NUMBER', "الرقم التاميني"))
    this.Columns.push(new Column('INSURANCE_COMPANY', "جهة التأمين"))
    this.Columns.push(new Column('INSURANCE_FILE_NUMBER', "رقم ملف التأمينات"))
    this.Columns.push(new Column('INSURANCE_SUBSCRIPTION_DATE', "تاريخ الاشتراك في التأمين"))
    this.Columns[this.Columns.length - 1].Style_Show = (VALUE) => {
      if (VALUE) {
        return this._tools.DateTime.EditFormateData(VALUE, "YYYY-MM-DD")
      }
      return ""
    };
    this.Columns.push(new Column('INSURANCE_AMOUNT_PER_PERSON', "مبلغ التأمين للفرد", "numberWithFraction"))
    this.Columns.push(new Column('COMPANY_INSURANCE_AMOUNT', "مبلغ التأمين للشركة", "numberWithFraction"))
    this.Columns.push(new Column('PLACES_INFO', "مكان العمل"))
    this.Columns.push(new Column('METHOD_OF_TRANSITION', "طريقة الانتقال"))
    this.Columns.push(new Column('BUS_NAME', "اسم الباص"))
    this.Columns.push(new Column('EMPLOYEE_MEAL', "وجبة الموظف"))
    this.Columns.push(new Column('OPENING_BALANCE_FOR_REGULAR', "رصيد الأفتتاحي لأعتيادي", "numberWithFraction"))

    let data = await this._tools.Network.getAsync("Employee") as Array<any>
    if (data != null) {
      this.Employees = data;
    }
    else {
      this.Employees = [];
    }
  }
  Config(dataGrid: DataGridComponent) {
    dataGrid.importExcel = (e) => {
      this.GetFile(e)
    }
    dataGrid.AllowImportExcel = true;
    dataGrid.onUpdate = async () => {
      let data = await this._tools.Network.getAsync("Employee") as Array<any>
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
      let data = await this._tools.Network.putAsync("Employee/EditMore", [item]) as Array<any>
      if (data) {
        this._tools.Toaster.showInfo("تم حذف الموظف بنجاج")
        dataGrid.onUpdate(dataGrid.dt);
      }
    }
    dataGrid.onSaveChanges = async (editData) => {
      let data = await this._tools.Network.putAsync("Employee/EditMore", editData) as Array<any>
      if (data) {
        this._tools.Toaster.showSuccess("تم تحديث البيانات بنجاج")
      }
    }
    dataGrid.DeleteSelectedData = async () => {
      dataGrid.selectedItems.forEach(item => {
        item.ROW_NUMBER = 0
      });
      let data = await this._tools.Network.putAsync("Employee/EditMore", dataGrid.selectedItems) as Array<any>
      if (data) {
        this._tools.Toaster.showInfo("تم حذف الموظف بنجاج")
        dataGrid.onUpdate(dataGrid.dt);
      }
    }
  }
  GetFile(e: any) {
    this._tools.Excel.ExcelFileChange(e, (json: Array<any>) => {
      let source: Array<any> = [];
      json.forEach(item => {
        let employee: any = {
          "ID": 0,
          "ROW_NUMBER": -1,
          "CODE": null,
          "NAME": "",
          "NATIONAL_ID": null,
          "MARITAL_STATUS": null,
          "RELIGION": null,
          "NATIONALITY": "مصر",
          "CONSCRIPTION_POSITION": null,
          "DATE_OF_BIRTH": null,
          "TYPE": "ذكر",
          "WHATSAPP_NUMBER": null,
          "PHONE_NUMBER": null,
          "EMAIL": null,
          "ADDRESS": null,
          "QUALIFICATION_DEGREE": null,
          "NAME_OF_ACADEMIC_QUALIFICATION": null,
          "JOB_GRADE": "",
          "TYPE_OF_CONTRACT": null,
          "ASSIGNMENT_MODE": null,
          "DATE_OF_APPOINTMENT": null,
          "APPOINTMENT_END_DATE": null,
          "DEPART_ID": null,
          "POSATION_ID": null,
          "INSURANCE_FILE_NUMBER": null,
          "INSURANCE_NUMBER": null,
          "INSURANCE_COMPANY": 'قطاع خاص',
          "INSURANCE_SUBSCRIPTION_DATE": null,
          "INSURANCE_AMOUNT_PER_PERSON": null,
          "COMPANY_INSURANCE_AMOUNT": null,
          "METHOD_OF_TRANSITION": null,
          "BUS_NAME": "",
          "EMPLOYEE_MEAL": null,
          "OPENING_BALANCE_FOR_REGULAR": 0,
          "SUITS": 0,
          "SALARY": null,
          "IMAGE_PRINT": null,
          "FINGER_PRINT": null,
          "EMPLOYEE_PHOTO": null,
          "NATIONAL_ID_PHOTO": null,
          "BIRTH_CERTIFICATE_PHOTO": null,
          "ACADEMIC_QUALIFICATION_PHOTO": null,
          "ARMY_CERTIFICATE_PHOTO": null,
          "CRIMINAL_RECORD_PHOTO": null,
          "PLACES": [
            {
              "ID": 0,
              "ROW_NUMBER": 0,
              "EMPLOYEE_ID": 0,
              "PLACE_ID": 0
            }
          ]
        }
        Object.entries(item).forEach(p => {
          if (p[0] == "CODE") {
            employee[p[0]] = `${item[p[0]]}`;
          }
          else if (item[p[0]]) {
            employee[p[0]] = item[p[0]]
          }
        })
        source.push(employee)
      });
      this.importedDataColumns = this._tools.cloneObject(this.Columns.filter(c => c.name != "FILES"))
      this.importedData = source
      this.showExcelDialog = true;
    });
  }
  configImportExcelData(grid: DataGridComponent) {
    grid.onSaveChanges = async (editData: Array<any>) => {
      editData.forEach(item => {
        item.ROW_NUMBER = -1
        item.SUITS = 0 || "";
      });
      let data = await this._tools.Network.putAsync("Employee/EditMore", editData) as Array<any>
      if (data) {
        this.showExcelDialog = false;
        this._tools.Toaster.showSuccess("تم  استيراد البيانات بنجاج")
      }
    }
  }
  editMore(grid: DataGridComponent) {
    this._tools._router.navigate(["Main", "Employs", "Control"], { queryParams: { Type: 'Edit_selected_Items=' + grid.selectedItems.map(x => x.ID).join(",").toString() } })
  }
}
