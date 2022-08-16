
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { DeliverymanShiftSearchViewModel } from './view-models/deliveryman-shift-search.model';
import { ApiService } from 'src/app/service/api.service';


@Injectable({
  providedIn: 'root'
})
export class DeliverymanShiftService {

  controller: string = "DeliverymanShift";
  constructor(private _apiService: ApiService) { }

  get(searchViewModel: DeliverymanShiftSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
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
  
  getReport(searchViewModel: DeliverymanShiftSearchViewModel, orderBy: string, isAscending: boolean,pageIndex: number, pageSize: number = 0) {
    
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
    return this._apiService.getFiles(`/${this.controller}/GetDeliverymenShiftExcelReport?orderBy=${orderBy}&isAscending=${isAscending}`, params);
  }
 
}
