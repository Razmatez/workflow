import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ElmsApiService } from '../../services/elms-api.service';
import { Employee } from '../../models/employee';

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


  wfEmployees: Employee[];
  wfEmployeesLoading: boolean;
  wfDays: any[];

  rateTypes: any;
  rateTypesLoading: boolean;

  skip: number;
  limit: number;
  total: number;

  constructor(private elmsApi: ElmsApiService,
    private route: ActivatedRoute,
    private router: Router) {
    this.total = 0;
  }

  ngOnInit() {
    this.skip = 0;
    this.limit = 10;
    this.wfDays = [];

    console.log(this.wfInstanceId);
    console.log(this.wfTemplateId);

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

            if (i === count - 1) {
              this.wfEmployeesLoading = false;
            }
          },
          error =>  this.errorMessage = <any>error);
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
