import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-elms-timesheetpopup',
  templateUrl: './elms-timesheetpopup.component.html',
  styleUrls: ['./elms-timesheetpopup.component.css']
})

export class ElmsTimesheetpopupComponent implements OnInit {
  @Output() closeComponent = new EventEmitter<string>();
  @Input() contractOrderEmployeeID: number;
  @Input() period: string;

  loading: boolean;

  popupUrl: string;

  constructor(
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.loading = true;
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
    this.loading = false;
  }

}
