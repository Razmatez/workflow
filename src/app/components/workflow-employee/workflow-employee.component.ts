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
  /*color = 'primary';
  mode = 'indeterminate';
  value = 0;*/

  color = 'primary';
  mode = 'query';

  @Input() employee: Employee;
  @Input() calendar: number;
  @Input() rateTypes: any;
  @Input() wfDays: any[];

  errorMessage: string;
  skip: number;
  limit: number;
  total: number;

  canEdit: boolean;

  timesheets: any;
  timesheetsLoading: boolean;

  columnHeaders: any;

  constructor(
    private elmsApi: ElmsApiService,
    public dialog: MdDialog) {
  }

  ngOnInit() {

    this.columnHeaders = [
      { 'Description': 'Normal Time', 'RateTypeID': 2 },
      { 'Description': 'Overtime 1.00', 'RateTypeID': 7 },
      { 'Description': 'Overtime 2.00', 'RateTypeID': 10 },
      { 'Description': 'Breaks', 'RateTypeID': 15 },
      { 'Description': 'Shift Allowance', 'RateTypeID': 23 },
    ];

    this.skip = 0;
    this.limit = 20;
    this.total = 0;

    this.getTimesheets();

    this.canEdit = false;

    this.componentLoading = false;
  }

  getTimesheets() {
    this.timesheetsLoading = true;

    if (!this.employee) {
      return;
    }

    this.elmsApi.getTimesheets(
      this.skip,
      this.limit,
      this.employee.contractorderEmployeeID,
      this.calendar)
      .subscribe(
        result => {
          this.total = result.total;
          this.timesheets = result.result;
          this.addMissingDates();
        },
        error => {
          this.errorMessage = <any>error;
          this.timesheetsLoading = false;
        })
  }

  addMissingDates() {
    // console.log(this.employee.coeDetails);
    const count = this.wfDays.length;

    for (let i = 0; i < count; i++) {
      if (_.findIndex(this.timesheets, { timesheet: { Date: this.wfDays[i].format('YYYY-MM-DDTHH:mm:ss') } }) < 0) {

        this.timesheets.push(
          {
            'timesheet': {
              'Date': this.wfDays[i].format('YYYY-MM-DDTHH:mm:ss')
            },
            'Total': {
                'TimeValue': 0,
                'PayValue': 0,
                'BillValue': 0,
                'Breakdown': []
            },
            'contractOrderEmployeeDetails': _.cloneDeep(this.employee.coeDetails),
            'Breakdown': {
              'strS': '00:00',
              'strB': '00:00',
              'strF': '00:00',
            }
          })
      }
      if ( i === count - 1 ) {
        this.timesheetsLoading = false;
      }
    }
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
