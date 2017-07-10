import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'billValueTotal'
})
export class BillValueTotalPipe implements PipeTransform {

  transform(value: any[]): number {
    if (value === undefined || value === null) {
      console.log(`value can't be ${value}`);
      return null;
    }

    let total = 0;

    for (let i = 0; i < value.length; i++) {
      total += value[i].Total.BillValue;
    }

    return total;
  }

}
