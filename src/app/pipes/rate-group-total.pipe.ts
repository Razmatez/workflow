import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

import { rateType } from '../models/rateType'

@Pipe({
  name: 'rateGroupTotal'
})
export class RateGroupTotalPipe implements PipeTransform {

  transform(value: any[], rateType: number): number {
    let total = 0;

    for (let i = 0; i < value.length; i++) {
      const totals: rateType[] = value[i].Total.Breakdown;

      const t: rateType = _.find(totals,  { 'RateTypeID': rateType });
      if (t) {
        total += t.TimeValue;
      }
    }

    return total;
  }

}
