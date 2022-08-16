import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { BranchDeliveryTimeSearchViewModel } from './view-models/branch-avgdeliverytime-search.model';
import { ApiService } from 'src/app/service/api.service';
@Injectable({
  providedIn: 'root'
})
export class BranchAvgDeliveryTimeService {
  constructor(private _apiService: ApiService) { }
  get(searchViewModel: BranchDeliveryTimeSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.ID) {
      params = params.set("ID", searchViewModel.ID.toString());
    }
    if (searchViewModel.NameArabic) {
      params = params.set("NameArabic", searchViewModel.NameArabic.toString());
    }
    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate);
    }
    return this._apiService.get(`/Order/GetOrderAvgDeliveryTimeByBranch?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getReport(searchViewModel: BranchDeliveryTimeSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.ID) {
      params = params.set("ID", searchViewModel.ID.toString());
    }
    if (searchViewModel.NameArabic) {
      params = params.set("NameArabic", searchViewModel.NameArabic.toString());
    }
    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate);
    }
    return this._apiService.getFiles(`/owner/dashboard/GetOrderAvgDeliveryTimeByBranchReport?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }

}
