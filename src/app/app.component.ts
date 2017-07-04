import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  addEmployee: boolean;

  constructor(
   private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    this.addEmployee = false;

    if (this.localStorageService.isSupported) {
      this.localStorageService.set('token-elms', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOiIxIiwidXNlciI6IjUxODciLCJkYXRlIjoiMTQ5OTE1Njg2MCIsImV4cCI6IjE0OTkxOTI4NjAiLCJlbnYiOiJRQV9aQSJ9.FFh71nCFoFxmex52mM1og7dQv67SgE2MfCN2ZlDBdZc');
    }
  }

  eventAddEmployee(status: string) {
    console.log(`Hello status: ${status}`);
    if (status === 'open') {
      this.addEmployee = true;
    }
  }

  closeComponent(component: string) {
    console.log('close component: ' + component);

    switch (component) {
      case 'elms-place-employee':
        this.addEmployee = false;
        break;
    }
  }
}
