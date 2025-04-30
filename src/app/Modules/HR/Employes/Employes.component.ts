import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from '../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component';
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools';
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


@Component({
  selector: 'app-Employes',
  templateUrl: './Employes.component.html',
  styleUrls: ['./Employes.component.css'],
  standalone: true,
  imports: [StepperComponent, FormsModule, ButtonModule, StepConfigurationDirective, InputLabelComponent, InputNumberModule, InputTextModule, NgIf, ComboBoxComponent, DateTimeComponent, MultiselectComponent, UpLoadFileComponent]
})
export class EmployesComponent implements OnInit {
  StepperConfig: StepperConfiguration = new StepperConfiguration(this);
  Columns: Array<Column> = [];
  Managements: Array<any> = []
  Departs: Array<any> = []
  Places: Array<any> = []
  employee = {
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
    "SUITS": null,
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
  constructor(private _tools: Tools, private _ActiveRouter: ActivatedRoute) {
  }
  // 
  async ngOnInit() {
    this.Places = await this._tools.getAsync("Place") as Array<any>
    this.Managements = await this._tools.getAsync("Mangement") as Array<any>
    this.Departs = await this._tools.getAsync("Depart") as Array<any>
    this._ActiveRouter.queryParamMap.subscribe({
      next: async (PRAMS) => {
        if (PRAMS.get("Type")?.includes("Edit_Item")) {
          if (PRAMS.get("Type")?.split("=")[1]) {
            var response = await this._tools.getAsync(`Employee/GetById?id=${PRAMS.get("Type")?.split("=")[1]}`)
            if (response) {
              if (Array.isArray(response)) {
                this.employee = response[0]
              }
            }
          }
        }
        if (PRAMS.get("Type")?.includes("Add_Inherit")) {
          if (PRAMS.get("Type")?.split("=")[1]) {
            var response = await this._tools.getAsync(`Employee/GetById?id=${PRAMS.get("Type")?.split("=")[1]}`)
            if (response) {
              if (Array.isArray(response)) {
                this.employee = response[0];
                this.employee.ROW_NUMBER = -1;
                this.employee.ID = 0;
                this.employee.PLACES.forEach(place => { place.EMPLOYEE_ID = 0; place.ID = 0; place.ROW_NUMBER = -1 });
              }
            }
          }
        }
      },
    })
    this.StepperConfig.onSave = async () => {
      console.log(this.employee)
      var response = await this._tools.postAsync("Employee/AddMore", [this.employee]);
      if (response) {
        console.log(response)
      }

    }
  }
  back() {
    this._tools._router.navigate(["Main", "Employs"])
  }
}
