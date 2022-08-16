
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/service/api.service';
import { UserPreparationSearchViewModel } from './view-models/user-preparation-search.model';


@Injectable({
  providedIn: 'root'
})
export class UserPreparationService {
  controller : string = "Order";
  constructor(private _apiService:ApiService) { }
  get(searchViewModel: UserPreparationSearchViewModel) {
    let params = new HttpParams();
    if (searchViewModel.FromDate) {
      params = params.set("fromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.ToDate) {
      params = params.set("toDate", searchViewModel.ToDate);
    }
    if (searchViewModel.BranchID) {
      params = params.set("branchID", searchViewModel.BranchID.toString());
    }
    return this._apiService.get(`/${this.controller}/GetAvgUserPreparation`, params);
  }
}
