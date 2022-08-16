import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpecialTripViewModel } from 'src/app/components/onboarding/page/view-models/dispatch-create.model';
import { DispatchSearchViewModel } from 'src/app/components/onboarding/page/view-models/dispatch-search.model';
import { DispatchTripViewModel } from 'src/app/components/onboarding/page/view-models/dispatch.model';
import { ApiService } from '../../../../../service/api.service';

@Injectable({
  providedIn: 'root',
})

export class TripDataService {
  
  tripController='Trip';

  constructor(private _apiService:ApiService) { }

  getRunningTrips(searchViewModel:DispatchSearchViewModel) {
    let params = new HttpParams();
    if (searchViewModel.StoreID) {
      params = params.set("branchID", searchViewModel.StoreID.toString());
    }
    return this._apiService.get(`/${this.tripController}/GetRunningTrips`);
  }
  getTripReasonList() {
    return this._apiService.get(`/${this.tripController}/GetSpecialTripReasonList`);
  }
  getTripLog(code){
    return this._apiService.get(`/TripLog/GetByTripCode?code=${code}`)
  }
  getTripKPi() {
    return this._apiService.get(`/${this.tripController}/GetDispatchKPI`);
  }

  createSpecialTrip(model: SpecialTripViewModel) {
    return this._apiService.post(`/${this.tripController}/CreateSpecialTrip`, model);
  }
  cancelTrip(model:DispatchTripViewModel) {
    return this._apiService.update(`/${this.tripController}/CancelTrip`, model);
  }
  closeTrip(deliverymanID: number) {
    return this._apiService.get(`/${this.tripController}/CloseTrip?deliverymanID=${deliverymanID}`);
  }
  assignTripToDM(tripID, deliverymanID, tripNumber) {
    return this._apiService.get(`/${this.tripController}/AssignToDM?tripID=${tripID}&deliverymanID=${deliverymanID}&tripNumber=${tripNumber}`);
  }
}
