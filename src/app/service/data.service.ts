import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DataService {
    constructor(private _httpClient: HttpClient,
        private tokenService: TokenService
    ) { }
    private setHeaders(): HttpHeaders {

        let headersConfig =
        {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'token': this.tokenService.getToken()
        };
        return new HttpHeaders(headersConfig);
    }

    get(path: string) {
        return this._httpClient.get(`${environment.api}${path}`, { headers: this.setHeaders() });
    }
    post(path: string, body: Object = {}) {
        return this._httpClient.post(`${environment.api}${path}`, body, { headers: this.setHeaders() });
    }
    put(path: string, body: Object = {}) {
        return this._httpClient.put(`${environment.api}${path}`, body, { headers: this.setHeaders() });
    }
    delete(path: string) {
        return this._httpClient.delete(`${environment.api}${path}`, { headers: this.setHeaders() });
    }
}