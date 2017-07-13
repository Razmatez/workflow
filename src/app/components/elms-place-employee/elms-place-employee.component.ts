import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-elms-place-employee',
  templateUrl: './elms-place-employee.component.html',
  styleUrls: ['./elms-place-employee.component.css']
})

export class ElmsPlaceEmployeeComponent implements OnInit {
  @Output() closeComponent = new EventEmitter<string>();
  @Input() structureID: number;
  url: string;

  constructor(
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    if (this.localStorageService.isSupported) {
      if (this.localStorageService.get('token-elms') === null) {
        return;
      }
    }

    this.url = `http://172.18.2.97/HR/WFContractOrder.aspx?StructureID=${this.structureID}&Token=${this.localStorageService.get('token-elms')}`;

    console.log(this.url);
  }

  close() {
    this.closeComponent.emit('elms-place-employee');
  }

}
