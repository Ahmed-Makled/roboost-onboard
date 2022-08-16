import { Injectable } from '@angular/core';
import { OrderBranchConfigurationViewModel } from './view-models/order-branch-configuration.model';
import { TripBranchConfigurationViewModel } from './view-models/trip-branch-configuration.model';
import { AddressBranchConfigurationViewModel } from './_partial/address-branch-configuration/view-models/address-branch-configuration.model';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class BranchProfileService {

  
  controller : string = "owner/BranchConfiguration";
  constructor(private _apiService:ApiService) { }
  getLastAddressConfiguration(branchID:number){
    return this._apiService.get(`/${this.controller}/GetBranchAddressConfigration?branchID=${branchID}`);
  }
  updateAddressConfiguration(model:AddressBranchConfigurationViewModel){
    return this._apiService.update(`/Branch/UpdateAddressConfiguration`,model);
  }
  getLastOrderConfiguration(branchID:number){
    return this._apiService.get(`/Branch/GetLastOrderConfiguration?branchID=${branchID}`);
  }
  updateOrderConfiguration(model:OrderBranchConfigurationViewModel){
    return this._apiService.update(`/Branch/UpdateOrderConfiguration`,model);
  }
  getLastTripConfiguration(branchID:number){
    return this._apiService.get(`/Branch/GetBranchTripConfigration?branchID=${branchID}`);
  }
  updateTripConfiguration(model:TripBranchConfigurationViewModel){
    return this._apiService.update(`/Branch/UpdateTripConfiguration`,model);
  }
  getQrCode(branchID:number){
    return this._apiService.get(`/Branch/GetQrCode?branchID=${branchID}`);
  }
  updateQRCode(branchID:number){
    return this._apiService.update(`/Branch/UpdateQrCode?branchID=${branchID}`)
  }
  getKPI(branchID:number){
    return this._apiService.get(`/owner/branch/GetBranchProfileKPI?branchID=${branchID}`);
  }
 
}
