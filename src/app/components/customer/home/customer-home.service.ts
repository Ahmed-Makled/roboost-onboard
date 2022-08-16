import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import {  CustomerSearchViewModel } from './view-models/customer-search.model';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerHomeService {

  
  controller : string = "Customer";
  constructor(private _apiService:ApiService) { }
  get(searchViewModel:CustomerSearchViewModel,orderBy:string, isAscending:boolean, pageIndex:number, pageSize:number=0){
    if(pageSize==0)
      pageSize=environment.pageSize;
      let params = new HttpParams();
      if(searchViewModel.Number)
      {
        params=params.set("Number",searchViewModel.Number.toString());
      }
      if(searchViewModel.Mobile)
      {
        params=params.set("Mobile",searchViewModel.Mobile.toString());
      }
      if(searchViewModel.Name)
      {
        params=params.set("Name",searchViewModel.Name.toString());
      }
      if(searchViewModel.Number)
      {
        params=params.set("Number",searchViewModel.Number.toString());
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
     
    return this._apiService.get(`/${this.controller}/Get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,params);
  }


  changeIsTopPriority(model){
    return this._apiService.update(`/${this.controller}/UpdatePriority`,model)

  }
  changeTransite(model){
    return this._apiService.update(`/${this.controller}/UpdateTrasite`,model)
  }


}
