import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ElmsApiService } from '../../services/elms-api.service';
import { Employee } from '../../models/employee';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})

export class WorkflowComponent implements OnInit {
  @Output() setStructureID = new EventEmitter<number>();
  @Input() wfInstanceId: number;
  @Input() wfTemplateId: number;
  @Input() wfTrackId: number;

  errorMessage: string;
  wfInstance: any;


  wfEmployeesLoading: boolean;
  wfEmployees: Employee[];
  wfDays: any[];

  rateTypes: any;
  rateTypesLoading: boolean;

  skip: number;
  limit: number;
  total: number;

  pageSelecter: number[];

  constructor(private elmsApi: ElmsApiService,
    private route: ActivatedRoute,
    private router: Router) {
    this.total = 0;
  }

  ngOnInit() {
    this.skip = 0;
    this.limit = 10;
    this.wfDays = [];

    this.pageSelecter = [
      10,
      20,
      50,
      100,
      200,
      500
    ]

    if (this.wfInstanceId !== -1 ) {
      this.getWFInstance();
      this.getEmployees();
    }

    this.rateTypesLoading = true;
    this.getRatetypes();
  }

  getEmployees() {
    this.wfEmployeesLoading = true;

    if (this.wfInstanceId === undefined || this.wfInstanceId === null) {
      return;
    }

    this.elmsApi.getEmployees(this.skip, this.limit, this.wfInstanceId)
      .subscribe(
        result => {
          this.wfEmployees = result.employees;
          this.reformatEmployees();
          this.total = result.total;
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
              this.wfEmployeesLoading = false;
            }

            this.getEmployeeTime(this.wfEmployees[i]);
          },
          error =>  this.errorMessage = <any>error);
    }
  }

  getEmployeeTime(e: Employee) {
    if (!e.timesheetsLoading && e.timesheets === null) {
      this.getTimesheets(e);
    }

    /*let to = 0;

    if (this.total > this.skip + this.limit) {
      to = this.skip + this.limit;
    } else {
      to = this.total;
    }

    console.log(`Get time from ${this.skip} to ${to}`)

    // for (let i = this.skip; i < to; i++) {
    for (let i = 0; i < this.wfEmployees.length; i++) {
      if (!this.wfEmployees[i].timesheetsLoading && this.wfEmployees[i].timesheets === null) {
        this.getTimesheets(this.wfEmployees[i]);
      }

    }*/
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
        },
        error => {
          this.errorMessage = <any>error;
          e.timesheetsLoading = false;
        })
  }

  addMissingDates(e: Employee) {
    // console.log(this.employee.coeDetails);
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

  fillExpectedDays(from: Date, to: Date) {
    for (const i = moment(from); i < moment(to); i.add(1, 'days')) {
      if (i < moment().startOf('day')) {
        this.wfDays.push(moment(i));
      }
    };
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
}
