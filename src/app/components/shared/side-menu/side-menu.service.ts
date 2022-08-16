import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {

  constructor(private _apiService: ApiService) { }


  getUserLogin() {
    return this._apiService.get(`/User/GetUserRole`);
  }
  
}

