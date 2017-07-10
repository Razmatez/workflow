import { Component, OnInit, Input } from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';

import { ElmsTimesheetpopupComponent } from '../elms-timesheetpopup/elms-timesheetpopup.component';

import * as _ from 'lodash';
import * as moment from 'moment';

import { Employee } from '../../models/employee';
import { ElmsApiService } from '../../services/elms-api.service';

@Component({
  selector: 'app-workflow-employee',
  templateUrl: './workflow-employee.component.html',
  styleUrls: ['./workflow-employee.component.css']
})
export class WorkflowEmployeeComponent implements OnInit {
  // loader
  componentLoading: boolean;

  color = 'primary';
  mode = 'query';

  @Input() employee: Employee;
  @Input() rateTypes: any;
  @Input() wfDays: any[];
  @Input() wfTemplateId: number;

  errorMessage: string;
  skip: number;
  limit: number;
  total: number;

  canEdit: boolean;

  timesheets: any;
  timesheetsLoading: boolean;

  columnHeaders: any;
  columnHeadersWeekly: any;

  constructor(
    private elmsApi: ElmsApiService,
    public dialog: MdDialog) {
  }

  ngOnInit() {

    this.columnHeaders = [
      { 'Description': 'Normal Time', 'RateTypeID': 2 },
      { 'Description': 'Overtime 1.00', 'RateTypeID': 7 },
      { 'Description': 'Overtime 1.50', 'RateTypeID': 9 },
      { 'Description': 'Overtime 2.00', 'RateTypeID': 10 },
      { 'Description': 'Sunday Time', 'RateTypeID': 1009 },
      { 'Description': 'Shift Allowance', 'RateTypeID': 23 },
      { 'Description': 'Public Holiday Worked', 'RateTypeID': 14 },
      { 'Description': 'Public Holiday Paid', 'RateTypeID': 11 }
    ];

    this.columnHeadersWeekly = [
      { 'Description': 'Normal Time', 'RateTypeID': 2 },
      { 'Description': 'Overtime 1.00', 'RateTypeID': 7 },
      { 'Description': 'Overtime 1.50', 'RateTypeID': 9 },
      { 'Description': 'Overtime 2.00', 'RateTypeID': 10 },
      { 'Description': 'Sunday Time', 'RateTypeID': 1009 },
      { 'Description': 'Shift Allowance', 'RateTypeID': 23 },
      { 'Description': 'Public Holiday Worked', 'RateTypeID': 14 },
      { 'Description': 'Public Holiday Paid', 'RateTypeID': 11 },
      { 'Description': 'Annual Leave', 'RateTypeID': 33 },
      { 'Description': 'Sick Leave', 'RateTypeID': 34 },
      { 'Description': 'Family Responsibility', 'RateTypeID': 36 }
    ];

    this.skip = 0;
    this.limit = 20;
    this.total = 0;

    this.timesheetsLoading = this.employee.timesheetsLoading;
    this.timesheets = this.employee.timesheets;

    this.canEdit = false;

    this.componentLoading = false;
  }

  openDialog() {
    const config = new MdDialogConfig();
    const dialogRef = this.dialog.open(ElmsTimesheetpopupComponent, config);
    dialogRef.afterClosed().subscribe(result => {

    });

    const coeid = this.employee.contractorderEmployeeID;
    const period = this.wfDays[0].format('DD MMM YYYY') + ' to ' + this.wfDays[0].add(7, 'day').format('DD MMM YYYY')

    dialogRef.componentInstance.contractOrderEmployeeID = coeid
    dialogRef.componentInstance.period = period;
    // dialogRef.componentInstance.period = '12 Jun 2017 to 18 Jun 2017';
  }

}
