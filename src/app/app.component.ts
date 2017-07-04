import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  headerButtons: any;
  structureID: number;

  addEmployee: boolean;
  showTimesheetPopup: boolean;

  constructor(
   private localStorageService: LocalStorageService,
   public snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.headerButtons = {
      'save': true,
      'add': true,
      'approve': true,
      'authorize': false,
      'close': false
    };

    this.structureID = -1
    this.addEmployee = false;
    this.showTimesheetPopup = false;

    if (this.localStorageService.isSupported) {
      this.localStorageService.set('token-elms', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOiIxIiwidXNlciI6IjUxODciLCJkYXRlIjoiMTQ5OTE1Njg2MCIsImV4cCI6IjE0OTkxOTI4NjAiLCJlbnYiOiJRQV9aQSJ9.FFh71nCFoFxmex52mM1og7dQv67SgE2MfCN2ZlDBdZc');
    }
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
        this.headerButtons = {
          'save': true,
          'add': true,
          'approve': true,
          'authorize': false,
          'close': false
        };
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
      default:
        this.addEmployee = false;
        this.showTimesheetPopup = false;
        break;

    }
  }

  setCurrentStructure(sID: number) {
    this.structureID = sID;
  }
}
