
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { BranchsWalletSearchViewModel } from './view-models/wallet-branchs-search.model';
import { BranchsWalletCreateViewModel } from './view-models/wallet-branchs-create.model';
import { ApiService } from 'src/app/service/api.service';


@Injectable({
  providedIn: 'root'
})
export class BranchsWalletService {
 
  controller : string = "WalletTransaction";
  constructor(private apiService:ApiService) { }
  
  get(searchViewModel:BranchsWalletSearchViewModel,pageIndex:number, pageSize:number=0 ,orderBy: string, isAscending: boolean){
    if(pageSize==0)
      pageSize=environment.pageSize;
     let params = new HttpParams();
      
      if(searchViewModel.BranchID)
      {
        params=params.set("branchID",searchViewModel.BranchID.toString());
      }
  
       if(searchViewModel.ToDate && searchViewModel.FromDate)
      {
        params=params.set("fromDate",searchViewModel.FromDate);
        params=params.set("toDate",searchViewModel.ToDate);
      }
      return this.apiService.get(`/${this.controller}/GetWalletTransactionsByDate?orderBy=${orderBy}&isAscending=${isAscending}`,params);
    }
  getMonthlyWalletTransactionsReport(searchViewModel: BranchsWalletSearchViewModel, orderBy: string, isAscending: boolean) {

    let params = new HttpParams();
    if (searchViewModel.BranchID) {
      params = params.set("branchID", searchViewModel.BranchID.toString());
    }
    if (searchViewModel.ToDate && searchViewModel.FromDate) {
      params = params.set("fromDate", searchViewModel.FromDate);
      params = params.set("toDate", searchViewModel.ToDate);
    }
    return this.apiService.getFiles(`/${this.controller}/GetWalletTransactionsByDeliveryman?orderBy=${orderBy}&isAscending=${isAscending}`, params);
  }



}
