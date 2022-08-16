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


  get(searchViewModel: TripSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0, isArchive:boolean) {
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
    if(isArchive)
    return this._apiService.get(`/Trip/GetArchivedTrip?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,params);
    else return this._apiService.get(`/Trip/GetLiveTrip?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  
  }
 
  resetTrip(TripID: number) {
    return this._apiService.get(`/${this.controller}/ResetTrip?id=${TripID}`)
  }
  closeTrip(TripID: number) {
    return this._apiService.get(`/${this.controller}/CloseTrip?id=${TripID}`)
  }
  editTripRate(body: TripRateEditViewModel) {
    return this._apiService.update(`/${this.controller}/EditRate`, body);
  }

  remove(Id: number) {
    return this._apiService.remove(`/${this.controller}/Delete?id=${Id}`);
  }
  getTripsToAddOrder() {
    return this._apiService.get(`/${this.controller}/GetTripsToAddOrder`)
  }
  getTripOrder(orderID: number) {
    return this._apiService.get(`/${this.controller}/GetTripOrder?orderID=${orderID}`)
  }
  getColors(status: number) {
    if (status == 0) { return '#525252' }
    else if (status == 1) { return '#32cc3e' }
    else if (status == 2) { return '#03a8ff' }
    else if (status == 3) { return '#ffc400' }
    else if (status == 4) { return '#cc324c' }
  }
  getStatusColors(status: number) {
    if (status == 6 || status == 8) { return '#cc324c' }
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
    return this._apiService.getFiles(`/Trip/GetReport?orderBy=${orderBy}&isAscending=${isAscending}`, params);
  }
}
