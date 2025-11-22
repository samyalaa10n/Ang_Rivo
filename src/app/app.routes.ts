import { Routes } from '@angular/router';
import { authGuard } from './shared/Gurd/auth.guard';
import { MainComponent } from './Modules/LayOut/Main/Main.component';
import { LoginComponent } from './Modules/Admin/Login/Login.component';
import { ReportComponent } from './Modules/Report/Report.component';
import { AccountOperationComponent } from './Modules/Accounts/AccountOperation/AccountOperation.component';
import { AccountOperationListComponent } from './Modules/Accounts/AccountOperationList/AccountOperationList.component';
import { AccountTypeOperationsComponent } from './Modules/Accounts/AccountTypeOperations/AccountTypeOperations.component';
import { AccountsComponent } from './Modules/Accounts/Accounts/Accounts.component';
import { RequstesListComponent } from './Modules/Seals/RequstesList/RequstesList.component';
import { RequstesComponent } from './Modules/Seals/Requstes/Requstes.component';
import { WareHousesComponent } from './Modules/Inventory/WareHouses/WareHouses.component';
import { CategoryComponent } from './Modules/Inventory/Category/Category.component';
import { ItemsComponent } from './Modules/Inventory/Items/Items.component';
import { OperationListComponent } from './Modules/Inventory/OperationList/OperationList.component';
import { OperationComponent } from './Modules/Inventory/Operation/Operation.component';
import { SeasonComponent } from './Modules/Seals/Season/Season.component';
import { CustomerComponent } from './Modules/Seals/Customer/Customer.component';
import { SpeciaPriceComponent } from './Modules/Seals/SpeciaPrice/SpeciaPrice.component';
import { SpecialDescoundComponent } from './Modules/Seals/SpecialDescound/SpecialDescound.component';
import { InvoiceListComponent } from './Modules/Seals/InvoiceList/InvoiceList.component';
import { InvoiceComponent } from './Modules/Seals/Invoice/Invoice.component';
import { HomeComponent } from './Modules/LayOut/Home/Home.component';
import { RestaurantCashierComponent } from './Modules/Seals/Cashier/Cashier.component';



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
        path: 'Suits',
        title: 'البدلات',
        loadComponent: () => import('./Modules/HR/Suits/Suits.component').then(m => m.SuitsComponent)
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
        component: WareHousesComponent
      }
      ,
      {
        path: 'Category',
        title: 'التصنيفات',
        component: CategoryComponent
      }
      ,
      {
        path: 'Items',
        title: 'الأصناف',
        component: ItemsComponent
      }
      ,
      {
        path: 'OperationList',
        title: 'العمليات المخزنية',

        component: OperationListComponent
      }
      ,
      {
        path: 'Operation',
        data: { ID: 0 },
        title: 'عملية مخزنية',
        component: OperationComponent
      }
      ,
      {
        path: 'Season',
        title: 'المواسم',
        component: SeasonComponent
      }
      ,
      {
        path: 'Customer',
        title: 'العملاء',
        component: CustomerComponent
      }
      ,
      {
        path: 'SpecialPrice',
        title: 'اسعار خاصة',
        component: SpeciaPriceComponent
      }
      ,
      {
        path: 'SpecialDescound',
        title: 'نسب خصم خاصة',
        component: SpecialDescoundComponent
      }
      ,
      {
        path: 'InvoiceList',
        title: 'الفواتير',
        component: InvoiceListComponent
      }
      ,
      {
        path: 'Invoice',
        data: { ID: 0 },
        title: 'فاتورة',
        component: InvoiceComponent
      }
      ,
      {
        path: 'Requstes',
        data: { ID: 0 },
        title: 'الطلبيات',
        component: RequstesComponent
      }
      ,
      {
        path: 'RequstesList',
        title: 'الطلبيات',
        component: RequstesListComponent
      }

      ,
      {
        path: 'Accounts',
        title: 'الحسابات',
        component: AccountsComponent
      }
      ,
      {
        path: 'AccountTypeOperations',
        title: 'انواع العمليات المحاسبية',
        component: AccountTypeOperationsComponent
      }
      ,
      {
        path: 'AccountOperationList',
        title: 'القيود المحاسبية',
        component: AccountOperationListComponent
      }
      ,
      {
        path: 'AccountOperation',
        data: { ID: 0 },
        title: 'قيد محاسبي',
        component: AccountOperationComponent
      }
      ,
      {
        path: 'Report',
        title: 'التقارير',
        component: ReportComponent
      }
      ,
      {
        path: 'Cashier',
        title: 'الكاشير',
        component: RestaurantCashierComponent
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

