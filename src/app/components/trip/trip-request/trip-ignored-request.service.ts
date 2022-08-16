
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { TripRequestSearchViewModel } from './view-models/trip-request-search.model';
import { ApiService } from 'src/app/service/api.service';


@Injectable({
  providedIn: 'root'
})
export class TripIngoredExpiredRequestService {
  controller: string = "TripRequest";
  constructor(private _apiService: ApiService) { }

  get(searchViewModel: TripRequestSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.ID) {
      params = params.set("ID", searchViewModel.ID.toString());
    }
    if (searchViewModel.TripNumber) {
      params = params.set("TripNumber", searchViewModel.TripNumber.toString());
    }
    if (searchViewModel.DeliverymanID) {
      params = params.set("DeliverymanID", searchViewModel.DeliverymanID.toString());
    }
    if (searchViewModel.Status) {
      params = params.set("Status", searchViewModel.Status.toString());
    }
    if (searchViewModel.FromDate) {
      params = params.set("FromDate", searchViewModel.FromDate);
    }
    if (searchViewModel.ToDate) {
      params = params.set("ToDate", searchViewModel.ToDate);
    }
    if (searchViewModel.branchID) {
      params = params.set("branchID", searchViewModel.branchID.toString());
    }
    return this._apiService.get(`/${this.controller}/get?isUncompleted=${true}&orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }


  getStatusList() {
    return this._apiService.get(`/${this.controller}/GetStatusList`)
  }

  remove(list: number[]) {
    return this._apiService.post(`/${this.controller}/Delete`, list);
  }

}
