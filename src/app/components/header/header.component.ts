import { Component, OnInit } from '@angular/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public snackBar: MdSnackBar) { }

  ngOnInit() {
  }

  approveTimesheet() {
    const snackRef = this.snackBar.open('Approving of timesheets is not yet implemented.', null, {
      duration: 2000
    })
  }

  addEmployee() {
    const snackRef = this.snackBar.open('Adding missing employees is not yet implemented.', null, {
      duration: 2000
    })
  }

  saveTimesheetChanges() {
    const snackRef = this.snackBar.open('Saving timesheets is not yet implemented.', null, {
      duration: 2000
    })
  }
}
