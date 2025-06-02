import { Routes } from '@angular/router';
import { authGuard } from './shared/Gurd/auth.guard';
import { MainComponent } from './Modules/LayOut/Main/Main.component';
import { LoginComponent } from './Modules/Admin/Login/Login.component';



export const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  {
    path: 'Login',
    title: 'تسجيل الدخول',
    component: LoginComponent
  },
  {
    path: 'Main',
    title: 'الرئيسية',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    component: MainComponent,
    children: [
      {
        path: 'Home',
        title: 'الترحيب',
        loadComponent: () => import('./Modules/LayOut/Home/Home.component').then(m => m.HomeComponent)
      },
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
        path: 'Accounts',
        title: 'الحسابات',
        loadComponent: () => import('./Modules/Admin/Account/Account.component').then(m => m.AccountComponent)
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
    ]
  },
  { path: '**', redirectTo: 'Main', pathMatch: 'full' }
];

