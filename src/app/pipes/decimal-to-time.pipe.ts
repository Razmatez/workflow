import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalToTime'
})
export class DecimalToTimePipe implements PipeTransform {

  transform(time: number): string {
    if (time === undefined || time === null) {
      return '--:--';
    }

    if (time === 0) {
      return '00:00';
    }

    const hr = Math.floor(time);
    const min = Math.round((time - hr) * 60);

    let t = '';
    if (hr < 10) { t += '0' };
    t += hr + ':';
    if (min < 10) { t += '0' };
    t += min;

    return t;
  }

}
