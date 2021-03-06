import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageModule } from 'angular-2-local-storage';

import { ElmsApiService } from './services/elms-api.service';
import { EmployeePopupService } from './services/employee-popup.service';

import { AppComponent } from './app.component';

import 'hammerjs';

import { WorkflowEmployeeComponent } from './components/workflow-employee/workflow-employee.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { WfHeaderComponent } from './components/wf-header/wf-header.component';
import { WorkflowComponent } from './components/workflow/workflow.component';
import {
  MdToolbarModule,
  MdIconModule,
  MdInputModule,
  MdCardModule,
  MdProgressSpinnerModule,
  MdChipsModule,
  MdProgressBarModule,
  MdDialogModule,
  MdButtonModule,
  MdSnackBarModule,
  MdSelectModule,
  MdTooltipModule
} from '@angular/material';

import { RateTypePipe } from './pipes/rate-type.pipe';
import { ColumnFilterPipe } from './pipes/column-filter.pipe';
import { DecimalToTimePipe } from './pipes/decimal-to-time.pipe';
import { WfDailyComponent } from './components/wf-daily/wf-daily.component';
import { OrderByPipe } from './pipes/order-by.pipe';
import { ElmsTimesheetpopupComponent } from './components/elms-timesheetpopup/elms-timesheetpopup.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { TimesheetStatusPipe } from './pipes/timesheet-status.pipe';
import { ElmsPlaceEmployeeComponent } from './components/elms-place-employee/elms-place-employee.component';
import { RateGroupTotalPipe } from './pipes/rate-group-total.pipe';
import { BillValueTotalPipe } from './pipes/bill-value-total.pipe';
import { PayValueTotalPipe } from './pipes/pay-value-total.pipe';
import { LoginComponent } from './components/login/login.component';
import { WfWeeklyComponent } from './components/wf-weekly/wf-weekly.component';
import { DailyTotalPipe } from './pipes/daily-total.pipe';
import { WfGrandtotalComponent } from './components/wf-grandtotal/wf-grandtotal.component';
import { BillValueGrandTotalPipe } from './pipes/bill-value-grand-total.pipe';
import { PayValueGrandTotalPipe } from './pipes/pay-value-grand-total.pipe';
import { RateGroupGrandTotalPipe } from './pipes/rate-group-grand-total.pipe';

const appRoutes = [
  { path: 'workflows', component: WorkflowComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    WorkflowEmployeeComponent,
    HeaderComponent,
    FooterComponent,
    WfHeaderComponent,
    WorkflowComponent,
    RateTypePipe,
    ColumnFilterPipe,
    DecimalToTimePipe,
    WfDailyComponent,
    OrderByPipe,
    ElmsTimesheetpopupComponent,
    SafeUrlPipe,
    TimesheetStatusPipe,
    ElmsPlaceEmployeeComponent,
    RateGroupTotalPipe,
    BillValueTotalPipe,
    PayValueTotalPipe,
    LoginComponent,
    WfWeeklyComponent,
    DailyTotalPipe,
    WfGrandtotalComponent,
    BillValueGrandTotalPipe,
    PayValueGrandTotalPipe,
    RateGroupGrandTotalPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
    MdToolbarModule,
    MdIconModule,
    MdInputModule,
    MdCardModule,
    MdProgressSpinnerModule,
    MdChipsModule,
    MdProgressBarModule,
    MdDialogModule,
    MdButtonModule,
    MdSnackBarModule,
    MdSelectModule,
    MdTooltipModule
  ],
  providers: [
    ElmsApiService,
    EmployeePopupService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ElmsTimesheetpopupComponent
  ]
})

export class AppModule { }
