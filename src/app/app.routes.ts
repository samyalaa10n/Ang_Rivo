import { Routes } from '@angular/router';
import { MainComponent } from './Modules/LayOut/Main/Main.component';
import { CompanyComponent } from './Modules/FactoryBase/Company/Company.component';
import { DepartComponent } from './Modules/FactoryBase/Depart/Depart.component';
import { PlaceComponent } from './Modules/FactoryBase/Place/Place.component';
import { MangementComponent } from './Modules/FactoryBase/Mangement/Mangement.component';
import { EmployesComponent } from './Modules/HR/Employes/Employes.component';
import { EffectInSystemComponent } from './Modules/HR/EffectInSystem/EffectInSystem.component';
import { ColumnEffectComponent } from './Modules/HR/ColumnEffect/ColumnEffect.component';
import { EffectComponent } from './Modules/HR/Effect/Effect.component';
import { EffectRecodesComponent } from './Modules/HR/EffectRecodes/EffectRecodes.component';
import { AccountComponent } from './Modules/Admin/Account/Account.component';
import { UserComponent } from './Modules/Admin/User/User.component';
import { LoginComponent } from './Modules/Admin/Login/Login.component';
import { HomeComponent } from './Modules/LayOut/Home/Home.component';
import { authGuard } from './shared/Gurd/auth.guard';
import { RuleGroupComponent } from './Modules/Admin/RuleGroup/RuleGroup.component';
import { ForgatInOutComponent } from './Modules/HR/ForgatInOut/ForgatInOut.component';
import { HolidayRecodesComponent } from './Modules/HR/holidayRecords/holidayRecords.component';
import { EmploysRecodesComponent } from './Modules/HR/EmployesRecordies/EmploysRecodes.component';

export const routes: Routes = [
    { path: '', redirectTo: 'Login', title: "الرئيسية", pathMatch: "full" },
    { path: 'Login',title:'تسجيل الدخول', component: LoginComponent },
    {
        path: 'Main', title: "الرئيسية",canActivate:[authGuard],canActivateChild:[authGuard], component: MainComponent, children: [
            { path: 'Home',title:'الترحيب', component: HomeComponent },
            { path: 'EffectInSystem',title:'مؤثرات النظام', component: EffectInSystemComponent },
            { path: 'ColumnEffect',title:'بنود المؤثر', component: ColumnEffectComponent },
            { path: 'Mangements',title:'الهيكل الاداري', component: MangementComponent },
            { path: 'Employs',title:'قائمة الموظفين', component: EmploysRecodesComponent },
            { path: 'Employs/Control',title:'بيانات الموظف', component: EmployesComponent },
            { path: 'Companies',title:'الشركات', component: CompanyComponent },
            { path: 'ForgatInOut',title:'نواقص الحضور و الانصراف', component: ForgatInOutComponent },
            { path: 'Holiday',title:'تسجيل الاجازات', component: HolidayRecodesComponent },
            { path: 'Places',title:'اماكن العمل', component: PlaceComponent },
            { path: 'Effects',title:'المؤثرات', component: EffectRecodesComponent },
            { path: 'Effects/Add',title:'اضافة مؤئثر', component: EffectComponent },
            { path: 'Departs',title:'الأقسام', component: DepartComponent },
            { path: 'Accounts',title:'الحسابات', component: AccountComponent },
            { path: 'Users',title:'المستخدمين', component: UserComponent },
            { path: 'RuleGroup',title:'نوع المستخدم', component: RuleGroupComponent },
        ]
    },
    { path: '**', redirectTo: 'Main', title: "الرئيسية", pathMatch: "full" }
];
