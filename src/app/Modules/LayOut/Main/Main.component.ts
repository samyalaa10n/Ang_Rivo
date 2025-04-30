import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar'
import { NaveComponent } from '../Nave/Nave.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../Footer/Footer.component";
import { HeaderComponent } from "../Header/Header.component";
@Component({
  selector: 'app-Main',
  templateUrl: './Main.component.html',
  styleUrls: ['./Main.component.css'],
  standalone:true,
  imports: [NaveComponent, RouterOutlet, FooterComponent, HeaderComponent]
})
export class MainComponent implements OnInit {
  sideMenu:boolean=true
  constructor() { }
  ngOnInit() {
    
  }
 

}
