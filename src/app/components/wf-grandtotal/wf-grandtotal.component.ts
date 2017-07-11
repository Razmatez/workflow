import { Component, OnInit, Input } from '@angular/core';

import { Employee } from '../../models/employee';

@Component({
  selector: 'app-wf-grandtotal',
  templateUrl: './wf-grandtotal.component.html',
  styleUrls: ['./wf-grandtotal.component.css']
})
export class WfGrandtotalComponent implements OnInit {
  errorMessage: string;

  @Input() employees: Employee[];
  @Input() wfTemplateId: number;
  @Input() columnHeaders: any[];

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

  time: any;

  constructor() { }

  ngOnInit() {

    this.time = {};
  }

}
