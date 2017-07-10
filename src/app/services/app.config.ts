import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    // public server = 'http://172.18.2.97:82/';
    public server = 'https://elmsinnstaff.adcorp.co.za/';
    public apiUrl = 'api/alpha/';
    public serverWithApiUrl = this.server + this.apiUrl;

    public apiOauthUrl = 'api/oauth/';
    public serverWithApiOauthUrl = this.server + this.apiOauthUrl;

    public environment = 'QA_ZA';
    public clientid = '1';
}
