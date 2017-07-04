export class TimesheetChanges {
  timesheetID: number;
  coCostCentreID: number;
  coPositionID: number;
  coPositionRateGroupID: number;
  totals: TimesheetTotal[];
}

export class TimesheetTotal {
  value: number;
  rateTypeID: number;
}
