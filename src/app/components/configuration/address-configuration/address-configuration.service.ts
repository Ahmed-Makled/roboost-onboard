import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { AddressConfigurationViewModel } from './view-models/address-branch-configuration.model';
@Injectable({
  providedIn: 'root'
})
export class AddressConfiguratioService {
  controller : string = "Branch";
  constructor(private _apiService:ApiService) { }
  get( orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    return this._apiService.get(`/${this.controller}/GetAddressConfigration?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  updateAddressConfiguration(model:AddressConfigurationViewModel){
    return this._apiService.update(`/${this.controller}/UpdateAddressConfiguration`,model);
  }

}
