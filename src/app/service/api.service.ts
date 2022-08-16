import { throwError as observableThrowError, Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocalizationService } from './localization.service';
import { ResponseViewModel } from 'src/app/model/shared/response.model';
import { LogService } from './log.service';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  //userToken: string;

  constructor(
    private tokenService: TokenService,
    private http: HttpClient,
    private localizationService: LocalizationService,
    private _alertService: AlertService,
    private _logService: LogService,
    private _router:Router,
    private _storageService: StorageService
  ) {
    //this.userToken = this.tokenService.getToken();
  }

  // Request options
  private setHeaders(withFiles: boolean = false): HttpHeaders {
    // console.log(this.tokenService  .getToken())
    let headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json', 
      lang: this.localizationService.getLanguage(),
      token: this.tokenService.getToken()
       //  this.tokenService.getToken()
    };

    let headersConfigWithImage = {
      Accept: 'application/json',
      lang: this.localizationService.getLanguage(),
      token: this.tokenService.getToken(),
      // "QjhuaGZ6WHgxcERoSGxGbkJFVktFYVdmd3E3RXVFb3hVL2NEeTF0d3dpOD06OTA6NjM3NzUzNjIwNDM1OTAzNDg1OjIw"
      //  this.tokenService.getToken()
    };
    if (withFiles) return new HttpHeaders(headersConfigWithImage);
    else return new HttpHeaders(headersConfig);
  }

  private formatErrors(error: any) {
    if (error.status == 401) {
      this._router.navigateByUrl('/login')
    } else if (error.status == 500) {
      this._alertService.error('حدث خطأ من فضلك حاول لاحقاً');
    } else if (error.status ==  404) {
      this._alertService.error('حدث خطأ من فضلك حاول لاحقاً');
    }
    // this._logService.addToConsole(error);
    return observableThrowError(error);
  }

  get(path: string, params?: HttpParams): Observable<ResponseViewModel> {
    // console.log(params);
    //// console.log(environment.api+"/"+path);
    //// console.log("inside service api ");
    return this.http.get(`${environment.allowDynamicApi? this._storageService.getApi():environment.api}${path}`, { headers: this.setHeaders(), params }).pipe(
      catchError((er) => this.formatErrors(er)),map((res: ResponseViewModel) => res));
  }
  getImages(path: string): Observable<Blob> {
    //// console.log(environment.api+"/"+path);
    //// console.log("inside service api ");
    return this.http.get(`${environment.allowDynamicApi? this._storageService.getApi():environment.api}${path}`, { responseType: 'blob' });
  }
  getFiles(path: string, params?: HttpParams): Observable<Blob> {
    return this.http.get(`${environment.allowDynamicApi? this._storageService.getApi():environment.api}${path}`, {
      responseType: 'blob',
      headers: this.setHeaders(true),
      params,
    });
  }

  post(path: string,body: Object = {},withFiles = false,withAuth:boolean = false): Observable<ResponseViewModel> {
    //alert(this.tokenService.getToken());
    // //// console.log("in http post method");
    this._logService.addToConsole(path+" > " + JSON.stringify(body));
    return this.http.post(`${withAuth?'https://auth.roboost.app':(environment.allowDynamicApi? this._storageService.getApi():environment.api)}${path}`, body, {headers: this.setHeaders(withFiles),}).pipe(
      catchError(this.formatErrors),map((res: ResponseViewModel) => res));
  }

  update(path: string,body: Object = {},withFiles = false): Observable<ResponseViewModel> {
    // console.log('body : ' + JSON.stringify(body));
    this._logService.addToConsole(path+" > " + JSON.stringify(body));
    return this.http.put(`${environment.allowDynamicApi? this._storageService.getApi():environment.api}${path}`, body, {headers: this.setHeaders(withFiles),})
      .pipe(catchError(this.formatErrors),map((res: ResponseViewModel) => res));
  }

  remove(path: string): Observable<ResponseViewModel> {
    return this.http.delete(`${environment.allowDynamicApi? this._storageService.getApi():environment.api}${path}`, { headers: this.setHeaders() })
      .pipe(catchError(this.formatErrors), map((res: ResponseViewModel) => res));
  }

  // download(path: string, image: string): Observable<ResponseViewModel> {
  //   return this.http.post(`${environment.api}${path}${image}`, { headers: this.setHeadersWithImage() })
  //     .pipe(map((res: ResponseViewModel) => res));
  // }

  removeAttachment(path: string): Observable<ResponseViewModel> {
    return this.http.get(`${environment.allowDynamicApi? this._storageService.getApi():environment.api}${path}`, { headers: this.setHeaders() })
      .pipe(map((res: ResponseViewModel) => res));
  }
  getFromGoogle(path: string) {
    return this.http.get(`${path}`);
  }
}
