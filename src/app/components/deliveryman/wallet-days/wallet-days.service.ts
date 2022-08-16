
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { WalletDaysSearchViewModel } from './view-models/wallet-days-search.model';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class WalletDaysService {

  controller: string = "WalletTransaction";
  constructor(private apiService: ApiService) { }

  get(searchViewModel: WalletDaysSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.DeliverymanID) {
      params = params.set("DeliverymanID", searchViewModel.DeliverymanID.toString());
    }
     if (searchViewModel.ToDate && searchViewModel.FromDate) {
      params = params.set("fromDate", searchViewModel.FromDate);
      params = params.set("toDate", searchViewModel.ToDate);
    }
    return this.apiService.get(`/${this.controller}/GetDailyWalletTransactions?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getSammary(searchViewModel: WalletDaysSearchViewModel) {
    let params = new HttpParams();
    if (searchViewModel.DeliverymanID) {
      params = params.set("deliverymanID", searchViewModel.DeliverymanID.toString());
    }
   if (searchViewModel.ToDate && searchViewModel.FromDate) {
      params = params.set("fromDate", searchViewModel.FromDate);
      params = params.set("toDate", searchViewModel.ToDate);
    }
    return this.apiService.get(`/${this.controller}/GetDailyWalletSummary?`, params);
  }
}
