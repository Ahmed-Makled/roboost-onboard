import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ResponseViewModel } from '../model/shared/response.model';
import { ApiService } from './api.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  constructor(private _apiService: ApiService, private _sharedService: SharedService) {}

  getRoleList(){
    return this._apiService.get("/Role/GetList")
  }
  getModuleList(){
    return this._apiService.get("/Module/GetList")
  }
  getFeatureList(){
    return this._apiService.get("/Feature/GetFeatureModuleList")
  }
  getCompanyFeatureList(){
    return this._apiService.get("/CompanyFeature/GetFeatureModuleList")
  }

  getCompanyList() {
    if (this._sharedService._storageService.getISSingleStore()) {
      let resultViewModel: ResponseViewModel = { Data: [], Success: true, Message: '', };
      return of(resultViewModel);
    }
    return this._apiService.get(`/Company/GetCompanyList`);
  }
  getAreaList() {
    if (this._sharedService._storageService.getISSingleStore()) {
      let resultViewModel: ResponseViewModel = { Data: [], Success: true, Message: '', };
      return of(resultViewModel);
    }
    return this._apiService.get(`/Area/GetAreaList`);
  }
  getBranchList(areaID?:number) {
    if (this._sharedService._storageService.getISSingleStore()) {
      let resultViewModel: ResponseViewModel = { Data: [], Success: true, Message: '', };
      return of(resultViewModel);
    }
    let params = new HttpParams();
    if (areaID) {
      params = params.set("areaID", areaID.toString());
    }
    return this._apiService.get(`/Branch/GetBranchesList`,params);
  }
  
  getBranchListWithLocation(areaID?:number) {
    // if (this._sharedService._storageService.getISSingleStore()) {
    //   let resultViewModel: ResponseViewModel = { Data: [{ID:null,Name:""}], Success: true, Message: '', };
    //   return of(resultViewModel);
    // }
    let params = new HttpParams();
    if (areaID) {
      params = params.set("areaID", areaID.toString());
    }
    return this._apiService.get(`/Branch/GetBranchesLocation`,params);
  }

  // getSupervisorList(){
  //   return this._apiService.get(`/Owner/Supervisor/GetSupervisorList` );
  // }
 
  //// trip
  getTripStatusList(){
    return this._apiService.get(`/Trip/GetStatusList`)
  }
  getTripRateList(){
    return this._apiService.get(`/Trip/GetTripRateOptionList`)
  }
  getTripRateEditReasonList(){
    return this._apiService.get(`/Trip/GetTripRateEditReasons`)
  }
  getTripValidationStatusList(){
    return this._apiService.get(`/TripValidationRequest/GetStatusList`)
  }


  //// order
  getOrderStatusList(){
    return this._apiService.get(`/Order/GetStatusList`)
  }
  getOrderPerformanceList(){
    return this._apiService.get(`/Order/GetPerformanceList`)
  }

  //// deliverman
  getDeliverymanList(branchID?: number,areaID?:number) {
    let params = new HttpParams();
    if (areaID) {
      params = params.set("areaID", areaID.toString());
    }
    if (branchID) {
      params = params.set("branchID", branchID.toString());
    }
    return this._apiService.get(`/Deliveryman/GetdeliverymanList`,params);
  }
  getDeliverymanStatusList() {
    return this._apiService.get(`/Deliveryman/GetStatusList`);
  }
  getAvailabilityRequestStatusList() {
    return this._apiService.get(`/AvailabilityRequest/GetStatusList`);
  }
  getAgentListWithStatus() {
    return this._apiService.get(`/Deliveryman/GetAgentListWithStatus`);
  }
  getDeviceTypeList() {
    return this._apiService.get(`/Deliveryman/GetDeviceTypeList`);
  }
  //// items
  getServiceList() {
    return this._apiService.get(`/Item/GetServicesItems`);
  }
  getUserRolesList(){
    return this._apiService.get(`/Role/GetList`);
  }

  getServicesItems() {
    return this._apiService.get(`/Item/GetServicesItems`)
  }
  getOrderReasonList() {
    return this._apiService.get(`/Order/GetFastOrderReasonList`);
  }

}
