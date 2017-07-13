import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';

import { ElmsTimesheetpopupComponent } from '../elms-timesheetpopup/elms-timesheetpopup.component';

import { ElmsApiService } from '../../services/elms-api.service';
import { EmployeePopupService } from '../../services/employee-popup.service';

import { TimesheetChanges, TimesheetTotal } from '../../models/TimesheetChanges';
import { rateType } from '../../models/rateType';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-wf-daily',
  templateUrl: './wf-daily.component.html',
  styleUrls: ['./wf-daily.component.css']
})
export class WfDailyComponent implements OnInit {
  errorMessage: string;
  @Output() openEmployeeTS = new EventEmitter<string>();

  @Input() timesheetsLoading: boolean;
  @Input() columnHeaders: any[];
  @Input() timesheets: any[];
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
  headerTolltipPos: string;

  constructor(
      private elmsApi: ElmsApiService,
      private empPopup: EmployeePopupService,
      public dialog: MdDialog) { }

  ngOnInit() {
    this.costCentres = {};
    this.positions = {};
    this.rategroups = {};

    this.time = {};
    this.headerTolltipPos = 'above';
  }

  openDialog(t) {
    const coeid = t.contractOrderEmployeeDetails.contractOrderEmployeeID;
    const period = moment(this.wfDays[0]).format('DD MMM YYYY') + ' to ' + moment(this.wfDays[0]).add(7, 'day').format('DD MMM YYYY')

    this.empPopup.showEmployee(coeid, period);
  }

  selectDay(t) {
    if (this.selectedDay) {
      this.selectedDay.selected = false;
    }

    if (t.Breakdown !== undefined && t.Breakdown !== null) {
      t.canEdit = true;

      if (t.Breakdown.approveBatchID && t.Breakdown.approveBatchID !== 0) {
        t.canEdit = false;
      }

      if (t.Breakdown.authoriseBatchID && t.Breakdown.authoriseBatchID !== 0) {
        t.canEdit = false;
      }

      if (t.Breakdown.exportBatchID && t.Breakdown.exportBatchID !== 0) {
        t.canEdit = false;
      }

    }

    if (t.selected === undefined || t.selected === null) {
      t.selected = true;
    } else {
      t.selected = !t.selected;
    }

    this.time = {};

    this.selectedDay = t;
    this.getCostCentres();
    this.getPositions();
    this.getPRateGroups();
  }

  getCostCentres() {
    if (this.selectedDay) {
      const coID = this.selectedDay.contractOrderEmployeeDetails.contractOrderID;
      if (!this.costCentres[coID]) {
        this.elmsApi.getCOCostCentres(0, 100, coID)
          .subscribe(
            result => {
              this.costCentres[coID] = result.result;
              // implement logic for results with more that 100 items
              // console.log(this.costCentres);
            },
            error =>  this.errorMessage = <any>error);
      }
    }
  }

  getPositions() {
    if (this.selectedDay) {
      const coID = this.selectedDay.contractOrderEmployeeDetails.contractOrderID;
      if (!this.positions[coID]) {
        this.elmsApi.getCOPositions(0, 100, coID)
          .subscribe(
            result => {
              this.positions[coID] = result.result;
              // implement logic for results with more that 100 items
              // console.log(this.positions);
            },
            error =>  this.errorMessage = <any>error);
      }
    }
  }

  getPRateGroups() {
    if (this.selectedDay) {
      const coID = this.selectedDay.contractOrderEmployeeDetails.contractOrderID;
      const coPID = this.selectedDay.contractOrderEmployeeDetails.contractOrderPositionID;

      // console.log(`getPRateGroups, coID:${coID}, coPID:${coPID}`);

      if (!this.rategroups[coPID]) {
        this.elmsApi.getCOPRateGroups(0, 100, coID, coPID)
          .subscribe(
            result => {
              this.rategroups[coPID] = result.result;
              // implement logic for results with more that 100 items
              // console.log(this.rategroups);
            },
            error =>  this.errorMessage = <any>error);
      }
    }
  }

  timesheetChanged(timesheet: any, name: string, value: any) {
    this.addChangesObject();

    this.selectedDay.changes[name] = value;

    console.log(this.selectedDay.changes);
  }

  changeTotal(rt: rateType) {
    this.addChangesObject();

    const tTotal = this.selectedDay.changes.totals;
    // console.log(tTotal);

    const i = _.findIndex(tTotal, { 'rateTypeID': rt.RateTypeID });

    if (i !== -1) {
      tTotal[i].value = this.time[rt.RateTypeID];
    } else {
      const t = new TimesheetTotal();
      t.rateTypeID = rt.RateTypeID;
      t.value = this.time[rt.RateTypeID];

      tTotal.push(t);
    }

    // console.log(rt);
    // console.log(this.time);
    console.log(this.selectedDay.changes);
  }

  addChangesObject() {
    if (!this.selectedDay.changes) {
      this.selectedDay.changes = new TimesheetChanges();
      this.selectedDay.changes.timesheetID = this.selectedDay.timesheet.TimesheetID || null;
      this.selectedDay.changes.totals = [];
    }
  }

  saveTimesheetChanges() {
    for (let i = 0; i < this.timesheets.length; i++) {
      if (this.timesheets[i].changes) {
        this.elmsApi.saveTimesheetChanges(this.timesheets[i].changes);
      }
    }
  }

}
