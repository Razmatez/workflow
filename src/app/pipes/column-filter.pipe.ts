import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

@Pipe({
  name: 'columnFilter'
})
export class ColumnFilterPipe implements PipeTransform {

  transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }

        const t = _.find(items, { 'Description': filter.RateTypeName });

        // filter items array, items which match and return true will be kept, false will be filtered out
        return items.filter(item => item.Description.indexOf(filter.Description) !== -1);
    }
}

