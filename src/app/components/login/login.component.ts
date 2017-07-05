import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ElmsApiService } from '../../services/elms-api.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() newLogin = new EventEmitter<boolean>();
  @Input() wfUser: string;
  @Input() lockUser: boolean;

  loading: boolean;
  error: string;

  password: string;

  token: string;

  constructor(
    private elmsApi: ElmsApiService,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    console.log('wfUser login: ' + this.wfUser);
    this.loading = false;
    this.error = null;
    this.token = null;

    this.password = '';
  }

  login() {
    this.error = null;

    this.elmsApi.login(this.wfUser, this.password)
      .subscribe(
        result => {
          this.localStorageService.set('token-elms', result.Message);
          this.setLoggedInUser();
        },
        error =>  {
          this.error = <any>error;
        });
  }

  setLoggedInUser() {
    this.elmsApi.getUser(0, 1)
      .subscribe(
        result => {
          this.localStorageService.set('user-elms', result);
          this.newLogin.emit(true);
        },
        error =>  {
          this.error = <any>error;
        });
  }

}
