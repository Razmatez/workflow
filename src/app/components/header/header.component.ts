import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() eventAddEmployee = new EventEmitter<string>();

  constructor(public snackBar: MdSnackBar) { }

  ngOnInit() {
  }

  approveTimesheet() {
    const snackRef = this.snackBar.open('Approving of timesheets is not yet implemented.', null, {
      duration: 2000
    })
  }

  addEmployee() {
    this.eventAddEmployee.emit('open');
    const snackRef = this.snackBar.open('This should open up the add employee screen for you.', null, {
      duration: 2000
    })
  }

  saveTimesheetChanges() {
    const snackRef = this.snackBar.open('Saving timesheets is not yet implemented.', null, {
      duration: 2000
    })
  }
}
