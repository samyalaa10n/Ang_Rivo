import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  constructor(public _tools: Tools, private _router: Router, private el: ElementRef<HTMLElement>,private activeRuter:ActivatedRoute) { }

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
            label: 'User Roles',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'RuleGroup']);
            },
          },
          {
            label: 'Users',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'Users']);
            },
          }
        ]
      },
      {
        label: 'Master Data',
        icon: 'pi pi-home',
        items: [
          {
            label: 'Companies',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'Companies']);
            },
          },
          {
            label: 'Departments',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'Departs']);
            },
          },
          {
            label: 'Locations',
            icon: 'pi pi-database',
            shortcut: '⌘+S',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'Places']);
            },
          },
          {
            label: 'Organization Structure',
            icon: 'pi pi-database',
            shortcut: '⌘+S',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'Mangements']);
            },
          }
        ]
      },
      {
        label: 'Inventory',
        icon: 'pi pi-database',
        items: [
          {
            label: 'Enable / Disable Items',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'AtivateItems']);
            },
          },
          // {
          //   label: 'Warehouses',
          //   icon: 'pi pi-database',
          //   command: (event) => {
          //    this.closeNave(); this._router.navigate(['Main', 'WareHouses']);
          //   },
          // },
          {
            label: 'Categories',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'Category']);
            },
          },
          {
            label: 'Items',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'Items']);
            },
          }
          // {
          //   label: 'Units',
          //   icon: 'pi pi-database',
          //   command: (event) => {
          //    this.closeNave(); this._router.navigate(['Main', 'Units']);
          //   },
          // }
          // ,
          // {
          //   label: 'Stock Transactions',
          //   icon: 'pi pi-database',
          //   command: (event) => {
          //    this.closeNave(); this._router.navigate(['Main', 'OperationList']);
          //   },
          // }
        ]
      },
      {
        label: 'Sales',
        icon: 'pi pi-database',
        items: [
          {
            label: 'Delivery Control',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'DeliveryControl'])
            },
          },
          {
            label: 'Bookings',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'RequstesList'])
            },
          },
          {
            label: 'POS',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'Cashier']);
            },
          },
          {
            label: 'Seasons',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'Season']);
            },
          },
          // {
          //   label: 'Customer Discounts',
          //   icon: 'pi pi-database',
          //   command: (event) => {
          //    this.closeNave(); this._router.navigate(['Main', 'SpecialDescound']);
          //   },
          // },
          {
            label: 'Special Pricing',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'SpecialPrice']);
            },
          },
          {
            label: 'Customers',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'Customer']);
            },
          },
          {
            label: 'Invoices',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'InvoiceList']);
            },
          }
        ]
      },
      {
        label: 'Accounting',
        icon: 'pi pi-database',
        items: [
          {
            label: 'Chart of Accounts',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'Accounts']);
            },
          },
          {
            label: 'Transaction Types',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'AccountTypeOperations']);
            },
          },
          {
            label: 'Journal Entries',
            icon: 'pi pi-database',
            command: (event) => {
             this.closeNave(); this._router.navigate(['Main', 'AccountOperationList']);
            },
          }
        ]
      },
      {
        label: 'Reports',
        icon: 'pi pi-database',
        command: (event) => {
         this.closeNave(); this._router.navigate(['Main', 'Report']);
        },
      },
      {
        label: 'Logout',
        icon: 'pi pi-power-off',
        command: (event) => {
          localStorage.removeItem("logInfo")
         this.closeNave(); this._router.navigate(['Login'])
        },
      }
    ]

    let accseptedPage = JSON.parse(localStorage.getItem("logInfo") ?? '{}').MYPAGESD as Array<any>
    this.items = this.items.filter(x => accseptedPage.includes(x.label) || x.label == "Logout")
  }
  closeNave() {
    this.showNave = false
  }
  openNave() {
    this.showNave = true
  }
}
