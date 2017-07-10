import { Component, OnInit, Input } from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';

import { ElmsTimesheetpopupComponent } from '../elms-timesheetpopup/elms-timesheetpopup.component';

import { ElmsApiService } from '../../services/elms-api.service';

import { TimesheetChanges, TimesheetTotal } from '../../models/TimesheetChanges';
import { rateType } from '../../models/rateType';

import { Employee } from '../../models/employee';

@Component({
  selector: 'app-wf-weekly',
  templateUrl: './wf-weekly.component.html',
  styleUrls: ['./wf-weekly.component.css']
})
export class WfWeeklyComponent implements OnInit {
  errorMessage: string;

  @Input() employee: Employee;
  @Input() columnHeaders: any[];
  @Input() wfDays: any[];

  selectedDay: any;

  ts: any[];

  tableClass = {
    'mdl-data-table': true,
    'mdl-js-data-table': true,
    'mdl-data-table--selectable': true,
    'mdl-shadow--2dp': true,
  }

  tableHeader = {
    'mdl-data-table__cell--non-numeric': true
  }

  cssTableHeader = {
    'table-header-seperator': true
  }

  costCentres: any;
  positions: any;
  rategroups: any;

  time: any;

  timesheets: any;
  timesheetsLoading: boolean;

  constructor() { }

  ngOnInit() {
    this.costCentres = {};
    this.positions = {};
    this.rategroups = {};

    this.time = {};

    this.timesheetsLoading = this.employee.timesheetsLoading;
    this.timesheets = this.employee.timesheets;
  }

}
