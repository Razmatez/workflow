import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'payValueTotal'
})
export class PayValueTotalPipe implements PipeTransform {

  transform(value: any[]): number {
    if (value === undefined || value === null) {
      console.log(`value can't be ${value}`);
      return null;
    }

    let total = 0;

    for (let i = 0; i < value.length; i++) {
      total += value[i].Total.PayValue;
    }

    return total;
  }

}
