import { Routes } from '@angular/router';
import { authGuard } from './shared/Gurd/auth.guard';
import { MainComponent } from './Modules/LayOut/Main/Main.component';
import { LoginComponent } from './Modules/Admin/Login/Login.component';
import { HomeComponent } from './Modules/LayOut/Home/Home.component';
import { AtivateItemsControlComponent } from './Modules/Inventory/AtivateItemsControl/AtivateItemsControl.component';
import { RequestPrintComponentComponent } from './shared/pages/RequestPrintComponent/RequestPrintComponent.component';
import { EffectInSystemComponent } from './Modules/HR/EffectInSystem/EffectInSystem.component';
import { ColumnEffectComponent } from './Modules/HR/ColumnEffect/ColumnEffect.component';
import { EmploysRecodesComponent } from './Modules/HR/EmployesRecordies/EmploysRecodes.component';
import { EmployesComponent } from './Modules/HR/Employes/Employes.component';
import { CompanyComponent } from './Modules/FactoryBase/Company/Company.component';
import { DepartComponent } from './Modules/FactoryBase/Depart/Depart.component';
import { PlaceComponent } from './Modules/FactoryBase/Place/Place.component';
import { MangementComponent } from './Modules/FactoryBase/Mangement/Mangement.component';
import { HolidayRecodesComponent } from './Modules/HR/holidayRecords/holidayRecords.component';
import { ForgatInOutComponent } from './Modules/HR/ForgatInOut/ForgatInOut.component';
import { EffectRecodesComponent } from './Modules/HR/EffectRecodes/EffectRecodes.component';
import { EffectComponent } from './Modules/HR/Effect/Effect.component';
import { UserComponent } from './Modules/Admin/User/User.component';
import { RuleGroupComponent } from './Modules/Admin/RuleGroup/RuleGroup.component';
import { AttendanceAndDepartureDevicesComponent } from './Modules/HR/AttendanceAndDepartureDevices/AttendanceAndDepartureDevices.component';
import { AttendanceRecordComponent } from './Modules/HR/AttendanceRecord/AttendanceRecord.component';
import { AllowanceComponent } from './Modules/HR/Allowance/Allowance.component';
import { SomeEmployRuleComponent } from './Modules/HR/SomeEmployRule/SomeEmployRule.component';
import { ShiftsComponent } from './Modules/HR/Shifts/Shifts.component';
import { AttendanceCalculatorComponent } from './Modules/HR/AttendanceCalculator/AttendanceCalculator.component';
import { WareHousesComponent } from './Modules/Inventory/WareHouses/WareHouses.component';
import { CategoryComponent } from './Modules/Inventory/Category/Category.component';
import { ItemsComponent } from './Modules/Inventory/Items/Items.component';
import { UnitsControlComponent } from './Modules/Inventory/UnitsControl/UnitsControl.component';
import { OperationListComponent } from './Modules/Inventory/OperationList/OperationList.component';
import { OperationComponent } from './Modules/Inventory/Operation/Operation.component';
import { RaspyComponent } from './Modules/Inventory/Raspy/Raspy.component';
import { ItemsInRaspyComponent } from './Modules/Inventory/ItemsInRaspy/ItemsInRaspy.component';
import { SeasonComponent } from './Modules/Seals/Season/Season.component';
import { CustomerComponent } from './Modules/Seals/Customer/Customer.component';
import { SpeciaPriceComponent } from './Modules/Seals/SpeciaPrice/SpeciaPrice.component';
import { SpecialDescoundComponent } from './Modules/Seals/SpecialDescound/SpecialDescound.component';
import { InvoiceListComponent } from './Modules/Seals/InvoiceList/InvoiceList.component';
import { InvoiceComponent } from './Modules/Seals/Invoice/Invoice.component';
import { RestaurantCashierComponent } from './Modules/Seals/Cashier/Cashier.component';
import { RequstesComponent } from './Modules/Seals/Requstes/Requstes.component';
import { RequstesListComponent } from './Modules/Seals/RequstesList/RequstesList.component';
import { AccountsComponent } from './Modules/Accounts/Accounts/Accounts.component';
import { AccountTypeOperationsComponent } from './Modules/Accounts/AccountTypeOperations/AccountTypeOperations.component';
import { AccountOperationListComponent } from './Modules/Accounts/AccountOperationList/AccountOperationList.component';
import { AccountOperationComponent } from './Modules/Accounts/AccountOperation/AccountOperation.component';
import { ReportComponent } from './Modules/Report/Report.component';
import { Show_QR_CodeComponent } from './shared/pages/Show_QR_Code/Show_QR_Code.component';

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
    path: 'ShowImages',
    data: { Id: '' },
    loadComponent: () => import('./shared/pages/ShowImages/ShowImages.component').then(m => m.ShowImagesComponent)
  },
  {
    path: 'Main',
    title: 'Dashboard',
    canActivateChild: [authGuard],
    component: MainComponent,
    children: [
      {
        path: 'AtivateItems',
        data: { REQ: '' },
        component: AtivateItemsControlComponent
      },
      {
        path: 'RequestPrint',
        data: { REQ: '' },
        title: 'Print Reservations',
        component: RequestPrintComponentComponent
      },
      {
        path: 'EffectInSystem',
        title: 'System Effects',
        component: EffectInSystemComponent
      },
      {
        path: 'ColumnEffect',
        title: 'Effect Items',
        component: ColumnEffectComponent
      },
      {
        path: 'Employs',
        title: 'Employees List',
        component: EmploysRecodesComponent
      },
      {
        path: 'Employs/Control',
        title: 'Employee Data',
        component: EmployesComponent
      },
      {
        path: 'Companies',
        title: 'Companies',
        component: CompanyComponent
      },
      {
        path: 'Departs',
        title: 'Departments',
        component: DepartComponent
      },
      {
        path: 'Places',
        title: 'Work Places',
        component: PlaceComponent
      },
      {
        path: 'Mangements',
        title: 'Organizational Structure',
        component: MangementComponent
      },
      {
        path: 'Holiday',
        title: 'Holidays Registration',
        component: HolidayRecodesComponent
      },
      {
        path: 'ForgatInOut',
        title: 'Attendance Deficiencies',
        component: ForgatInOutComponent
      },
      {
        path: 'Effects',
        title: 'Effects',
        component: EffectRecodesComponent
      },
      {
        path: 'Effects/Add',
        title: 'Add Effect',
        component: EffectComponent
      },
      {
        path: 'Users',
        title: 'Users',
        component: UserComponent
      },
      {
        path: 'RuleGroup',
        title: 'User Type',
        component: RuleGroupComponent
      },
      {
        path: 'AttendanceAndDepartureDevices',
        title: 'Attendance Devices',
        component: AttendanceAndDepartureDevicesComponent
      },
      {
        path: 'AttendanceRecord',
        title: 'Attendance Records',
        component: AttendanceRecordComponent
      },
      {
        path: 'ALLOWANCES',
        title: 'Allowances',
        component: AllowanceComponent
      },
      {
        path: 'SomeEmployRule',
        title: 'Special Schedules',
        component: SomeEmployRuleComponent
      },
      {
        path: 'shifts',
        title: 'Work Shifts',
        component: ShiftsComponent
      },
      {
        path: 'AttendanceCalculator',
        title: 'Hours Calculator',
        component: AttendanceCalculatorComponent
      },
      {
        path: 'WareHouses',
        title: 'Warehouses',
        component: WareHousesComponent
      },
      {
        path: 'Category',
        title: 'Categories',
        component: CategoryComponent
      },
      {
        path: 'Items',
        title: 'Items',
        component: ItemsComponent
      },
      {
        path: 'Units',
        title: 'Units of Measurement',
        component: UnitsControlComponent
      },
      {
        path: 'OperationList',
        title: 'Warehouse Operations',
        component: OperationListComponent
      },
      {
        path: 'Operation',
        data: { ID: 0 },
        title: 'Warehouse Operation',
        component: OperationComponent
      },
      {
        path: 'Raspy',
        data: { ID: 0 },
        title: 'Item Components',
        component: RaspyComponent
      },
      {
        path: 'ItemsInRaspy',
        data: { ItemId: 0, RaspyId: 0 },
        title: 'Item Components',
        component: ItemsInRaspyComponent
      },
      {
        path: 'Season',
        title: 'Seasons',
        component: SeasonComponent
      },
      {
        path: 'Customer',
        data: { Type: 0 },
        title: 'Customers',
        component: CustomerComponent
      },
      {
        path: 'SpecialPrice',
        title: 'Special Prices',
        component: SpeciaPriceComponent
      },
      {
        path: 'SpecialDescound',
        title: 'Special Discounts',
        component: SpecialDescoundComponent
      },
      {
        path: 'InvoiceList',
        title: 'Invoices',
        component: InvoiceListComponent
      },
      {
        path: 'Invoice',
        data: { ID: 0 },
        title: 'Invoice',
        component: InvoiceComponent
      },
      {
        path: 'Cashier',
        title: 'Cashier',
        component: RestaurantCashierComponent
      },
      {
        path: 'Requstes',
        data: { ID: 0 },
        title: 'Orders',
        component: RequstesComponent
      },
      {
        path: 'RequstesList',
        title: 'Orders List',
        component: RequstesListComponent
      },
      {
        path: 'Accounts',
        title: 'Accounts',
        component: AccountsComponent
      },
      {
        path: 'AccountTypeOperations',
        title: 'Operation Types',
        component: AccountTypeOperationsComponent
      },
      {
        path: 'AccountOperationList',
        title: 'Accounting Entries',
        component: AccountOperationListComponent
      },
      {
        path: 'AccountOperation',
        data: { ID: 0 },
        title: 'Accounting Entry',
        component: AccountOperationComponent
      },
      {
        path: 'Report',
        title: 'Reports',
        component: ReportComponent
      }
    ]
  },
  {
    path: 'Show_QR',
    data: { TEXT: '', TYPE: '' },
    title: 'Display',
    component: Show_QR_CodeComponent
  },
  { path: '**', redirectTo: 'Main/Home', pathMatch: 'full' }
];