
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { DeliverymanPenalizeSearchViewModel } from './view-models/deliveryman-penalize-search.model';
import { ApiService } from 'src/app/service/api.service';


@Injectable({
  providedIn: 'root'
})
export class DeliverymanPenalizeService {

  controller: string = "DeliverymanPenalize";
  constructor(private _apiService: ApiService) { }

  get(searchViewModel: DeliverymanPenalizeSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.BranchID) {
      params = params.set("branchID", searchViewModel.BranchID.toString());
    }
   if (searchViewModel.DeliverymanID) {
      params = params.set("deliverymanID", searchViewModel.DeliverymanID.toString());
    }
    if(searchViewModel.FromDate)
    {
      params=params.set("FromDate",searchViewModel.FromDate);
    }
    if(searchViewModel.ToDate)
    {
      params=params.set("ToDate",searchViewModel.ToDate);
    }
    return this._apiService.get(`/${this.controller}/Get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  
  remove(list: number[]) {
    return this._apiService.post(`/${this.controller}/Delete`,list);
  }
 
  getReport(searchViewModel:DeliverymanPenalizeSearchViewModel,orderBy:string, isAscending:boolean, pageIndex:number, pageSize:number=0){
    if (pageSize == 0)
    pageSize = environment.pageSize;
  let params = new HttpParams();
  if (searchViewModel.BranchID) {
    params = params.set("branchID", searchViewModel.BranchID.toString());
  }
 if (searchViewModel.DeliverymanID) {
    params = params.set("deliverymanID", searchViewModel.DeliverymanID.toString());
  }
  if(searchViewModel.FromDate)
  {
    params=params.set("FromDate",searchViewModel.FromDate);
  }
  if(searchViewModel.ToDate)
  {
    params=params.set("ToDate",searchViewModel.ToDate);
  }  // return this._apiService.getFiles(`/DeliverymanBreak/GetReport?orderBy=${orderBy}&isAscending=${isAscending}`,params);
    return this._apiService.getFiles(`/DeliverymanPenalize/GetReport?orderBy=${orderBy}&isAscending=${isAscending}`,params);
  }
}
