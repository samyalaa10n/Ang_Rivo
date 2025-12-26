import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu'
import { MenuItem } from 'primeng/api';
import { Tools } from '../../../shared/service/Tools.service';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-Nave',
  templateUrl: './Nave.component.html',
  styleUrls: ['./Nave.component.css'],
  standalone: true,
  imports: [DrawerModule, ButtonModule, MenuModule, PanelMenuModule, NgIf],
  providers: [PanelMenuModule, DrawerModule]
})
export class NaveComponent implements OnInit {
  showNave: boolean = false;
  showSmallNave: boolean = false;
  items: MenuItem[] | undefined;
  constructor(public _tools: Tools, private _router: Router, private el: ElementRef<HTMLElement>) { }

  ngOnInit() {
    this._tools._LinkComponent.subscribe({
      next: (value) => {
        if (value == "open") {
          this.openNave();
        }
        if (value == "close") {
          this.closeNave();
        }
      }
    })

    this.items = [
      {
        label: 'System Control',
        icon: 'pi pi-home',
        items: [
          {
            label: 'User Type',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'RuleGroup']);
            },
          },
          {
            label: 'Users',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Users']);
            },
          }
        ]
      },
      {
        label: 'Basic System Data',
        icon: 'pi pi-home',
        items: [
          {
            label: 'Companies',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Companies']);
            },
          },
          {
            label: 'Departments',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Departs']);
            },
          },
          {
            label: 'Work Places',
            icon: 'pi pi-database',
            shortcut: '⌘+S',
            command: (event) => {
              this._router.navigate(['Main', 'Places']);
            },
          },
          {
            label: 'Administrative Structure',
            icon: 'pi pi-database',
            shortcut: '⌘+S',
            command: (event) => {
              this._router.navigate(['Main', 'Mangements']);
            },
          }
        ]
      },
      {
        label: 'Warehouses',
        icon: 'pi pi-database',
        items: [
          {
            label: 'Warehouses',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'WareHouses']);
            },
          },
          {
            label: 'Categories',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Category']);
            },
          },
          {
            label: 'Items',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Items']);
            },
          },
          {
            label: 'Units of Measurement',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Units']);
            },
          },
          {
            label: 'Warehouse Operations',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'OperationList']);
            },
          }
        ]
      },
      {
        label: 'Sales',
        icon: 'pi pi-database',
        items: [
          {
            label: 'Reservations',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'RequstesList'])
            },
          },
          {
            label: 'Cashier',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Cashier']);
            },
          },
          {
            label: 'Seasons Data',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Season']);
            },
          },
          {
            label: 'Special Discount Rates',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'SpecialDescound']);
            },
          },
          {
            label: 'Special Prices',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'SpecialPrice']);
            },
          },
          {
            label: 'Customers',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Customer']);
            },
          },
          {
            label: 'Invoices',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'InvoiceList']);
            },
          }
        ]
      },
      {
        label: 'Accounts',
        icon: 'pi pi-database',
        items: [
          {
            label: 'Chart of Accounts',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Accounts']);
            },
          },
          {
            label: 'Operation Types',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'AccountTypeOperations']);
            },
          },
          {
            label: 'Journal Entries',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'AccountOperationList']);
            },
          }
        ]
      },
      {
        label: 'Reports',
        icon: 'pi pi-database',
        command: (event) => {
          this._router.navigate(['Main', 'Report']);
        },
      },
      {
        label: 'Logout',
        icon: 'pi pi-power-off',
        command: (event) => {
          localStorage.removeItem("logInfo")
          this._router.navigate(['Login'])
        },
      }
    ]

    let accseptedPage = JSON.parse(localStorage.getItem("logInfo") ?? '{}').MYPAGESD as Array<any>
    this.items = this.items.filter(x => accseptedPage.includes(x.label) || x.label == "تسجيل خروج")
  }
  closeNave() {
    this.showNave = false
  }
  openNave() {
    this.showNave = true
  }
}
