import { Component, OnInit } from '@angular/core';
import { NaveComponent } from '../Nave/Nave.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../Header/Header.component";
@Component({
  selector: 'app-Main',
  templateUrl: './Main.component.html',
  styleUrls: ['./Main.component.css'],
  standalone:true,
  imports: [NaveComponent, RouterOutlet, HeaderComponent]
})
export class MainComponent implements OnInit {
  sideMenu:boolean=true
  constructor() { }
  ngOnInit() {
    
  }
 

}
