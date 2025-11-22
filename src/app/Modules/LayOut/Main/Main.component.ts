import { Component, OnInit } from '@angular/core';
import { NaveComponent } from '../Nave/Nave.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../Header/Header.component";
import { NgIf } from '@angular/common';
import { Location } from '@angular/common';
import { Tools } from '../../../shared/service/Tools.service';

@Component({
  selector: 'app-Main',
  templateUrl: './Main.component.html',
  styleUrls: ['./Main.component.css'],
  standalone: true,
  imports: [NaveComponent, RouterOutlet, HeaderComponent, NgIf]
})
export class MainComponent implements OnInit {
  sideMenu: boolean = true
  constructor(private routeActve: ActivatedRoute,private location: Location,public _tools: Tools) { }
  ActivePath: string = "";
  ngOnInit() {
  }

  get InMain(): boolean {
    return this.location.path()=="/Main";
  }

}
