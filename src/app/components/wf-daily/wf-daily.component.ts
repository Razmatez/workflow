import { Component, OnInit, Input } from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';

import { ElmsTimesheetpopupComponent } from '../elms-timesheetpopup/elms-timesheetpopup.component';

import { ElmsApiService } from '../../services/elms-api.service';

@Component({
  selector: 'app-wf-daily',
  templateUrl: './wf-daily.component.html',
  styleUrls: ['./wf-daily.component.css']
})
export class WfDailyComponent implements OnInit {
  errorMessage: string;

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

  constructor(private elmsApi: ElmsApiService, public dialog: MdDialog) { }

  ngOnInit() {
    this.costCentres = {};
    this.positions = {};
    this.rategroups = {};
  }

  openDialog(t) {
    const config = new MdDialogConfig();
    const dialogRef = this.dialog.open(ElmsTimesheetpopupComponent, config);
    dialogRef.afterClosed().subscribe(result => {

    });

    const coeid = t.contractOrderEmployeeDetails.contractOrderEmployeeID;
    const period = this.wfDays[0].format('DD MMM YYYY') + ' to ' + this.wfDays[0].add(7, 'day').format('DD MMM YYYY')

    dialogRef.componentInstance.contractOrderEmployeeID = coeid
    dialogRef.componentInstance.period = period;
    // dialogRef.componentInstance.period = '12 Jun 2017 to 18 Jun 2017';
  }

  selectDay(t) {
    if (this.selectedDay) {
      this.selectedDay.selected = false;
    }

    if (t.selected === undefined || t.selected === null) {
      t.selected = true;
    } else {
      t.selected = !t.selected;
    }

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
    if (!this.selectedDay.changes) {
      this.selectedDay.changes = {};
    }

    this.selectedDay.changes[name] = value;

    console.log(this.selectedDay.changes);
  }

}
