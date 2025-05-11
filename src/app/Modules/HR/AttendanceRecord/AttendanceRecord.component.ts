import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Tools } from '../../../shared/service/Tools';

@Component({
  selector: 'app-AttendanceRecord',
  templateUrl: './AttendanceRecord.component.html',
  styleUrls: ['./AttendanceRecord.component.css'],
  standalone:true,
  imports:[ButtonModule]
})
export class AttendanceRecordComponent implements OnInit {

  constructor(public _tools: Tools) { }

  ngOnInit() {
  }
  GetFile(e:any)
  {
    this._tools.onFileChange(e)
    this._tools.onFileEndImport=(data)=>{
      
    }
  }
}
