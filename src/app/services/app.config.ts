import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public server = 'http://172.18.2.97:82/';
    // public server = 'https://elmsinnstaff.adcorp.co.za/';
    public apiUrl = 'api/alpha/';
    public serverWithApiUrl = this.server + this.apiUrl;

    public token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOiIxIiwidXNlciI6IjUxODciLCJkYXRlIjoiMTQ5NzcwMDI3NiIsImV4cCI6IjE0OTc3MzYyNzYiLCJlbnYiOiJRQV9aQSJ9.CTXZ-DACoQ3CDWyaOSRCcl6JBMMzbE347DYl2GFTb14';
}
