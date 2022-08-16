import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ScheduledOrderSearchViewModel } from './view-models/shceduled-order-search.model';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduledOrderService {

  
  controller : string = "ScheduledOrder";
  constructor(private _apiService:ApiService) { }
  
  get(searchViewModel:ScheduledOrderSearchViewModel,orderBy:string, isAscending:boolean, pageIndex:number, pageSize:number=0){
    if(pageSize==0)
      pageSize=environment.pageSize;
      let params = new HttpParams();
      if(searchViewModel.OrderNumber)
      {
        params=params.set("Number",searchViewModel.OrderNumber.toString());
      }
      if(searchViewModel.BranchID)
      {
        params=params.set("branchID",searchViewModel.BranchID.toString());
      }
      if(searchViewModel.FromDate)
      {
        params=params.set("FromDate",searchViewModel.FromDate.toString());
      }
      if(searchViewModel.ToDate)
      {
        params=params.set("ToDate",searchViewModel.ToDate.toString());
      }
    if(searchViewModel.BranchID)
    {
        params=params.set("BranchID",searchViewModel.BranchID.toString());
    }
    return this._apiService.get(`/${this.controller}/get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,params);
  }

  unschedule(id:number){
    return this._apiService.update(`/${this.controller}/UnscheduledOrder?id=${id}`);
 
  }
}
