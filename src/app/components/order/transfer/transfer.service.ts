import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { TransferSearchViewModel } from './view-model/transfer-search.model';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  controller: string = 'Transfer';
  constructor(private _apiService: ApiService) { }

  get(searchViewModel: TransferSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.ToBranch) {
      params = params.set('ToBranch', searchViewModel.ToBranch.toString());
    }
    if (searchViewModel.TransferNumber) {
      params = params.set('TransferNumber', searchViewModel.TransferNumber.toString());
    }
    if (searchViewModel.OrderNumber) {
      params = params.set('OrderNumber', searchViewModel.OrderNumber.toString());
    }
    if (searchViewModel.ToBranchID) {
      params = params.set('ToBranchID', searchViewModel.ToBranchID.toString());
    }
    if (searchViewModel.FromBranchID) {
      params = params.set('FromBranchID', searchViewModel.FromBranchID.toString());
    }
    if (searchViewModel.FromDate) {
      params = params.set('FromDate', searchViewModel.FromDate.toString());
    }
    if (searchViewModel.ToDate) {
      params = params.set('ToDate', searchViewModel.ToDate.toString());
    }
    return this._apiService.get(`/${this.controller}/get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }

  getReport(searchViewModel: TransferSearchViewModel, orderBy: string, isAscending: boolean) {
    let params = new HttpParams();
    if (searchViewModel.TransferNumber) {
      params = params.set('TransferNumber', searchViewModel.TransferNumber.toString());
    }
    if (searchViewModel.OrderNumber) {
      params = params.set('OrderNumber', searchViewModel.OrderNumber.toString()
      );
    }
    if (searchViewModel.ToBranchID) {
      params = params.set('ToBranchID', searchViewModel.ToBranchID.toString());
    }
    if (searchViewModel.FromBranchID) {
      params = params.set('FromBranchID', searchViewModel.FromBranchID.toString());
    }
    if (searchViewModel.FromDate) {
      params = params.set('FromDate', searchViewModel.FromDate.toString());
    }
    if (searchViewModel.ToDate) {
      params = params.set('ToDate', searchViewModel.ToDate.toString());
    }
    return this._apiService.getFiles(`/${this.controller}/GetReport?orderBy=${orderBy}&isAscending=${isAscending}`, params);
  }
}
