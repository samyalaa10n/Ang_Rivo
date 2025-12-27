import { Routes } from '@angular/router';
import { authGuard } from './shared/Gurd/auth.guard';
import { MainComponent } from './Modules/LayOut/Main/Main.component';
import { LoginComponent } from './Modules/Admin/Login/Login.component';
import { HomeComponent } from './Modules/LayOut/Home/Home.component';




export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  {
    path: 'Login',
    title: 'Login',
    component: LoginComponent
  },
  {
    path: 'Home',
    title: 'Welcome',
    component: HomeComponent
  },
  {
    path: 'Main',
    title: 'Dashboard',
    canActivateChild: [authGuard],
    component: MainComponent,
    children: [
      {
        path: 'RequestPrint',
        data: { REQ: '' },
        title: 'Print Reservations',
        loadComponent: () => import('./shared/pages/RequestPrintComponent/RequestPrintComponent.component').then(m => m.RequestPrintComponentComponent)
      },
      {
        path: 'EffectInSystem',
        title: 'System Effects',
        loadComponent: () => import('./Modules/HR/EffectInSystem/EffectInSystem.component').then(m => m.EffectInSystemComponent)
      },
      {
        path: 'ColumnEffect',
        title: 'Effect Items',
        loadComponent: () => import('./Modules/HR/ColumnEffect/ColumnEffect.component').then(m => m.ColumnEffectComponent)
      },
      {
        path: 'Employs',
        title: 'Employees List',
        loadComponent: () => import('./Modules/HR/EmployesRecordies/EmploysRecodes.component').then(m => m.EmploysRecodesComponent)
      },
      {
        path: 'Employs/Control',
        title: 'Employee Data',
        loadComponent: () => import('./Modules/HR/Employes/Employes.component').then(m => m.EmployesComponent)
      },
      {
        path: 'Companies',
        title: 'Companies',
        loadComponent: () => import('./Modules/FactoryBase/Company/Company.component').then(m => m.CompanyComponent)
      },
      {
        path: 'Departs',
        title: 'Departments',
        loadComponent: () => import('./Modules/FactoryBase/Depart/Depart.component').then(m => m.DepartComponent)
      },
      {
        path: 'Places',
        title: 'Work Places',
        loadComponent: () => import('./Modules/FactoryBase/Place/Place.component').then(m => m.PlaceComponent)
      },
      {
        path: 'Mangements',
        title: 'Organizational Structure',
        loadComponent: () => import('./Modules/FactoryBase/Mangement/Mangement.component').then(m => m.MangementComponent)
      },
      {
        path: 'Holiday',
        title: 'Holidays Registration',
        loadComponent: () => import('./Modules/HR/holidayRecords/holidayRecords.component').then(m => m.HolidayRecodesComponent)
      },
      {
        path: 'ForgatInOut',
        title: 'Attendance Deficiencies',
        loadComponent: () => import('./Modules/HR/ForgatInOut/ForgatInOut.component').then(m => m.ForgatInOutComponent)
      },
      {
        path: 'Effects',
        title: 'Effects',
        loadComponent: () => import('./Modules/HR/EffectRecodes/EffectRecodes.component').then(m => m.EffectRecodesComponent)
      },
      {
        path: 'Effects/Add',
        title: 'Add Effect',
        loadComponent: () => import('./Modules/HR/Effect/Effect.component').then(m => m.EffectComponent)
      },
      {
        path: 'Users',
        title: 'Users',
        loadComponent: () => import('./Modules/Admin/User/User.component').then(m => m.UserComponent)
      },
      {
        path: 'RuleGroup',
        title: 'User Type',
        loadComponent: () => import('./Modules/Admin/RuleGroup/RuleGroup.component').then(m => m.RuleGroupComponent)
      },
      {
        path: 'AttendanceAndDepartureDevices',
        title: 'Attendance Devices',
        loadComponent: () => import('./Modules/HR/AttendanceAndDepartureDevices/AttendanceAndDepartureDevices.component').then(m => m.AttendanceAndDepartureDevicesComponent)
      },
      {
        path: 'AttendanceRecord',
        title: 'Attendance Records',
        loadComponent: () => import('./Modules/HR/AttendanceRecord/AttendanceRecord.component').then(m => m.AttendanceRecordComponent)
      },
      {
        path: 'ALLOWANCES',
        title: 'Allowances',
        loadComponent: () => import('./Modules/HR/Allowance/Allowance.component').then(m => m.AllowanceComponent)
      }
      ,
      {
        path: 'SomeEmployRule',
        title: 'Special Schedules',
        loadComponent: () => import('./Modules/HR/SomeEmployRule/SomeEmployRule.component').then(m => m.SomeEmployRuleComponent)
      }
      ,
      {
        path: 'shifts',
        title: 'Work Shifts',
        loadComponent: () => import('./Modules/HR/Shifts/Shifts.component').then(m => m.ShiftsComponent)
      }
      ,
      {
        path: 'AttendanceCalculator',
        title: 'Hours Calculator',
        loadComponent: () => import('./Modules/HR/AttendanceCalculator/AttendanceCalculator.component').then(m => m.AttendanceCalculatorComponent)
      }
      ,
      {
        path: 'WareHouses',
        title: 'Warehouses',
        loadComponent: () => import('./Modules/Inventory/WareHouses/WareHouses.component').then(m => m.WareHousesComponent)
      }
      ,
      {
        path: 'Category',
        title: 'Categories',
        loadComponent: () => import('./Modules/Inventory/Category/Category.component').then(m => m.CategoryComponent)
      }
      ,
      {
        path: 'Items',
        title: 'Items',
        loadComponent: () => import('./Modules/Inventory/Items/Items.component').then(m => m.ItemsComponent)

      }
      ,
      {
        path: 'Units',
        title: 'Units of Measurement',
        loadComponent: () => import('./Modules/Inventory/UnitsControl/UnitsControl.component').then(m => m.UnitsControlComponent)
      }
      ,
      {
        path: 'OperationList',
        title: 'Warehouse Operations',
        loadComponent: () => import('./Modules/Inventory/OperationList/OperationList.component').then(m => m.OperationListComponent)
      }
      ,
      {
        path: 'Operation',
        data: { ID: 0 },
        title: 'Warehouse Operation',
        loadComponent: () => import('./Modules/Inventory/Operation/Operation.component').then(m => m.OperationComponent)
      }
      ,
      {
        path: 'Raspy',
        data: { ID: 0 },
        title: 'Item Components',
        loadComponent: () => import('./Modules/Inventory/Raspy/Raspy.component').then(m => m.RaspyComponent)
      }
      ,
      {
        path: 'ItemsInRaspy',
        data: { ItemId: 0, RaspyId: 0 },
        title: 'Item Components',
        loadComponent: () => import('./Modules/Inventory/ItemsInRaspy/ItemsInRaspy.component').then(m => m.ItemsInRaspyComponent)
      }
      ,
      {
        path: 'Season',
        title: 'Seasons',
        loadComponent: () => import('./Modules/Seals/Season/Season.component').then(m => m.SeasonComponent)
      }
      ,
      {
        path: 'Customer',
        data: { Type: 0 },
        title: 'Customers',
        loadComponent: () => import('./Modules/Seals/Customer/Customer.component').then(m => m.CustomerComponent)
      }
      ,
      {
        path: 'SpecialPrice',
        title: 'Special Prices',
        loadComponent: () => import('./Modules/Seals/SpeciaPrice/SpeciaPrice.component').then(m => m.SpeciaPriceComponent)
      }
      ,
      {
        path: 'SpecialDescound',
        title: 'Special Discounts',
        loadComponent: () => import('./Modules/Seals/SpecialDescound/SpecialDescound.component').then(m => m.SpecialDescoundComponent)
      }
      ,
      {
        path: 'InvoiceList',
        title: 'Invoices',
        loadComponent: () => import('./Modules/Seals/InvoiceList/InvoiceList.component').then(m => m.InvoiceListComponent)
      }
      ,
      {
        path: 'Invoice',
        data: { ID: 0 },
        title: 'Invoice',
        loadComponent: () => import('./Modules/Seals/Invoice/Invoice.component').then(m => m.InvoiceComponent)

      }
      ,
      {
        path: 'Cashier',
        title: 'Cashier',
        loadComponent: () => import('./Modules/Seals/Cashier/Cashier.component').then(m => m.RestaurantCashierComponent)
      }
      ,

      {
        path: 'Requstes',
        data: { ID: 0 },
        title: 'Orders',
        loadComponent: () => import('./Modules/Seals/Requstes/Requstes.component').then(m => m.RequstesComponent)

      }
      ,
      {
        path: 'RequstesList',
        title: 'Orders List',
        loadComponent: () => import('./Modules/Seals/RequstesList/RequstesList.component').then(m => m.RequstesListComponent)
      }

      ,
      {
        path: 'Accounts',
        title: 'Accounts',
        loadComponent: () => import('./Modules/Accounts/Accounts/Accounts.component').then(m => m.AccountsComponent)
      }
      ,
      {
        path: 'AccountTypeOperations',
        title: 'Operation Types',
        loadComponent: () => import('./Modules/Accounts/AccountTypeOperations/AccountTypeOperations.component').then(m => m.AccountTypeOperationsComponent)
      }
      ,
      {
        path: 'AccountOperationList',
        title: 'Accounting Entries',
        loadComponent: () => import('./Modules/Accounts/AccountOperationList/AccountOperationList.component').then(m => m.AccountOperationListComponent)
      }
      ,
      {
        path: 'AccountOperation',
        data: { ID: 0 },
        title: 'Accounting Entry',
        loadComponent: () => import('./Modules/Accounts/AccountOperation/AccountOperation.component').then(m => m.AccountOperationComponent)
      }
      ,
      {
        path: 'Report',
        title: 'Reports',
        loadComponent: () => import('./Modules/Report/Report.component').then(m => m.ReportComponent)
      }


    ]
  }
  ,
  {
    path: 'Show_QR',
    data: { TEXT: '', TYPE: '' },
    title: 'Display',
    loadComponent: () => import('./shared/pages/Show_QR_Code/Show_QR_Code.component').then(m => m.Show_QR_CodeComponent)
  },
  { path: '**', redirectTo: 'Main/Home', pathMatch: 'full' }
];