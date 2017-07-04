import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

import { rateType } from '../models/rateType'

@Pipe({
  name: 'rateType'
})
export class RateTypePipe implements PipeTransform {

  transform(value: rateType[], rateType: number): number {
    const t = _.find(value, { 'RateTypeID': rateType });
    if (t) {
      return t.TimeValue;
    } else {
      return null;
    }

  }

}
