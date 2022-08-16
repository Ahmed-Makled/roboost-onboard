
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/service/api.service';
import { OrderSearchViewModel } from '../home/view-models/order-search.model';


@Injectable({
  providedIn: 'root'
})
export class OrderPerformanceService {
  controller: string = "Order";
  constructor(private _apiService: ApiService) { }

  getByBranch(searchViewModel: OrderSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate);
    }
    if (searchViewModel.branchID) {
      params = params.set("branchID", searchViewModel.branchID.toString());
    }
    return this._apiService.get(`/${this.controller}/GetPerformanceDetailsByBranch?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getByBranchReport(searchViewModel: OrderSearchViewModel, orderBy: string, isAscending: boolean) {
    let params = new HttpParams();
    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate);
    }
    if (searchViewModel.branchID) {
      params = params.set("branchID", searchViewModel.branchID.toString());
    }
    return this._apiService.getFiles(`/${this.controller}/GetReportByBranch?orderBy=${orderBy}&isAscending=${isAscending}`, params);
  }

  getByDate(searchViewModel: OrderSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate);
    }
    if (searchViewModel.branchID) {
      params = params.set("branchID", searchViewModel.branchID.toString());
    }
    return this._apiService.get(`/${this.controller}/GetPerformanceDetailsByDate?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getByDateReport(searchViewModel: OrderSearchViewModel, orderBy: string, isAscending: boolean) {
    let params = new HttpParams();
    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate);
    }
    if (searchViewModel.branchID) {
      params = params.set("branchID", searchViewModel.branchID.toString());
    }
    return this._apiService.getFiles(`/${this.controller}/GetReportByDate?orderBy=${orderBy}&isAscending=${isAscending}`, params);
  }

  getByDeliveryman(searchViewModel: OrderSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();

    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate);
    }
    if (searchViewModel.branchID) {
      params = params.set("branchID", searchViewModel.branchID.toString());
    }

    return this._apiService.get(`/${this.controller}/GetPerformanceDetailsByDeliveryman?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
}
