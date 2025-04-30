import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from '../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component';

@Component({
  selector: 'app-Company',
  templateUrl: './Company.component.html',
  styleUrls: ['./Company.component.css'],
  standalone:true,
  imports:[GetAddEditDeleteComponent]
})
export class CompanyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
