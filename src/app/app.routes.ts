import { Routes } from '@angular/router';
import { authGuard } from './shared/Gurd/auth.guard';
import { MainComponent } from './Modules/LayOut/Main/Main.component';
import { LoginComponent } from './Modules/Admin/Login/Login.component';
import { HomeComponent } from './Modules/LayOut/Home/Home.component';




export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  {
    path: 'Login',
    title: 'تسجيل الدخول',
    component: LoginComponent
  },
  {
    path: 'Home',
    title: 'الترحيب',
    component: HomeComponent
  },
  {
    path: 'Main',
    title: 'الرئيسية',
    canActivateChild: [authGuard],
    component: MainComponent,
    children: [

      {
        path: 'EffectInSystem',
        title: 'مؤثرات النظام',
        loadComponent: () => import('./Modules/HR/EffectInSystem/EffectInSystem.component').then(m => m.EffectInSystemComponent)
      },
      {
        path: 'ColumnEffect',
        title: 'بنود المؤثر',
        loadComponent: () => import('./Modules/HR/ColumnEffect/ColumnEffect.component').then(m => m.ColumnEffectComponent)
      },
      {
        path: 'Employs',
        title: 'قائمة الموظفين',
        loadComponent: () => import('./Modules/HR/EmployesRecordies/EmploysRecodes.component').then(m => m.EmploysRecodesComponent)
      },
      {
        path: 'Employs/Control',
        title: 'بيانات الموظف',
        loadComponent: () => import('./Modules/HR/Employes/Employes.component').then(m => m.EmployesComponent)
      },
      {
        path: 'Companies',
        title: 'الشركات',
        loadComponent: () => import('./Modules/FactoryBase/Company/Company.component').then(m => m.CompanyComponent)
      },
      {
        path: 'Departs',
        title: 'الأقسام',
        loadComponent: () => import('./Modules/FactoryBase/Depart/Depart.component').then(m => m.DepartComponent)
      },
      {
        path: 'Places',
        title: 'أماكن العمل',
        loadComponent: () => import('./Modules/FactoryBase/Place/Place.component').then(m => m.PlaceComponent)
      },
      {
        path: 'Mangements',
        title: 'الهيكل الإداري',
        loadComponent: () => import('./Modules/FactoryBase/Mangement/Mangement.component').then(m => m.MangementComponent)
      },
      {
        path: 'Holiday',
        title: 'تسجيل الإجازات',
        loadComponent: () => import('./Modules/HR/holidayRecords/holidayRecords.component').then(m => m.HolidayRecodesComponent)
      },
      {
        path: 'ForgatInOut',
        title: 'نواقص الحضور والانصراف',
        loadComponent: () => import('./Modules/HR/ForgatInOut/ForgatInOut.component').then(m => m.ForgatInOutComponent)
      },
      {
        path: 'Effects',
        title: 'المؤثرات',
        loadComponent: () => import('./Modules/HR/EffectRecodes/EffectRecodes.component').then(m => m.EffectRecodesComponent)
      },
      {
        path: 'Effects/Add',
        title: 'إضافة مؤثر',
        loadComponent: () => import('./Modules/HR/Effect/Effect.component').then(m => m.EffectComponent)
      },
      {
        path: 'Users',
        title: 'المستخدمين',
        loadComponent: () => import('./Modules/Admin/User/User.component').then(m => m.UserComponent)
      },
      {
        path: 'RuleGroup',
        title: 'نوع المستخدم',
        loadComponent: () => import('./Modules/Admin/RuleGroup/RuleGroup.component').then(m => m.RuleGroupComponent)
      },
      {
        path: 'AttendanceAndDepartureDevices',
        title: 'أجهزة الحضور والانصراف',
        loadComponent: () => import('./Modules/HR/AttendanceAndDepartureDevices/AttendanceAndDepartureDevices.component').then(m => m.AttendanceAndDepartureDevicesComponent)
      },
      {
        path: 'AttendanceRecord',
        title: 'سجل الحضور والانصراف',
        loadComponent: () => import('./Modules/HR/AttendanceRecord/AttendanceRecord.component').then(m => m.AttendanceRecordComponent)
      },
      {
        path: 'ALLOWANCES',
        title: 'البدلات',
        loadComponent: () => import('./Modules/HR/Allowance/Allowance.component').then(m => m.AllowanceComponent)
      }
      ,
      {
        path: 'SomeEmployRule',
        title: 'مواعيد خاصة',
        loadComponent: () => import('./Modules/HR/SomeEmployRule/SomeEmployRule.component').then(m => m.SomeEmployRuleComponent)
      }
      ,
      {
        path: 'shifts',
        title: 'ورديات العمل',
        loadComponent: () => import('./Modules/HR/Shifts/Shifts.component').then(m => m.ShiftsComponent)
      }
      ,
      {
        path: 'AttendanceCalculator',
        title: 'حساب الساعات',
        loadComponent: () => import('./Modules/HR/AttendanceCalculator/AttendanceCalculator.component').then(m => m.AttendanceCalculatorComponent)
      }
      ,
      {
        path: 'WareHouses',
        title: 'المخازن',
        loadComponent: () => import('./Modules/Inventory/WareHouses/WareHouses.component').then(m => m.WareHousesComponent)
      }
      ,
      {
        path: 'Category',
        title: 'التصنيفات',
        loadComponent: () => import('./Modules/Inventory/Category/Category.component').then(m => m.CategoryComponent)
      }
      ,
      {
        path: 'Items',
        title: 'الأصناف',
        loadComponent: () => import('./Modules/Inventory/Items/Items.component').then(m => m.ItemsComponent)

      }
      ,
      {
        path: 'Units',
        title: 'وحدات القياس',
        loadComponent: () => import('./Modules/Inventory/UnitsControl/UnitsControl.component').then(m => m.UnitsControlComponent)
      }
      ,
      {
        path: 'OperationList',
        title: 'العمليات المخزنية',
        loadComponent: () => import('./Modules/Inventory/OperationList/OperationList.component').then(m => m.OperationListComponent)
      }
      ,
      {
        path: 'Operation',
        data: { ID: 0 },
        title: 'عملية مخزنية',
        loadComponent: () => import('./Modules/Inventory/Operation/Operation.component').then(m => m.OperationComponent)
      }
      ,
      {
        path: 'Raspy',
        data: { ID: 0 },
        title: 'مكونات الصنف',
        loadComponent: () => import('./Modules/Inventory/Raspy/Raspy.component').then(m => m.RaspyComponent)
      }
      ,
      {
        path: 'ItemsInRaspy',
        data: { ItemId: 0, RaspyId: 0 },
        title: 'مكونات الصنف',
        loadComponent: () => import('./Modules/Inventory/ItemsInRaspy/ItemsInRaspy.component').then(m => m.ItemsInRaspyComponent)
      }
      ,
      {
        path: 'Season',
        title: 'المواسم',
        loadComponent: () => import('./Modules/Seals/Season/Season.component').then(m => m.SeasonComponent)
      }
      ,
      {
        path: 'Customer',
        data: { Type: 0 },
        title: 'العملاء',
        loadComponent: () => import('./Modules/Seals/Customer/Customer.component').then(m => m.CustomerComponent)
      }
      ,
      {
        path: 'SpecialPrice',
        title: 'اسعار خاصة',
        loadComponent: () => import('./Modules/Seals/SpeciaPrice/SpeciaPrice.component').then(m => m.SpeciaPriceComponent)
      }
      ,
      {
        path: 'SpecialDescound',
        title: 'نسب خصم خاصة',
        loadComponent: () => import('./Modules/Seals/SpecialDescound/SpecialDescound.component').then(m => m.SpecialDescoundComponent)
      }
      ,
      {
        path: 'InvoiceList',
        title: 'الفواتير',
        loadComponent: () => import('./Modules/Seals/InvoiceList/InvoiceList.component').then(m => m.InvoiceListComponent)
      }
      ,
      {
        path: 'Invoice',
        data: { ID: 0 },
        title: 'فاتورة',
        loadComponent: () => import('./Modules/Seals/Invoice/Invoice.component').then(m => m.InvoiceComponent)

      }
      ,
      {
        path: 'Cashier',
        title: 'الكاشير',
        loadComponent: () => import('./Modules/Seals/Cashier/Cashier.component').then(m => m.RestaurantCashierComponent)
      }
      ,

      {
        path: 'Requstes',
        data: { ID: 0 },
        title: 'الطلبيات',
        loadComponent: () => import('./Modules/Seals/Requstes/Requstes.component').then(m => m.RequstesComponent)

      }
      ,
      {
        path: 'RequstesList',
        title: 'الطلبيات',
        loadComponent: () => import('./Modules/Seals/RequstesList/RequstesList.component').then(m => m.RequstesListComponent)
      }

      ,
      {
        path: 'Accounts',
        title: 'الحسابات',
        loadComponent: () => import('./Modules/Accounts/Accounts/Accounts.component').then(m => m.AccountsComponent)
      }
      ,
      {
        path: 'AccountTypeOperations',
        title: 'انواع العمليات المحاسبية',
        loadComponent: () => import('./Modules/Accounts/AccountTypeOperations/AccountTypeOperations.component').then(m => m.AccountTypeOperationsComponent)
      }
      ,
      {
        path: 'AccountOperationList',
        title: 'القيود المحاسبية',
        loadComponent: () => import('./Modules/Accounts/AccountOperationList/AccountOperationList.component').then(m => m.AccountOperationListComponent)
      }
      ,
      {
        path: 'AccountOperation',
        data: { ID: 0 },
        title: 'قيد محاسبي',
        loadComponent: () => import('./Modules/Accounts/AccountOperation/AccountOperation.component').then(m => m.AccountOperationComponent)
      }
      ,
      {
        path: 'Report',
        title: 'التقارير',
        loadComponent: () => import('./Modules/Report/Report.component').then(m => m.ReportComponent)
      }


    ]
  }
  ,
  {
    path: 'Show_QR',
    data: { TEXT: '', TYPE: '' },
    title: 'عرض',
    loadComponent: () => import('./shared/pages/Show_QR_Code/Show_QR_Code.component').then(m => m.Show_QR_CodeComponent)
  },
  { path: '**', redirectTo: 'Main/Home', pathMatch: 'full' }
];

