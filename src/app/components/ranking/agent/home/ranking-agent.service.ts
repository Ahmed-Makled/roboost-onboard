import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { DeliverymanRankByPointSearchViewModel } from './view-models/ranking-search.model';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class RankingAgentService {


  controller: string = "DeliverymanPoint";
  constructor(private apiService: ApiService) { }


  get(searchViewModel: DeliverymanRankByPointSearchViewModel, pageIndex: number, pageSize: number = 0) {

    let params = new HttpParams();
    if (searchViewModel.Date) {
      params = params.set("Date", searchViewModel.Date);
    }
    if (searchViewModel.ToDate) {
      params = params.set("toDate", searchViewModel.ToDate);
    }
    if (searchViewModel.FromDate) {
      params = params.set("fromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.BranchID) {
      params = params.set("BranchID", searchViewModel.BranchID.toString());
    }
    if (searchViewModel.DeliverymanID) {
      params = params.set("deliverymanID", searchViewModel.DeliverymanID.toString());
    }

    return this.apiService.get(`/${this.controller}/GetDeliverymanRankByPoint?pageIndex=${pageIndex}&pageSize=${pageSize}`, params);

  }
  getReport(searchViewModel: DeliverymanRankByPointSearchViewModel, pageIndex: number, pageSize: number = 0) {

    let params = new HttpParams();
    if (searchViewModel.Date) {
      params = params.set("Date", searchViewModel.Date);
    }
    if (searchViewModel.ToDate) {
      params = params.set("toDate", searchViewModel.ToDate);
    }
    if (searchViewModel.FromDate) {
      params = params.set("fromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.BranchID) {
      params = params.set("BranchID", searchViewModel.BranchID.toString());
    }
    if (searchViewModel.DeliverymanID) {
      params = params.set("deliverymanID", searchViewModel.DeliverymanID.toString());
    }

    return this.apiService.getFiles(`/${this.controller}/GetRankingReport`, params);

  }

  
}
