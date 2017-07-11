import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

import { rateType } from '../models/rateType'

@Pipe({
  name: 'rateGroupGrandTotal'
})
export class RateGroupGrandTotalPipe implements PipeTransform {

  transform(value: any[], rateType: number): number {
    if (value === undefined || value === null) {
      console.log(`value can't be ${value}`);
      return null;
    }

    let total = 0;

    for (let i = 0; i < value.length; i++) {
      if (value[i] === undefined || value[i] === null) {
        console.log(`value[i] can't be ${value[i]}`);
        continue;
      }

      for (let k = 0; k < value.length; k++) {
        if (value[i].timesheets[k] === undefined || value[i].timesheets[k] === null) {
          console.log(`value[i].timesheets[k] can't be ${value[i].timesheets[k]}`);
          continue;
        }

        const totals: rateType[] = value[i].timesheets[k].Total.Breakdown;

        const t: rateType = _.find(totals,  { 'RateTypeID': rateType });
        if (t) {
          total += t.TimeValue;
        }
      }
    }

    return total;
  }

}
