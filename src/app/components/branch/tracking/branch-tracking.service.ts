import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class BranchTrackingService {
  controller : string = "Branch";
  constructor(private _apiService:ApiService) { }
  

  get(orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {

    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    return this._apiService.get(`/${this.controller}/GetBranchOrdersAndDeliveryMen?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
 
}
