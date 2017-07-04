import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'payValueTotal'
})
export class PayValueTotalPipe implements PipeTransform {

  transform(value: any[]): number {
    let total = 0;

    for (let i = 0; i < value.length; i++) {
      total += value[i].Total.PayValue;
    }

    return total;
  }

}
