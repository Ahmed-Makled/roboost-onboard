
import { Injectable } from '@angular/core';


import { HttpParams } from '@angular/common/http';
import { ValidateViewModel } from './view-models/validate.model';
import { DeliverymanValidationSearchViewModel } from './view-models/deliveryman-validation-search.model';
import { ApiService } from 'src/app/service/api.service';


@Injectable({
  providedIn: 'root'
})
export class DeliverymanValidationService {

  controller: string = "SettlementRequest";
  constructor(private apiService: ApiService) { }

  get(searchViewModel: DeliverymanValidationSearchViewModel) {

    let params = new HttpParams();

    if (searchViewModel.BranchID) {
      params = params.set("branchID", searchViewModel.BranchID.toString());
    }
    if (searchViewModel.DeliverymanID) {
      params = params.set("deliverymanID", searchViewModel.DeliverymanID.toString());
    }
    if (searchViewModel.Date && searchViewModel.Date != "Invalid date") {
      params = params.set("date", searchViewModel.Date);
    }
    else if (searchViewModel.ToDate && searchViewModel.FromDate) {
      params = params.set("fromDate", searchViewModel.FromDate);
      params = params.set("toDate", searchViewModel.ToDate);
    }
    return this.apiService.get(`/${this.controller}/Get`, params);
  }
  post(validate: ValidateViewModel[]) {
    return this.apiService.post(`/${this.controller}/Post`, validate);
  }
}
