import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timesheetStatus'
})
export class TimesheetStatusPipe implements PipeTransform {

  transform(tsBreakdown: any): string {
    let res = '';

    if (tsBreakdown === undefined || tsBreakdown === null) {
      return '';
    }

    if (tsBreakdown.approveBatchID && tsBreakdown.approveBatchID !== 0) {
      res = 'Approved'
    }

    if (tsBreakdown.authoriseBatchID && tsBreakdown.authoriseBatchID !== 0) {
      res = 'Authorised'
    }

    if (tsBreakdown.exportBatchID && tsBreakdown.exportBatchID !== 0) {
      console.log(tsBreakdown.exportBatchID);
      res = 'Exported'
    }

    return res;
  }

}
