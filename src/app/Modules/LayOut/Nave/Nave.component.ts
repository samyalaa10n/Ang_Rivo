import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar'
import { MenuModule } from 'primeng/menu'
import { MenuItem } from 'primeng/api';
import { Tools } from '../../../shared/service/Tools.service';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
@Component({
  selector: 'app-Nave',
  templateUrl: './Nave.component.html',
  styleUrls: ['./Nave.component.css'],
  standalone: true,
  imports: [DrawerModule, ButtonModule, MenuModule, PanelMenuModule]
})
export class NaveComponent implements OnInit {
  showNave: boolean = false;
  showSmallNave: boolean = false;
  items: MenuItem[] | undefined;
  constructor(private _tools: Tools, private _router: Router, private el: ElementRef<HTMLElement>) { }

  ngOnInit() {
    this.items = [
      {
        label: 'التحكم في النظام',
        icon: 'pi pi-home',
        items: [
          {
            label: 'نوع المستخدم',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'RuleGroup']);
            },
          },
          {
            label: 'المستخدمين',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Users']);
            },
          }
        ]
      },
      {
        label: 'بيانات النظام الأساسية',
        icon: 'pi pi-home',
        items: [
          {
            label: 'الشركات',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Companies']);
            },
          },
          {
            label: 'الاقسام',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Departs']);
            },
          },
          {
            label: 'اماكن اعمل',
            icon: 'pi pi-database',
            shortcut: '⌘+S',
            command: (event) => {
              this._router.navigate(['Main', 'Places']);
            },
          },
          {
            label: 'الهيكل الأداري',
            icon: 'pi pi-database',
            shortcut: '⌘+S',
            command: (event) => {
              this._router.navigate(['Main', 'Mangements']);
            },
          }
        ]
      },
      {
        label: "الموارد البشرية",
        icon: "pi pi-user",
        items: [
          {
            label: 'الموظفين',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Employs']);
            },
          },
          {
            label: 'المؤثرات الشهرية',
            items: [
              {
                label: 'تعريف مؤثرات للنظام',
                icon: 'pi pi-database',
                command: (event) => {
                  this._router.navigate(['Main', 'EffectInSystem']);
                },
              },
              {
                label: 'تعريف حقول ادخال للنظام',
                icon: 'pi pi-database',
                command: (event) => {
                  this._router.navigate(['Main', 'ColumnEffect']);
                },
              },
              {
                label: 'مؤثرات الموظفين',
                icon: 'pi pi-database',
                command: (event) => {
                  this._router.navigate(['Main', 'Effects']);
                },
              }
            ]
          },
          {
            label: 'الحضور و الأنصراف',
            command: (event) => {
            },
            items: [
              {
                label: 'أجهزة الحضور و الانصراف',
                icon: 'pi pi-database',
                command: (event) => {
                  this._router.navigate(['Main', 'AttendanceAndDepartureDevices']);
                },
              },
              {
                label: 'سجل الحضور و الانصراف',
                icon: 'pi pi-database',
                command: (event) => {
                  this._router.navigate(['Main', 'AttendanceRecord']);
                },
              },
              {
                label: 'ورديات العمل',
                icon: 'pi pi-database',
                command: (event) => {
                  this._router.navigate(['Main', 'shifts']);
                },
              },
              {
                label: 'مواعيد خاصة',
                icon: 'pi pi-database',
                command: (event) => {
                  this._router.navigate(['Main', 'SomeEmployRule']);
                },
              },
              {
                label: 'الأجازات',
                icon: 'pi pi-database',
                command: (event) => {
                  this._router.navigate(['Main', 'Holiday']);
                },
              },
              {
                label: 'النواقص',
                icon: 'pi pi-database',
                command: (event) => {
                  this._router.navigate(['Main', 'ForgatInOut']);
                },
              },
              {
                label: 'حساب ساعات العمل',
                icon: 'pi pi-database',
                command: (event) => {
                  this._router.navigate(['Main', 'AttendanceCalculator']);
                },
              }
            ]
          },
          {
            label: 'البدلات',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Suits']);
            },
          },
          {
            label: 'الرواتب الشهرية',
            icon: 'pi pi-database',
            command: (event) => {
              this._router.navigate(['Main', 'Companies']);
            },
          },
         
        ]
      }
    ]

  }
  closeNave() {
    this.showNave = false
  }
}
