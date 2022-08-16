import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/service/api.service';
import { TripValidationRequestSearchViewModel } from './view-models/validation-request-search.model';

@Injectable({
  providedIn: 'root'
})
export class TripValidationRequestService {
  
  controller: string = "TripValidationRequest";
  constructor(private _apiService: ApiService) { }

  get(searchViewModel: TripValidationRequestSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.ID) {
      params = params.set("ID", searchViewModel.ID.toString());
    }
    if (searchViewModel.tripID) {
      params = params.set("tripID", searchViewModel.tripID.toString());
    }
    if (searchViewModel.number) {
      params = params.set("number", searchViewModel.number.toString());
    }
    if (searchViewModel.Status) {
      params = params.set("Status", searchViewModel.Status.toString());
    }
    if (searchViewModel.RequestStatus != null) {
      params = params.set("requestStatus", searchViewModel.RequestStatus.toString());
    }
    if (searchViewModel.Performance) {
      params = params.set("Performance", searchViewModel.Performance.toString());
    }
    if (searchViewModel.deliverymanID) {
      params = params.set("deliverymanID", searchViewModel.deliverymanID.toString());
    }
    if (searchViewModel.supervisorID) {
      params = params.set("supervisorID", searchViewModel.supervisorID.toString());
    }
    if (searchViewModel.number) {
      params = params.set("number", searchViewModel.number.toString());
    }
    if (searchViewModel.BranchID) {
      params = params.set("branchID", searchViewModel.BranchID.toString());
    }

    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate.toString());
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate.toString());
    }

    return this._apiService.get(`/${this.controller}/get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getReport(searchViewModel: TripValidationRequestSearchViewModel, orderBy: string, isAscending: boolean) {
    let params = new HttpParams();
    if (searchViewModel.ID) {
      params = params.set("ID", searchViewModel.ID.toString());
    }
    if (searchViewModel.tripID) {
      params = params.set("tripID", searchViewModel.tripID.toString());
    }
    if (searchViewModel.number) {
      params = params.set("number", searchViewModel.number.toString());
    }
    if (searchViewModel.Status) {
      params = params.set("Status", searchViewModel.Status.toString());
    }
    if (searchViewModel.RequestStatus != null) {
      params = params.set("requestStatus", searchViewModel.RequestStatus.toString());
    }
    if (searchViewModel.Performance) {
      params = params.set("Performance", searchViewModel.Performance.toString());
    }
    if (searchViewModel.deliverymanID) {
      params = params.set("deliverymanID", searchViewModel.deliverymanID.toString());
    }
    if (searchViewModel.supervisorID) {
      params = params.set("supervisorID", searchViewModel.supervisorID.toString());
    }
    if (searchViewModel.number) {
      params = params.set("number", searchViewModel.number.toString());
    }
    if (searchViewModel.BranchID) {
      params = params.set("branchID", searchViewModel.BranchID.toString());
    }
    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate.toString());
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate.toString());
    }

    return this._apiService.getFiles(`/${this.controller}/getReport?orderBy=${orderBy}&isAscending=${isAscending}`, params);
  }
}
