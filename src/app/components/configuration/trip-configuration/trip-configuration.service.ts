import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { TripBranchConfigurationViewModel } from './view-models/trip-branch-configuration.model';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class TripBranchConfiguratioService {

  
  controller : string = "Branch";
  constructor(private _apiService:ApiService) { }
 
  get( orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
  

return this._apiService.get(`/${this.controller}/GetTripConfigration?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }

  updateTripConfiguration(model:TripBranchConfigurationViewModel){
    return this._apiService.update(`/Branch/UpdateTripConfiguration`,model);
  }
}
