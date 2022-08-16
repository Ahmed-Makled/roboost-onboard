import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { ShippingAddressSearchViewModel } from './view-models/shipping-search.model';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {


  
  controller : string = "ShippingAddress";
  constructor(private _apiService:ApiService) { }

  getShippingAdress(searchViewModel:ShippingAddressSearchViewModel,orderBy:string, isAscending:boolean, pageIndex:number, pageSize:number=0){
    if(pageSize==0)
      pageSize=environment.pageSize;
     let params = new HttpParams();
      if(searchViewModel.ID)
      {
        params=params.set("ID",searchViewModel.ID.toString());
      }
      if(searchViewModel.CustomerNumber)
      {
        params=params.set("CustomerNumber",searchViewModel.CustomerNumber);
      }
      if(searchViewModel.address)
      {
        params=params.set("address",searchViewModel.address);
      }
      if(searchViewModel.BranchID)
      {
        params=params.set("BranchID",searchViewModel.BranchID.toString());
      }
      if(searchViewModel.mobile)
      {
        params=params.set("mobile",searchViewModel.mobile);
      }
     
    return this._apiService.get(`/${this.controller}/Get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,params);
  }

}
