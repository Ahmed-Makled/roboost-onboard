
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

import { ApiService } from 'src/app/service/api.service';
import { WalletTransactionSearchViewModel } from './view-models/wallet-details-search.model';
import { WalletTransactionCreateViewModel } from './view-models/wallet-details-create.model';


@Injectable({
  providedIn: 'root'
})
export class WalletTransactionService {
 
  controller : string = "WalletTransaction";
  constructor(private apiService:ApiService) { }
  
  get(searchViewModel:WalletTransactionSearchViewModel,orderBy:string, isAscending:boolean, pageIndex:number, pageSize:number=0){
    if(pageSize==0)
      pageSize=environment.pageSize;
     let params = new HttpParams();
      if(searchViewModel.TripNumber)
      {
        params=params.set("TripNumber",searchViewModel.TripNumber.toString());
      }
      if(searchViewModel.BranchID)
      {
        params=params.set("BranchID",searchViewModel.BranchID.toString());
      }
      if(searchViewModel.DeliverymanID)
      {
        params=params.set("DeliverymanID",searchViewModel.DeliverymanID.toString());
      }
      if(searchViewModel.Type)
      {
        params=params.set("Type",searchViewModel.Type.toString());
      }
      if(searchViewModel.IsAward)
      {
        params=params.set("IsAward",searchViewModel.IsAward.toString());
      }
      if(searchViewModel.FromDate)
      {
        params=params.set("FromDate",searchViewModel.FromDate);
      }
      if(searchViewModel.ToDate)
      {
        params=params.set("ToDate",searchViewModel.ToDate);
      }
    return this.apiService.get(`/${this.controller}/get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,params);
  }

 
  getStatusList(){
    return this.apiService.get(`/${this.controller}/GetStatusList`)
  }
  
  delete(Ids: number[]) {
    return this.apiService.update(`/${this.controller}/Delete`,Ids);

  }

  postOrUpdate(body: WalletTransactionCreateViewModel) {
    if (body.ID == 0)
      return this.apiService.post(`/${this.controller}/Post`, body);
    else
      return this.apiService.update(`/${this.controller}/Put`, body);
  }
}
