import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { WorkflowComponent } from '../workflow/workflow.component';
import { WfDailyComponent } from '../wf-daily/wf-daily.component';
import { LocalStorageService } from 'angular-2-local-storage';


@Component({
  selector: 'app-elms-timesheetpopup',
  templateUrl: './elms-timesheetpopup.component.html',
  styleUrls: ['./elms-timesheetpopup.component.css']
})
export class ElmsTimesheetpopupComponent implements OnInit {
  contractOrderEmployeeID: number;
  period: string;
  popupUrl: string;

  constructor(
    public dialogRef: MdDialogRef<WfDailyComponent>,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    if (this.localStorageService.isSupported) {
      if (this.localStorageService.get('token-elms') === null) {
        return;
      }
    }

    this.popupUrl = `http://172.18.2.97/Timesheets/TimesheetPopUp.aspx`;
    this.popupUrl += `?ContractOrderEmployeeID=${this.contractOrderEmployeeID}`
    this.popupUrl += `&ToTime=${this.period}`
    this.popupUrl += `&Token=${this.localStorageService.get('token-elms')}`;

    console.log(this.popupUrl);
  }

}
