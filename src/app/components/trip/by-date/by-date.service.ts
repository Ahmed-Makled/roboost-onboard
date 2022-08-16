import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/service/api.service';
import { TripSearchViewModel } from '../home/view-models/trip-search.model';

@Injectable({
  providedIn: 'root'
})
export class TripByDateService {
  controller: string = "Trip";
  constructor(private _apiService: ApiService) { }

  get(searchViewModel: TripSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate.toString());
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate.toString());
    }
    if (searchViewModel.BranchID) {
      params = params.set("branchID", searchViewModel.BranchID.toString());
    }
    return this._apiService.get(`/${this.controller}/GetPerformanceDetailByDate?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getReport(searchViewModel: TripSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate.toString());
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate.toString());
    }
    if (searchViewModel.BranchID) {
      params = params.set("branchID", searchViewModel.BranchID.toString());
    }
    return this._apiService.getFiles(`/${this.controller}/GetPerformanceDetailByDateReport?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
}
