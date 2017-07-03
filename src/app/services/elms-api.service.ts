import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import * as _ from 'lodash';

import { Configuration } from './app.config';
import { Employee } from '../models/employee';

@Injectable()
export class ElmsApiService {
  skip: number;
  limit: number;

  constructor(private http: Http) {
  }

  onInit() {
    this.skip = 0;
    this.limit = 20;
  }

  getEmployees(
    skip = this.skip,
    limit = this.limit,
    instanceId
  ): Observable<any> {
    const config = new Configuration();

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.token}`
    });

    const options = new RequestOptions({ headers: headers });

    return this.http.get(`${config.serverWithApiUrl}workflow/instances/${instanceId}/employees?skip=${skip}&limit=${limit}`, options)
                    .map(this.extractDataEmployee)
                    .catch(this.handleError);
  }

  getContractOrderEmployee(
    skip = this.skip,
    limit = this.limit,
    coeID
  ): Observable<any> {
    const config = new Configuration();

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.token}`
    });

    const options = new RequestOptions({ headers: headers });

    return this.http.get(`${config.serverWithApiUrl}contractorderemployees/${coeID}?skip=${skip}&limit=${limit}`, options)
      .map(this.extractDataGeneric)
      .catch(this.handleError);
  }

  getTimesheets(
    skip = this.skip,
    limit = this.limit,
    contractorderEmployee,
    calendar
  ): Observable<any> {
    const config = new Configuration();

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.token}`
    });

    const options = new RequestOptions({ headers: headers });
    const queryParams = [
      `skip=${skip}`,
      `limit=${limit}`,
      `coeid=${contractorderEmployee}`,
      `calendarid=${calendar}`
    ]

    return this.http.get(
      `${config.serverWithApiUrl}time/timesheets?skip=${skip}&limit=${limit}&coeid=${contractorderEmployee}&calendarid=${calendar}`,
      options
    )
      .map(this.extractDataGeneric)
      .catch(this.handleError);
  }

  getRateTypes(
    skip = this.skip,
    limit = this.limit
  ): Observable<any> {
    const config = new Configuration();

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.token}`
    });

    const options = new RequestOptions({ headers: headers });

    return this.http.get(`${config.serverWithApiUrl}time/ratetypes?skip=${skip}&limit=${limit}`, options)
                    .map(this.extractDataGeneric)
                    .catch(this.handleError);
  }

  getWFInstance(
    skip = this.skip,
    limit = this.limit,
    wfInstance
  ): Observable<any> {
    const config = new Configuration();

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.token}`
    });

    const options = new RequestOptions({ headers: headers });

    return this.http.get(`${config.serverWithApiUrl}workflow/instances/${wfInstance}?skip=${skip}&limit=${limit}`, options)
                    .map(this.extractDataGeneric)
                    .catch(this.handleError);
  }

  getCOCostCentres(
    skip = this.skip,
    limit = this.limit,
    contractOrderID
  ): Observable<any> {
    const config = new Configuration();

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.token}`
    });

    const options = new RequestOptions({ headers: headers });

    return this.http.get(`${config.serverWithApiUrl}contractorders/${contractOrderID}/costcentres?skip=${skip}&limit=${limit}`, options)
                    .map(this.extractDataGeneric)
                    .catch(this.handleError);
  }

  getCOPositions(
    skip = this.skip,
    limit = this.limit,
    contractOrderID
  ): Observable<any> {
    const config = new Configuration();

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.token}`
    });

    const options = new RequestOptions({ headers: headers });

    return this.http.get(`${config.serverWithApiUrl}contractorders/${contractOrderID}/positions?skip=${skip}&limit=${limit}`, options)
                    .map(this.extractDataGeneric)
                    .catch(this.handleError);
  }

  getCOPRateGroups(
    skip = this.skip,
    limit = this.limit,
    contractOrderID,
    positionID
  ): Observable<any> {
    const config = new Configuration();

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.token}`
    });

    const options = new RequestOptions({ headers: headers });

    return this.http.get(`${config.serverWithApiUrl}contractorders/${contractOrderID}/positions/${positionID}/rategroups?skip=${skip}&limit=${limit}`, options)
                    .map(this.extractDataGeneric)
                    .catch(this.handleError);
  }

  private extractDataEmployee(res: Response) {
    let body: any;
    body = res.json();

    let employees: Array<Employee>;
    employees = new Array<Employee>();

    for (let i = 0; i < body.result.length; i++) {

      employees.push(<Employee>({
        eid: body.result[i].id,
        employeeCode: body.result[i].employeeNo,
        employeeCodeClient: '',
        fname: body.result[i].firstName,
        lname: body.result[i].lastname,
        contractorderEmployeeID: body.result[i].contractOrderEmployee
      }));
    }

    return { employees: employees, total: body.total } || { employees: null, total: 0 };
  }

  private extractDataGeneric(res: Response) {
    let body: any;
    body = res.json();

    return body || { result: null, total: 0 };
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return Observable.throw(errMsg);
  }
}
