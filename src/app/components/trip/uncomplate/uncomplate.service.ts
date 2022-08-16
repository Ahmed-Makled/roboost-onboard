import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/service/api.service';
import { TripSearchViewModel } from './view-models/trip-search.model';
import { TripRateEditViewModel } from './view-models/trip-create.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  controller: string = "Trip";
  constructor(private _apiService: ApiService) { }


  get(searchViewModel: TripSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0,) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.ID) {
      params = params.set("ID", searchViewModel.ID.toString());
    }
    if (searchViewModel.Status) {
      params = params.set("Status", searchViewModel.Status.toString());
    }
    if (searchViewModel.Performance) {
      params = params.set("Performance", searchViewModel.Performance.toString());
    }
    if (searchViewModel.DeliverymanID) {
      params = params.set("DeliverymanID", searchViewModel.DeliverymanID.toString());
    }
    if (searchViewModel.EnrollID) {
      params = params.set("enrollID", searchViewModel.EnrollID);
    }
    if (searchViewModel.IsSpecialTrip) {
      params = params.set("isSpecialTrip", searchViewModel.IsSpecialTrip.toString());
    }
    if (searchViewModel.Number) {
      params = params.set("Number", searchViewModel.Number.toString());
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
    return this._apiService.get(`/${this.controller}/GetLiveTrip?isUncompleted=${true} &orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);

  }
  getReport(searchViewModel: TripSearchViewModel, orderBy: string, isAscending: boolean) {
    let params = new HttpParams();
    if (searchViewModel.ID) {
      params = params.set("ID", searchViewModel.ID.toString());
    }
    if (searchViewModel.Status) {
      params = params.set("Status", searchViewModel.Status.toString());
    }
    if (searchViewModel.Performance) {
      params = params.set("Performance", searchViewModel.Performance.toString());
    }
    if (searchViewModel.DeliverymanID) {
      params = params.set("DeliverymanID", searchViewModel.DeliverymanID.toString());
    }
    if (searchViewModel.EnrollID) {
      params = params.set("enrollID", searchViewModel.EnrollID);
    }
    if (searchViewModel.IsSpecialTrip) {
      params = params.set("isSpecialTrip", searchViewModel.IsSpecialTrip.toString());
    }
    if (searchViewModel.Number) {
      params = params.set("Number", searchViewModel.Number.toString());
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

    return this._apiService.getFiles(`/${this.controller}/GetReport?orderBy=${orderBy}&isAscending=${isAscending}`, params);
  }
}
