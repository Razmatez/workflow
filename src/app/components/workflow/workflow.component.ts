import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ElmsApiService } from '../../services/elms-api.service';
import { Employee } from '../../models/employee';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as Q from 'Q';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})

export class WorkflowComponent implements OnInit {
  loading: boolean;
  @Output() setStructureID = new EventEmitter<number>();
  @Input() wfInstanceId: number;
  @Input() wfTemplateId: number;
  @Input() wfTrackId: number;

  errorMessage: string;
  wfInstance: any;

  wfTimesheetsLoading: boolean;

  wfEmployeesLoading: boolean;
  wfEmployees: Employee[];
  wfDays: any[];

  rateTypes: any;
  rateTypesLoading: boolean;

  skip: number;
  limit: number;
  total: number;

  pageSelector: number[];
  columnHeaders: any;
  columnHeadersWeekly: any;

  constructor(private elmsApi: ElmsApiService,
    private route: ActivatedRoute,
    private router: Router,
    private _ngZone: NgZone) {
    this.total = 0;
  }

  ngOnInit() {
    this.loading = true;
    this.skip = 0;
    this.limit = 10;
    this.wfDays = [];

    this.pageSelector = [
      10,
      20,
      50,
      100,
      200,
      500
    ]

    this.columnHeaders = [
      { 'Code': 'NH', 'Description': 'Normal Time', 'RateTypeID': 2 },
      { 'Code': 'OT15', 'Description': 'Overtime 1.50', 'RateTypeID': 9 },
      { 'Code': 'OT20', 'Description': 'Overtime 2.00', 'RateTypeID': 10 },
      { 'Code': 'SA', 'Description': 'Shift Allowance', 'RateTypeID': 23 },
      { 'Code': 'PHW', 'Description': 'Public Holiday Worked', 'RateTypeID': 14 },
      { 'Code': 'PHP', 'Description': 'Public Holiday Paid', 'RateTypeID': 11 }
    ];

    this.columnHeadersWeekly = [
      { 'Code': 'NH', 'Description': 'Normal Time', 'RateTypeID': 2 },
      { 'Code': 'OT15', 'Description': 'Overtime 1.50', 'RateTypeID': 9 },
      { 'Code': 'OT20', 'Description': 'Overtime 2.00', 'RateTypeID': 10 },
      { 'Code': 'SA', 'Description': 'Shift Allowance', 'RateTypeID': 23 },
      { 'Code': 'PHW', 'Description': 'Public Holiday Worked', 'RateTypeID': 14 },
      { 'Code': 'PHP', 'Description': 'Public Holiday Paid', 'RateTypeID': 11 },
      { 'Code': 'AL', 'Description': 'Annual Leave', 'RateTypeID': 33 },
      { 'Code': 'SL', 'Description': 'Sick Leave', 'RateTypeID': 34 },
      { 'Code': 'FRL', 'Description': 'Family Responsibility', 'RateTypeID': 36 }
    ];

    if (this.wfInstanceId !== -1 ) {
      this.getWFInstance();

      this.wfEmployeesLoading = true;
      console.log(`employees loading is: ${this.wfEmployeesLoading}`);
        this.getEmployees();
    }

    this.rateTypesLoading = true;
    this.getRatetypes();

    this.loading = false;
  }

  getEmployees() {
    console.log('getEmployees Start');

    if (this.wfInstanceId === undefined || this.wfInstanceId === null) {
      return;
    }

    this.elmsApi.getEmployees(this.skip, this.limit, this.wfInstanceId)
      .subscribe(
        result => {
          this.wfEmployees = result.employees;
          this.total = result.total;
          console.log('getEmployees Done');
          this.wfEmployeesLoading = false;

          this.reformatEmployees();
        },
        error =>  this.errorMessage = <any>error);


  }

  getWFInstance() {
    if (this.wfInstanceId === undefined || this.wfInstanceId === null) {
      return;
    }

    this.elmsApi.getWFInstance(this.skip, this.limit, this.wfInstanceId)
      .subscribe(
        result => {
          this.wfInstance = result.result[0];
          this.fillExpectedDays(this.wfInstance.calendarFrom, this.wfInstance.calanderTo);
          console.log(this.wfInstance);
          this.setStructureID.emit(result.result[0].structureID);
        },
        error =>  this.errorMessage = <any>error);
  }

  getRatetypes() {
    this.elmsApi.getRateTypes(0, 1000)
      .subscribe(
        result => {
          this.rateTypes = result;
          this.rateTypesLoading = false;
        },
        error =>  {
          this.errorMessage = <any>error;
          this.rateTypesLoading = false;
        })
  }

  reformatEmployees() {
    console.log('reformatEmployees Start');

    const count = this.wfEmployees.length;
    for (let i = 0; i < count; i++) {

      this.elmsApi.getContractOrderEmployee(this.skip, this.limit, this.wfEmployees[i].contractorderEmployeeID)
        .subscribe(
          result => {
            if (result.result.length > 0) {
              this.wfEmployees[i].coeDetails = result.result[0];
            } else {
              this.wfEmployees[i].coeDetails = {};
            }

            this.wfEmployees[i].timesheets = null;
            this.wfEmployees[i].timesheetsLoading = false;

            if (i === count - 1) {
              console.log('reformatEmployees Done');
              this.wfTimesheetsLoading = true;
              console.log('Done A2');
              this.getAllEmployeesTime(true);
            }
          },
          error =>  this.errorMessage = <any>error);
    }
  }

  getAllEmployeesTime(refresh: boolean) {
    console.log('getAllEmployeesTime Start');

    for (let i = 0; i < this.wfEmployees.length; i++) {
      this.getEmployeeTime(this.wfEmployees[i], refresh);

      if (i === this.wfEmployees.length - 1) {
        console.log('getAllEmployeesTime Done');
        this.wfTimesheetsLoading = false;
      }
    }
  }

  getEmployeeTime(e: Employee, refresh: boolean) {
    if (!e.timesheetsLoading && (refresh || e.timesheets === null)) {
      this.getTimesheets(e);
    }
  }

  getTimesheets(e: Employee) {
    e.timesheetsLoading = true;

    if (!e) {
      return;
    }

    this.elmsApi.getTimesheets(
      this.skip,
      this.limit,
      e.contractorderEmployeeID,
      this.wfInstance.calendarID)
      .subscribe(
        result => {
          e.timesheetsTotal = result.total;
          e.timesheets = result.result;
          this.addMissingDates(e);
          this.trollPayrollRateTypes(e);
        },
        error => {
          console.error(error);
          this.errorMessage = error;
        })
  }

  addMissingDates(e: Employee) {
    const count = this.wfDays.length;

    for (let i = 0; i < count; i++) {
      if (_.findIndex(e.timesheets, { timesheet: { Date: this.wfDays[i].format('YYYY-MM-DDTHH:mm:ss') } }) < 0) {

        e.timesheets.push(
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
            'contractOrderEmployeeDetails': _.cloneDeep(e.coeDetails),
            'Breakdown': {
              'strS': '00:00',
              'strB': '00:00',
              'strF': '00:00',
            }
          })
      }

      if ( i === count - 1 ) {
        e.timesheetsLoading = false;
      }
    }
  }

  trollPayrollRateTypes(e: Employee) {
    console.log('trolling');
  }

  fillExpectedDays(from: Date, to: Date) {
    for (const i = moment(from); i < moment(to); i.add(1, 'days')) {
      if (i < moment().startOf('day')) {
        this.wfDays.push(moment(i));
      }
    };
  }

  getColumnHeaders() {
    if (this.wfTemplateId === 2) {
      return this.columnHeaders;
    } else {
      return this.columnHeadersWeekly;
    }
  }

  page() {
    return this.skip / this.limit + 1;
  }

  pages() {
    return Math.ceil(this.total / this.limit);
  }

  changePageSize() {
    this.getEmployees();
  }

  next() {
    if (this.skip + this.limit < this.total) {
      this.skip += this.limit;
      this.getEmployees();
    }
  }

  previous() {
    if (this.skip > 0) {
      this.skip -= this.limit;
      this.getEmployees();
    }
  }

  wfEmployeeTimeLoading() {
    let t = false;
    for (let i = 0; i < this.wfEmployees.length; i++) {
      if (this.wfEmployees[i].timesheetsLoading) {
        t = true;
        break;
      }
    }

    return t;
  }
}
