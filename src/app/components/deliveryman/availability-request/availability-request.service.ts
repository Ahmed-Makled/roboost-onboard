
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { AvailabilityRequestSearchViewModel } from './view-models/availability-request-search.model';
import { ApiService } from 'src/app/service/api.service';


@Injectable({
  providedIn: 'root'
})
export class AvailabilityRequestService {

  controller: string = "AvailabilityRequest";
  constructor(private _apiService: ApiService) { }

  get(searchViewModel: AvailabilityRequestSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.ID) {
      params = params.set("ID", searchViewModel.ID.toString());
    }
    if (searchViewModel.Status != null) {
      params = params.set("Status", searchViewModel.Status.toString());
    }
    if (searchViewModel.DeliverymanID) {
      params = params.set("DeliverymanID", searchViewModel.DeliverymanID.toString());
    }
    if (searchViewModel.BranchID) {
      params = params.set("BranchID", searchViewModel.BranchID.toString());
    }
    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate.toString());
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate.toString());
    }
    return this._apiService.get(`/${this.controller}/Get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }

}
