import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  controller: string = "User";
  constructor(private apiService: ApiService) { }

  auth(body:any) {
    return this.apiService.post(`/User/Login`,body,false,true);
  }
  login(body:any) {
    return this.apiService.post(`/${this.controller}/Login`,body);
  }
  logout() {
    return this.apiService.get(`/user/SignOut`);
  }
  

}

