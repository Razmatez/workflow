import { Component, OnInit, Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { WorkflowComponent } from '../Workflow/workflow.component';
import { WfDailyComponent } from '../wf-daily/wf-daily.component';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-elms-place-employee',
  templateUrl: './elms-place-employee.component.html',
  styleUrls: ['./elms-place-employee.component.css']
})
export class ElmsPlaceEmployeeComponent implements OnInit {
  @Input() structureID: number;
  popupUrl: string;

  constructor(
    public dialogRef: MdDialogRef<WfDailyComponent>,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    if (this.localStorageService.isSupported) {
      if (this.localStorageService.get('token-elms') === null) {
        return;
      }
    }

    this.popupUrl = `http://172.18.2.97/HR/WFContractOrder.aspx?StructureID=${this.structureID}&Token=${this.localStorageService.get('token-elms')}`;
  }

}
