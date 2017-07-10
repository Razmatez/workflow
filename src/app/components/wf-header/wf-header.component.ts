import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-wf-header',
  templateUrl: './wf-header.component.html',
  styleUrls: ['./wf-header.component.css']
})
export class WfHeaderComponent implements OnInit {

  @Input() wfInstance: any;

  constructor() { }

  ngOnInit() {
  }

  getTSPeriod() {
    let t: string;
    t = moment(this.wfInstance.calendarFrom).format('dddd DD/MM/YYYY') + ' - ';
    t += moment(this.wfInstance.calanderTo).add(-1).format('dddd DD/MM/YYYY');

    return t;
  }

}
