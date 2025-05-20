import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Tools } from '../../../shared/service/Tools';
import { InputLabelComponent } from "../../../shared/pages/TextLabel/InputLabel.component";
import { DateTimeComponent } from "../../../shared/components/DateTime/DateTime.component";
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";

@Component({
  selector: 'app-AttendanceRecord',
  templateUrl: './AttendanceRecord.component.html',
  styleUrls: ['./AttendanceRecord.component.css'],
  standalone: true,
  imports: [ButtonModule, InputLabelComponent, DateTimeComponent, DataGridComponent, ComboBoxComponent]
})
export class AttendanceRecordComponent implements OnInit {
  columns:Array<Column>=[];
  dataSource:Array<any>=[];
  Departs:Array<any>=[];
  constructor(public _tools: Tools) { }
  request = { START: null, END: null,SELECTED_Depart:0 }
  async ngOnInit() {
    this.Departs = await this._tools.getAsync("Depart") as Array<any>
    this.columns.push(new Column("ID","رقم السجل","lapel"))
    this.columns.push(new Column("ID_EMPLOYE","رقم النظام","lapel"))
    this.columns.push(new Column("CODE","كود الموظف","lapel"))
    this.columns.push(new Column("NAME","اسم الموظف","lapel"))
    this.columns.push(new Column("DEPART","قسم الموظف","lapel"))
    this.columns.push(new Column("DATETIME","وقت التوقيع","lapel"))
    this.columns[this.columns.length - 1].Style_Show = (VALUE) => {
      return this._tools.EditFormateData(VALUE, "dd/MM/yyyy HH:mm:ss")
    };
    this.columns.push(new Column("TYPE","نوع التوقيع","lapel"))
    this.columns.push(new Column("ID_DIVICE_IN_SYSTEM","رقم المكينة","lapel"))
    this.columns.push(new Column("ID_DIVICE_NAME","أسم المكينة","lapel"))
    this.columns.push(new Column("ID_DIVICE_PLACE","مكان المكينة","lapel"))
  }
  async GetFile(e: any) {
    let devices = await this._tools.getAsync("AttendanceAndDepartureDevice") as Array<any>;
    let Employs = await this._tools.getAsync("Employee/Suggestions_Code_and_Name") as Array<any>;
    if (devices != null && Employs != null) {
      this._tools.onFileChange(e)
      let SERVER_DATA: Array<any> = []
      this._tools.onFileEndImport = async (data) => {
        data.forEach(rec => {
          let record = {
            "ID": 0,
            "ROW_NUMBER": -1,
            "ID_EMPLOYE": null,
            "DEPART_ID": null,
            "CODE": null,
            "DATETIME": null,
            "TYPE": "",
            "ID_DIVICE_RECORD": "",
            "ID_DIVICE_IN_SYSTEM": 0
          }
          record.ID_EMPLOYE = Employs.find(x => x.CODE == rec.No)?.ID;
          record.DEPART_ID = Employs.find(x => x.CODE == rec.No)?.DEPART_ID;
          record.CODE = Employs.find(x => x.CODE == rec.No)?.CODE;
          record.TYPE = (rec.Status as string).toLocaleLowerCase();
          record.ID_DIVICE_RECORD = `${devices.find(x => x.CODE == rec.LocationID)?.CODE}`;
          record.ID_DIVICE_IN_SYSTEM = devices.find(x => x.CODE == rec.LocationID)?.ID;
          record.DATETIME = this._tools.convertNumberToData(rec.DateTime) as any;
          if (record.TYPE != undefined&& record.DEPART_ID && record.CODE != undefined && record.ID_EMPLOYE != undefined && record.DATETIME != undefined && record.ID_DIVICE_IN_SYSTEM != undefined && record.ID_DIVICE_RECORD != undefined) {
            SERVER_DATA.push(record);
          }
        })
       var response= await this._tools.postAsync("AttendanceRecord/AddMore", SERVER_DATA)
       console.log(response)
       if(Array.isArray(response))
        {
          this._tools.Toaster.showSuccess("تم حفظ البيانات بنجاح")
        }
      }
    }
  }

  async showData() {
    let devices = await this._tools.getAsync("AttendanceAndDepartureDevice") as Array<any>;
    let Employs = await this._tools.getAsync("Employee/Suggestions_Code_and_Name") as Array<any>;
    var places = await this._tools.getAsync("Place") as Array<any>;
    var data = await this._tools.getAsync("AttendanceRecord?filter=" + JSON.stringify(this.request)) as Array<any>;
    if (data) {
      let source:Array<any>=[];
      data.forEach(item=>{
        let rec={
          ID:null,
          ID_EMPLOYE:null,
          CODE:null,
          NAME:null,
          DEPART:null,
          DATETIME:null,
          TYPE:null,
          ID_DIVICE_IN_SYSTEM:null,
          ID_DIVICE_NAME:null,
          ID_DIVICE_PLACE:null,
        }
        rec.ID=item.ID;
        rec.ID_EMPLOYE=item.ID_EMPLOYE;
        let emp=Employs.find(x=>x.ID==item.ID_EMPLOYE)
        rec.CODE=Number.parseInt(emp.CODE) as any
        rec.NAME=emp.NAME
        rec.DEPART=emp?.DEPART??"";
        rec.DATETIME=new Date(item.DATETIME) as any;
        rec.TYPE=item.TYPE;
        rec.ID_DIVICE_IN_SYSTEM=item.ID_DIVICE_IN_SYSTEM;
        let device_info=devices.find(x=>x.ID==rec.ID_DIVICE_IN_SYSTEM)
        rec.ID_DIVICE_NAME=device_info.NAME;
        rec.ID_DIVICE_PLACE=places.find(Z=>Z.ID==device_info.PLACE_ID).NAME ;
        source.push(rec);
      }) 
      this.dataSource=this._tools.dynamicSortMutable(source,["CODE","DATETIME"])
    }
  }
}


// DateTime
// : 
// 45737.33033564815
// Department
// : 
// "المدينه التجمع"
// LocationID
// : 
// "103"
// Name
// : 
// "احمد فاروق فتحى ابراهيم"
// No
// : 
// "20009"
// Status
// : 
// "C/In"