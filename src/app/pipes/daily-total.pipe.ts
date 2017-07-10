import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

import * as moment from 'moment';

@Pipe({
  name: 'dailyTotal'
})
export class DailyTotalPipe implements PipeTransform {

  transform(value: any[], indate: any): any {
    if (value === undefined || value === null) {
      console.log(`value can't be ${value}`);
      return null;
    }

    let total = 0;

    for (let i = 0; i < value.length; i++) {
      if (indate === 'all') {
        total += value[i].Total.TimeValue;
      } else {
        if (moment(value[i].timesheet.Date).isSame(moment(indate))) {
          total += value[i].Total.TimeValue;
        }
      }
    }

    return total;
  }

}
