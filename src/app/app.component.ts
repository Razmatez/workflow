import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LocalStorageService } from 'angular-2-local-storage';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import { ElmsApiService } from './services/elms-api.service';
import { EmployeePopupService } from './services/employee-popup.service';

import * as jspdf from 'jspdf';
import * as $ from 'jquery';
// import * as h2p from 'html2pdf';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  loading: boolean;
  error: string;

  approving: boolean;

  loggedIn: boolean;

  wfInstance: number;
  wfTemplate: number;
  wfTrack: number;
  wfEmail: number;
  wfUser: string;
  lockUser: boolean;

  headerButtons: any;
  structureID: number;

  addEmployee: boolean;
  timesheetPopup: any;



  constructor(
    private elmsApi: ElmsApiService,
    private empPopup: EmployeePopupService,
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    public snackBar: MdSnackBar) {
    // SERVICES
    empPopup.showEmployeeRequest$.subscribe(val => {
      this.openTimesheetPopup(val);
    });
  }

  ngOnInit() {

    this.loading = true;
    this.error = '';

    this.approving = false;

    this.loggedIn = false;

    this.headerButtons = {
      'save': false,
      'add': false,
      'approve': false,
      'authorize': false,
      'close': false
    };

    this.structureID = -1
    this.addEmployee = false;

    this.timesheetPopup = {
      'showTimesheetPopup': false,
      'contractOrderEmployeeID': null,
      'period': null
    }

    if (!this.localStorageService.isSupported) {
      this.error = 'Local storage is not supported on this device.';
      this.error += ' Timesheets cannot be loaded on devices not supporting local storage yet.';
      return;
    }

    this.parseQueryStrings((err, res) => {
      if (err) {
        this.error = err;
        return;
      }

      this.updateHeader();

      this.loggedIn = false;
      this.loading = false;

      /*const token = this.localStorageService.get('token-elms');
      const user: any = this.localStorageService.get('user-elms');

      if (user && token && (this.wfUser === null || user.username === this.wfUser)) {
        this.loggedIn = true;
        this.loading = false;
      } else {
        this.loggedIn = false;
        this.loading = false;
      }*/
    });
  }

  newLogin(status: boolean) {
    console.log('Logged in: ' + status);
    const token = this.localStorageService.get('token-elms');
    const user: any = this.localStorageService.get('user-elms');

    if (user && token && (this.wfUser === null || user.username === this.wfUser)) {
      this.loggedIn = true;
      this.loading = false;
    } else {
      this.loggedIn = false;
      this.loading = false;
    }
  }

  updateHeader() {
    // console.log('updateHeader: ' + this.wfTemplate);

    const t: number = this.wfTemplate * 1;

    switch (t) {
      case 1:
        // console.log('updateHeader: employee');
        this.headerButtons = {
          'save': false,
          'add': true,
          'approve': true,
          'authorize': false,
          'close': false
        };
        break;
      case 2:
        // console.log('updateHeader: daily');
        this.headerButtons = {
          'save': true,
          'add': true,
          'approve': true,
          'authorize': false,
          'close': false
        };
        break;
      case 3:
        // console.log('updateHeader: weekly');
        this.headerButtons = {
          'save': false,
          'add': false,
          'approve': false,
          'authorize': true,
          'close': false
        };
        break;

      default:
        // console.log('updateHeader: Default');
        break;
    }
  }

  parseQueryStrings(callback) {
    const sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        if (params['spPage']) {
          this.wfInstance = parseInt(atob(params['spPage']), 10);
          console.log('wfInstance:' + this.wfInstance);
        }

        if (params['spDept']) {
          this.wfTemplate = parseInt(atob(params['spDept']), 10);
          console.log('wfTemplate:' + this.wfTemplate);
        }

        if (params['spTrk']) {
          this.wfTrack = parseInt(atob(params['spTrk']), 10);
          console.log('wfTrack:' + this.wfTrack);
        }

        if (params['spAC']) {
          this.wfEmail = parseInt(atob(params['spAC']), 10);
          console.log('wfEmail:' + this.wfEmail);
        }

        if (params['spUser']) {
          this.wfUser = atob(params['spUser']);
          this.lockUser = true;
          console.log('wfUser:' + this.wfUser);
        } else {
          this.wfUser = null;
          this.lockUser = false;
        }

        if (callback) {
          callback(null, true);
        }

      });
  }

  headerClick(button: string) {
    switch (button) {
      case 'add':
        this.addEmployee = true;
        this.headerButtons = {
          'save': false,
          'add': false,
          'approve': false,
          'authorize': false,
          'close': true
        };
        break;
      case 'close':
        this.closeComponent('all');
        this.updateHeader();
        break;
      case 'approve':
        this.approving = true;
        this.elmsApi.postApproveWFTimesheet(this.wfInstance, this.wfTemplate, this.wfTrack)
          .subscribe(
            result => {
              this.approving = false;
            },
            error => {
              this.error = <any>error
              this.approving = false
              const snackRef = this.snackBar.open(JSON.stringify(this.error), null, { duration: 3000 })
            });
        break;
      default:
        const snackRef = this.snackBar.open(`${button} is not implemented`, null, { duration: 2000 })
        break;
    }
  }

  closeComponent(component: string) {

    switch (component) {
      case 'elms-place-employee':
        this.addEmployee = false;
        break;
      case 'elms-timesheetPopup':
        this.timesheetPopup.showTimesheetPopup = false;
        break;
      default:
        this.addEmployee = false;
        this.timesheetPopup.showTimesheetPopup = false;
        break;

    }
  }

  setCurrentStructure(sID: number) {
    this.structureID = sID;
  }

  generatePDF() {
    console.log('here');
    const doc = new jspdf()

    // doc.text('Hello world!', 10, 10)

    const specialElementHandlers = {
      '#editor': function(element, renderer){
        return true;
      }
    };

    doc.fromHTML($('body').get(0), 15, 15, {
      'width': 170,
      'elementHandlers': specialElementHandlers
    });
    doc.save('a4.pdf')

    /*const pdf = new jspdf('p', 'pt', 'letter');
    pdf.canvas.height = 72 * 11;
    pdf.canvas.width = 72 * 8.5;
    h2p(document.body, pdf, (pdfRes) => {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:500px');
        document.body.appendChild(iframe);
        iframe.src = pdfRes.output('datauristring');
    });*/
  }

  openTimesheetPopup(popupParams: any) {
    this.timesheetPopup.period = popupParams.period;
      this.timesheetPopup.contractOrderEmployeeID = popupParams.coeID;
      this.timesheetPopup.showTimesheetPopup = true;

      this.headerButtons = {
          'save': false,
          'add': false,
          'approve': false,
          'authorize': false,
          'close': true
        };
  }

}
