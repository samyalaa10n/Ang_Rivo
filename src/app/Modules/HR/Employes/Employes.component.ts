import { Component, ElementRef, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from '../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component';
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools.service';
import { NgIf } from '@angular/common';
import { StepperComponent } from "../../../shared/components/stepper/stepper.component";
import { StepperConfiguration } from '../../../shared/components/stepper/stepper.configuration';
import { StepConfigurationDirective } from '../../../shared/components/stepper/Step-Configuration.directive';
import { InputLabelComponent } from "../../../shared/pages/TextLabel/InputLabel.component";
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";
import { DateTimeComponent } from "../../../shared/components/DateTime/DateTime.component";
import { MultiselectComponent } from "../../../shared/components/multiselect/multiselect.component";
import { UpLoadFileComponent } from "../../../shared/components/UpLoadFile/UpLoadFile.component";
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";


@Component({
  selector: 'app-Employes',
  templateUrl: './Employes.component.html',
  styleUrls: ['./Employes.component.css'],
  standalone: true,
  imports: [StepperComponent, FormsModule, ButtonModule, StepConfigurationDirective, InputLabelComponent, InputNumberModule, InputTextModule, NgIf, ComboBoxComponent, DateTimeComponent, MultiselectComponent, UpLoadFileComponent, DataGridComponent]
})
export class EmployesComponent implements OnInit {
  StepperConfig: StepperConfiguration = new StepperConfiguration(this);
  Columns: Array<Column> = [];
  Managements: Array<any> = []
  Employs: Array<any> = []
  selectedEmploys: Array<any> = []
  Departs: Array<any> = []
  Places: Array<any> = []
  First_Name: string = "";
  second_Name: string = "";
  thirty_Name: string = "";
  forty_Name: string = "";
  ModePage: "Edit" | "Add" | "EditMore" | "Add Inherit" | null = null
  employee: any = {
    "ID": 0,
    "ROW_NUMBER": -1,
    "CODE": null,
    "NAME": null,
    "NATIONAL_ID": null,
    "MARITAL_STATUS": null,
    "RELIGION": null,
    "NATIONALITY": null,
    "CONSCRIPTION_POSITION": null,
    "DATE_OF_BIRTH": null,
    "TYPE": null,
    "WHATSAPP_NUMBER": null,
    "PHONE_NUMBER": null,
    "EMAIL": null,
    "ADDRESS": null,
    "QUALIFICATION_DEGREE": null,
    "NAME_OF_ACADEMIC_QUALIFICATION": null,
    "JOB_GRADE": null,
    "TYPE_OF_CONTRACT": null,
    "ASSIGNMENT_MODE": null,
    "DATE_OF_APPOINTMENT": null,
    "APPOINTMENT_END_DATE": null,
    "DEPART_ID": null,
    "POSATION_ID": null,
    "INSURANCE_FILE_NUMBER": null,
    "INSURANCE_NUMBER": null,
    "INSURANCE_COMPANY": null,
    "INSURANCE_SUBSCRIPTION_DATE": null,
    "INSURANCE_AMOUNT_PER_PERSON": null,
    "COMPANY_INSURANCE_AMOUNT": null,
    "METHOD_OF_TRANSITION": null,
    "BUS_NAME": null,
    "EMPLOYEE_MEAL": null,
    "OPENING_BALANCE_FOR_REGULAR": null,
    "ALLOWANCES": null,
    "SALARY": null,
    "IMAGE_PRINT": null,
    "FINGER_PRINT": null,
    "EMPLOYEE_PHOTO": null,
    "NATIONAL_ID_PHOTO": null,
    "BIRTH_CERTIFICATE_PHOTO": null,
    "ACADEMIC_QUALIFICATION_PHOTO": null,
    "ARMY_CERTIFICATE_PHOTO": null,
    "CRIMINAL_RECORD_PHOTO": null,
    "PLACES": null,
    "WEEKEND": null
  }
  constructor(public _tools: Tools, private _ActiveRouter: ActivatedRoute, private el: ElementRef<HTMLElement>) {
  }
  //
  async ngOnInit() {

    this.Columns.push(new Column('ID', "رقم النظام"))
    this.Columns.push(new Column('CODE', "كود الموظف"))
    this.Columns.push(new Column('NAME', "أسم الموظف"))
    this.Places = await this._tools.Network.getAsync("Place") as Array<any>
    this.Managements = await this._tools.Network.getAsync("Mangement") as Array<any>
    this.Departs = await this._tools.Network.getAsync("Depart") as Array<any>
    this._ActiveRouter.queryParamMap.subscribe({
      next: async (PRAMS) => {
        if (PRAMS.get("Type")?.includes("Edit_Item")) {
          this.ModePage = "Edit"
          if (PRAMS.get("Type")?.split("=")[1]) {
            var response = await this._tools.Network.getAsync(`Employee/GetById?id=${PRAMS.get("Type")?.split("=")[1]}`)
            if (response) {
              if (Array.isArray(response)) {
                this.employee = response[0]
                this.pictureNameEmploy();
              }
            }
          }
        }
        else if (PRAMS.get("Type")?.includes("Add_Inherit")) {
          this.ModePage = "Add Inherit"
          if (PRAMS.get("Type")?.split("=")[1]) {
            var response = await this._tools.Network.getAsync(`Employee/GetById?id=${PRAMS.get("Type")?.split("=")[1]}`)
            if (response) {
              if (Array.isArray(response)) {
                this.employee = response[0];
                this.pictureNameEmploy();
                this.employee.ROW_NUMBER = -1;
                this.employee.ID = 0;
                (this.employee.PLACES as Array<any>).forEach(place => { place.EMPLOYEE_ID = 0; place.ID = 0; place.ROW_NUMBER = -1 });
              }
            }
          }
        }
        else if (PRAMS.get("Type")?.includes("Add")) {
          this.ModePage = "Add"
          this.StepperConfig.Steps[0].select();
          this.clearEmployData()
        }
        else if (PRAMS.get("Type")?.includes("Edit_selected_Items")) {
          this.ModePage = "EditMore"
          // this.StepperConfig.Steps[0].select();
          let ListId = PRAMS.get("Type")?.split("=")[1].split(",");
          var response = await this._tools.Network.getAsync(`Employee`)
          if (Array.isArray(response) && ListId != undefined) {
            this.selectedEmploys = response.filter(x => ListId.includes(`${x.ID}`))
            this.Employs = response.filter(x => ListId.includes(`${x.ID}`))
            if (this.selectedEmploys.length > 0) {
              this.employee = this.selectedEmploys[0]
            }
          }
          this.clearEmployData()
        }
      },
    })
    this.StepperConfig.onSave = async () => {
      if (this.ModePage != "EditMore") {
        var response = await this._tools.Network.postAsync("Employee/AddMore", [this.employee]);
        if (response) {
          this._tools.Toaster.showSuccess("تم الحفظ بنجاح")
          switch (this.ModePage) {
            case "Edit":
              this._tools._router.navigate(["Main", "Employs"])
              break;
            case "Add Inherit":
              this._tools._router.navigate(["Main", "Employs", "Control"], { queryParams: { Type: 'Add_Inherit' } })
              break;
            case "Add":
              this._tools._router.navigate(["Main", "Employs", "Control"], { queryParams: { Type: 'Add' } })
              break;
          }
        }
      }
      else {
        this.selectedEmploys.forEach(item => {
          item.ROW_NUMBER = 1;
          item.DEPART_ID = this.employee.DEPART_ID != null ? this.employee.DEPART_ID : item.DEPART_ID;
          item.TYPE_OF_CONTRACT = this.employee.TYPE_OF_CONTRACT != null ? this.employee.TYPE_OF_CONTRACT : item.TYPE_OF_CONTRACT;
          item.SALARY = this.employee.SALARY != null ? this.employee.SALARY : item.SALARY;
          item.ALLOWANCES = this.employee.ALLOWANCES != null ? this.employee.ALLOWANCES : item.ALLOWANCES;
          item.POSATION_ID = this.employee.POSATION_ID != null ? this.employee.POSATION_ID : item.POSATION_ID;
          item.DATE_OF_APPOINTMENT = this.employee.DATE_OF_APPOINTMENT != null ? this.employee.DATE_OF_APPOINTMENT : item.DATE_OF_APPOINTMENT;
          item.ASSIGNMENT_MODE = this.employee.ASSIGNMENT_MODE != null ? this.employee.ASSIGNMENT_MODE : item.ASSIGNMENT_MODE;
          item.APPOINTMENT_END_DATE = this.employee.APPOINTMENT_END_DATE != null ? this.employee.APPOINTMENT_END_DATE : item.APPOINTMENT_END_DATE;
          item.INSURANCE_COMPANY = this.employee.INSURANCE_COMPANY != null ? this.employee.INSURANCE_COMPANY : item.INSURANCE_COMPANY;
          item.INSURANCE_SUBSCRIPTION_DATE = this.employee.INSURANCE_SUBSCRIPTION_DATE != null ? this.employee.INSURANCE_SUBSCRIPTION_DATE : item.INSURANCE_SUBSCRIPTION_DATE;
          item.INSURANCE_AMOUNT_PER_PERSON = this.employee.INSURANCE_AMOUNT_PER_PERSON != null ? this.employee.INSURANCE_AMOUNT_PER_PERSON : item.INSURANCE_AMOUNT_PER_PERSON;
          item.COMPANY_INSURANCE_AMOUNT = this.employee.COMPANY_INSURANCE_AMOUNT != null ? this.employee.COMPANY_INSURANCE_AMOUNT : item.COMPANY_INSURANCE_AMOUNT;
          item.Places = this.employee.Places != null ? this.employee.Places : item.Places;
          item.METHOD_OF_TRANSITION = this.employee.METHOD_OF_TRANSITION != null ? this.employee.METHOD_OF_TRANSITION : item.METHOD_OF_TRANSITION;
          item.BUS_NAME = this.employee.BUS_NAME != null ? this.employee.BUS_NAME : item.BUS_NAME;
          item.EMPLOYEE_MEAL = this.employee.EMPLOYEE_MEAL != null ? this.employee.EMPLOYEE_MEAL : item.EMPLOYEE_MEAL;
          item.OPENING_BALANCE_FOR_REGULAR = this.employee.OPENING_BALANCE_FOR_REGULAR != null ? this.employee.OPENING_BALANCE_FOR_REGULAR : item.OPENING_BALANCE_FOR_REGULAR;
        })
      }
      var response = await this._tools.Network.putAsync("Employee/EditMore", this.selectedEmploys);
      if (response) {
        this._tools.Toaster.showSuccess("تم الحفظ بنجاح")
        this._tools._router.navigate(["Main", "Employs"])
      }

      return true;

    }
  }
  pictureNameEmploy() {
    this.First_Name = this.employee.NAME.split(' ')[0] == undefined ? "" : this.employee.NAME.split(' ')[0];
    this.second_Name = this.employee.NAME.split(' ')[1] == undefined ? "" : this.employee.NAME.split(' ')[1];
    this.thirty_Name = this.employee.NAME.split(' ')[2] == undefined ? "" : this.employee.NAME.split(' ')[2];
    this.forty_Name = this.employee.NAME.split(' ')[3]== undefined ? "" : this.employee.NAME.split(' ')[3];
  }
  Edit_APPOINTMENT_END_DATE() {
    if (this.employee.ASSIGNMENT_MODE === 'بالخدمة') {
      this.employee.APPOINTMENT_END_DATE = null;
    }
  }
  clearEmployData() {
    this.First_Name = "";
    this.second_Name = "";
    this.thirty_Name = "";
    this.forty_Name = "";
    this.employee = {
      "ID": 0,
      "ROW_NUMBER": -1,
      "CODE": null,
      "NAME": null,
      "NATIONAL_ID": null,
      "MARITAL_STATUS": null,
      "RELIGION": null,
      "NATIONALITY": null,
      "CONSCRIPTION_POSITION": null,
      "DATE_OF_BIRTH": null,
      "TYPE": null,
      "WHATSAPP_NUMBER": null,
      "PHONE_NUMBER": null,
      "EMAIL": null,
      "ADDRESS": null,
      "QUALIFICATION_DEGREE": null,
      "NAME_OF_ACADEMIC_QUALIFICATION": null,
      "JOB_GRADE": null,
      "TYPE_OF_CONTRACT": null,
      "ASSIGNMENT_MODE": null,
      "DATE_OF_APPOINTMENT": null,
      "APPOINTMENT_END_DATE": null,
      "DEPART_ID": null,
      "POSATION_ID": null,
      "INSURANCE_FILE_NUMBER": null,
      "INSURANCE_NUMBER": null,
      "INSURANCE_COMPANY": null,
      "INSURANCE_SUBSCRIPTION_DATE": null,
      "INSURANCE_AMOUNT_PER_PERSON": null,
      "COMPANY_INSURANCE_AMOUNT": null,
      "METHOD_OF_TRANSITION": null,
      "BUS_NAME": null,
      "EMPLOYEE_MEAL": null,
      "OPENING_BALANCE_FOR_REGULAR": null,
      "ALLOWANCES": null,
      "SALARY": null,
      "IMAGE_PRINT": null,
      "FINGER_PRINT": null,
      "EMPLOYEE_PHOTO": null,
      "NATIONAL_ID_PHOTO": null,
      "BIRTH_CERTIFICATE_PHOTO": null,
      "ACADEMIC_QUALIFICATION_PHOTO": null,
      "ARMY_CERTIFICATE_PHOTO": null,
      "CRIMINAL_RECORD_PHOTO": null,
      "PLACES": null,
      "WEEKEND": null
    }
  }
  back() {
    this._tools._router.navigate(["Main", "Employs"])
  }
  confirmName() {
    this.employee.NAME = `${this.First_Name} ${this.second_Name} ${this.thirty_Name} ${this.forty_Name}`
    console.log(this.employee)
  }
  editTextName(event: KeyboardEvent, index: number, bind: string, last: boolean = false) {
    console.log(event)
    if (event.key == ' ') {
      let next_el = this.el.nativeElement.querySelector(`#n_${index + 1}`) as HTMLElement
      if (next_el) {
        next_el.focus();
        if (typeof (this as any)[bind] == "string") {
          let value = (this as any)[bind] as string;
          (this as any)[bind] = value.trim();
        }
      }
    }
    else if (event.code == "Backspace" && this._tools.Validation.isEmpty((event.target as any).value)) {
      let next_el = this.el.nativeElement.querySelector(`#n_${index - 1}`) as HTMLElement
      if (next_el) {
        next_el.focus();
      }
    }
    this.confirmName()
  }
  clearRelatedData(e: any) {
    if (e != 'دائم') {
      this.employee.INSURANCE_NUMBER = null;
      this.employee.INSURANCE_COMPANY = "";
      this.employee.INSURANCE_FILE_NUMBER = null;
      this.employee.INSURANCE_SUBSCRIPTION_DATE = null;
      this.employee.INSURANCE_AMOUNT_PER_PERSON = null;
      this.employee.COMPANY_INSURANCE_AMOUNT = null;
      this.employee.OPENING_BALANCE_FOR_REGULAR = 0;
    }
  }
  async filterManagement() {
    this.employee.POSATION_ID = null;
    this.Managements = await this._tools.Network.getAsync("Mangement") as Array<any>
    this.Managements = this.Managements.filter(z => z.DEPART_ID == this.employee.DEPART_ID)
  }
  Validation_Main_EmployData(): boolean {
    if (this._tools.Validation.isEmpty(this.employee.NAME) || this._tools.Validation.isEmpty(this.First_Name) || this._tools.Validation.isEmpty(this.second_Name) || this._tools.Validation.isEmpty(this.thirty_Name) || this._tools.Validation.isEmpty(this.forty_Name)) {
      this._tools.Toaster.showError("يجب ادخال اسم الموظف")
      return false;
    }
    if (this.employee.NAME != null && (this.employee.NAME as string).split(" ").length < 4) {
      this._tools.Toaster.showError("يجب ادخال الأسم رباعي")
      return false;
    }
    if (this._tools.Validation.isEmpty(this.employee.TYPE)) {
      this._tools.Toaster.showError("يجب ادخال نوع الموظف")
      return false;
    }
    if (this._tools.Validation.isEmpty(this.employee.DATE_OF_BIRTH)) {
      this._tools.Toaster.showError("يجب ادخال تاريخ الميلاد للموظف")
      return false;
    }

    if (this._tools.Validation.isEmpty(this.employee.MARITAL_STATUS)) {
      this._tools.Toaster.showError("يجب ادخال الحالة الاجتماعية للموظف")
      return false;
    }

    if (this._tools.Validation.isEmpty(this.employee.NATIONALITY)) {
      this._tools.Toaster.showError("يجب ادخال الجنسية للموظف")
      return false;
    }
    if (this._tools.Validation.isNumbers(this.employee.NATIONAL_ID)) {
      this._tools.Toaster.showError("يجب ادخال رقم الرقم القومي بشكل صحيح")
      return false;
    }
    if (this.employee.NATIONAL_ID != null && (this.employee.NATIONAL_ID as string).length != 14 && this.employee.NATIONALITY == "مصر") {
      this._tools.Toaster.showError("يجب ادخال رقم الرقم القومي بشكل صحيح")
      return false;
    }
    if (this._tools.Validation.isEmpty(this.employee.RELIGION)) {
      this._tools.Toaster.showError("يجب ادخال الديانة للموظف")
      return false;
    }
    if (this._tools.Validation.isEmpty(this.employee.CONSCRIPTION_POSITION)) {
      this._tools.Toaster.showError("يجب ادخال موقف التجنيد للموظف")
      return false;
    }
    if (this._tools.Validation.isEmpty(this.employee.QUALIFICATION_DEGREE)) {
      this._tools.Toaster.showError("يجب ادخال المؤهل العلمي للموظف")
      return false;
    }
    if (this._tools.Validation.isEmpty(this.employee.NAME_OF_ACADEMIC_QUALIFICATION)) {
      this._tools.Toaster.showError("يجب ادخال اسم المؤهل العلمي للموظف")
      return false;
    }
    if (this._tools.Validation.isNumbers(this.employee.PHONE_NUMBER)) {
      this._tools.Toaster.showError("يجب ادخال رقم الهاتف للموظف بشكل صحيح")
      return false;
    }
    if (this.employee.PHONE_NUMBER != null && !((this.employee.PHONE_NUMBER as string).length == 11 || (this.employee.PHONE_NUMBER as string).length == 10)) {
      this._tools.Toaster.showError("يجب ادخال رقم الهاتف للموظف بشكل صحيح")
      return false;
    }
    if (this.employee.EMAIL != null && this._tools.Validation.isEmail(this.employee.EMAIL)) {
      this._tools.Toaster.showError("يجب ادخال البريد الالكتروني للموظف بشكل صحيح")
      return false;
    }
    if (this._tools.Validation.isEmpty(this.employee.ADDRESS)) {
      this._tools.Toaster.showError("يجب ادخال العنوان للموظف")
      return false;
    }
    return true;
  }

  Validation_Functional_Data(): boolean {
    if (this._tools.Validation.isEmpty(this.employee.CODE)) {
      this._tools.Toaster.showError("يجب ادخال الرقم الوظيفي للموظف")
      return false
    }
    if (this._tools.Validation.isEmpty(this.employee.DEPART_ID)) {
      this._tools.Toaster.showError(`يجب ادخال القسم للموظف`)
      return false
    }
    if (this._tools.Validation.isEmpty(this.employee.TYPE_OF_CONTRACT)) {
      this._tools.Toaster.showError("يجب ادخال نوع التوظيف للموظف")
      return false
    }
    if (this._tools.Validation.isEmpty(this.employee.ALLOWANCES)) {
      this._tools.Toaster.showError("يجب ادخال البدلات للموظف")
      return false
    }
    if (this._tools.Validation.isEmpty(this.employee.SALARY)) {
      this._tools.Toaster.showError("يجب ادخال الراتب للموظف")
      return false
    }
    if (this._tools.Validation.isEmpty(this.employee.POSATION_ID)) {
      this._tools.Toaster.showError("يجب ادخال الوظيفة للموظف")
      return false
    }
    if (this._tools.Validation.isEmpty(this.employee.DATE_OF_APPOINTMENT)) {
      this._tools.Toaster.showError("يجب ادخال الوظيفة للموظف")
      return false
    }
    if (this._tools.Validation.isEmpty(this.employee.ASSIGNMENT_MODE)) {
      this._tools.Toaster.showError("يجب ادخال وسيلة التوظيف للموظف")
      return false
    }
    if (this.employee.ASSIGNMENT_MODE != "بالخدمة" && this._tools.Validation.isEmpty(this.employee.APPOINTMENT_END_DATE)) {
      this._tools.Toaster.showError("يجب ادخال تاريخ انتهاء التوظيف للموظف")
      return false
    }
    return true
  }
  Validation_Insurance_Data(): boolean {
    if (this.employee.TYPE_OF_CONTRACT == "دائم") {
      if (this._tools.Validation.isEmpty(this.employee.INSURANCE_NUMBER)) {
        this._tools.Toaster.showError("يجب ادخال رقم التأمين للموظف")
        return false;
      }
      if (this._tools.Validation.isEmpty(this.employee.INSURANCE_COMPANY)) {
        this._tools.Toaster.showError("يجب ادخال شركة التأمين للموظف")
        return false;
      }
      if (this._tools.Validation.isEmpty(this.employee.INSURANCE_FILE_NUMBER)) {
        this._tools.Toaster.showError("يجب ادخال رقم الملف للتأمين للموظف")
        return false;
      }
      if (this._tools.Validation.isEmpty(this.employee.INSURANCE_SUBSCRIPTION_DATE)) {
        this._tools.Toaster.showError("يجب ادخال تاريخ بداء الاشتراك في التأمين")
        return false;
      }
      if (this._tools.Validation.isEmpty(this.employee.INSURANCE_AMOUNT_PER_PERSON)) {
        this._tools.Toaster.showError("يجب ادخال مبلغ التأمين للموظف")
        return false;
      }
      if (this._tools.Validation.isEmpty(this.employee.COMPANY_INSURANCE_AMOUNT)) {
        this._tools.Toaster.showError("يجب ادخال مبلغ التأمين للشركة للموظف")
        return false;
      }
      return true;
    }
    else {
      return true;
    }
  }
  Validation_Periodic_Data(): boolean {
    if (this.employee.PLACES != null && this.employee.PLACES.length == 0) {
      this._tools.Toaster.showError("يجب ادخال المكان المقيد للموظف")
      return false;
    }
    if (this._tools.Validation.isEmpty(this.employee.METHOD_OF_TRANSITION)) {
      this._tools.Toaster.showError("يجب ادخال طريقة الانتقال للموظف")
      return false;
    }
    if (this._tools.Validation.isEmpty(this.employee.EMPLOYEE_MEAL)) {
      this._tools.Toaster.showError("يجب ادخال الوجبة الموظف للموظف")
      return false;
    }
    if (this.employee.METHOD_OF_TRANSITION == "باص" && this._tools.Validation.isEmpty(this.employee.BUS_NAME)) {
      this._tools.Toaster.showError("يجب ادخال اسم الباص للموظف")
      return false;
    }
    if (this.employee.TYPE_OF_CONTRACT == 'دائم' && this._tools.Validation.isEmpty(this.employee.OPENING_BALANCE_FOR_REGULAR)) {
      this._tools.Toaster.showError("يجب ادخال الرصيد الافتتاحي للموظف")
      return false;
    }
    return true;
  }


}
