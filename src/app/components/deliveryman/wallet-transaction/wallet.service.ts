
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { WalletCreateViewModel } from './view-models/wallet-create.model';
import { WalletSearchViewModel } from './view-models/wallet-search.model';
import { ApiService } from 'src/app/service/api.service';


@Injectable({
  providedIn: 'root'
})
export class WalletService {
 
  controller : string = "WalletTransaction";
  constructor(private apiService:ApiService) { }
  
  get(searchViewModel: WalletSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
  
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.BranchID) {
      params = params.set("BranchID", searchViewModel.BranchID.toString());
    }
    if(searchViewModel.DeliverymanID)
    {
      params=params.set("deliverymanID",searchViewModel.DeliverymanID.toString());
    }
    if(searchViewModel.FromDate)
    {
      params=params.set("fromDate",searchViewModel.FromDate.toString());
    }
    if(searchViewModel.ToDate)
    {
      params=params.set("toDate",searchViewModel.ToDate.toString());
    }
    return this.apiService.get(`/${this.controller}/GetWalletTransactionsByDeliveryman?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  postOrUpdate(body: WalletCreateViewModel) {
    if (body.ID == 0)
      return this.apiService.post(`/${this.controller}/Post`, body);
    else
      return this.apiService.update(`/${this.controller}/Put`, body);
  }


}
