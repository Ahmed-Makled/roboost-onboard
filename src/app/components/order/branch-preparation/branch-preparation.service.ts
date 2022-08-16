
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/service/api.service';
import { BranchPreparationSearchViewModel } from './view-models/branch-preparation-search.model';


@Injectable({
  providedIn: 'root'
})
export class BranchPreparationService {
  controller : string = "Order";
  constructor(private _apiService:ApiService) { }
  get(searchViewModel: BranchPreparationSearchViewModel) {
    let params = new HttpParams();
    if (searchViewModel.FromDate) {
      params = params.set("fromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.ToDate) {
      params = params.set("toDate", searchViewModel.ToDate);
    }
    return this._apiService.get(`/${this.controller}/GetAvgBranchPreparation`, params);
  }
}
