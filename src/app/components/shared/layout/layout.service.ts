import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})

export class LayoutService {
  controller : string = "User";

  constructor(private _apiService: ApiService) { }



  getMainInfo(){
    return this._apiService.get(`/${this.controller}/GetMainInfo`);
  }
  
}
