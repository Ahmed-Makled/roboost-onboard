import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { DeliverymanSearchViewModel } from './view-models/deliveryman-search.model';
import { AgentChangeStoreViewModel, DeliverymanCreateViewModel } from './view-models/deliveryman-create.model';
import { ApiService } from 'src/app/service/api.service';
import { PersonalInformationViewModel } from '../deliveryman-profile/_partial/personal-info/personal-info-view-model';

@Injectable({
  providedIn: 'root',
})
export class DeliverymanService {

  controller: string = 'Deliveryman';
  constructor(private _apiService: ApiService) { }

  get(searchViewModel: DeliverymanSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0) pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.ID) {
      params = params.set('ID', searchViewModel.ID.toString());
    }
    if (searchViewModel.Name) {
      params = params.set('Name', searchViewModel.Name.toString());
    }
    if (searchViewModel.Email) {
      params = params.set('Email', searchViewModel.Email.toString());
    }
    if (searchViewModel.Mobile) {
      params = params.set('Mobile', searchViewModel.Mobile.toString());
    }
    if (searchViewModel.AppVersionNumber) {
      params = params.set('AppVersionNumber', searchViewModel.AppVersionNumber.toString());
    }
    if (searchViewModel.DeviceType || searchViewModel.DeviceType == 0) {
      params = params.set('DeviceType', searchViewModel.DeviceType.toString());
    }
    if (searchViewModel.Status) {
      params = params.set('Status', searchViewModel.Status.toString());
    }
    if (searchViewModel.branchID) {
      params = params.set('branchID', searchViewModel.branchID.toString());
    }
    if (searchViewModel.EnrollID != null) {
      params = params.set('enrollID', searchViewModel.EnrollID.toString());
    }
    if (searchViewModel.IsArchive) {
      params = params.set('IsArchive', searchViewModel.IsArchive.toString());
    }
    return this._apiService.get(`/${this.controller}/Get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }

  postOrUpdate(body: DeliverymanCreateViewModel) {
    if (body.ID == 0) {
      return this._apiService.post(`/${this.controller}/Post`, body);
    } else return this._apiService.update(`/${this.controller}/Put`, body);
  }
  startShift(deliverymanID: number) {
    return this._apiService.post(`/AvailabilityRequest/Post?deliverymanID=${deliverymanID}`, {});
  }
  endShift(deliverymanID: number) {
    return this._apiService.get(`/${this.controller}/EndShift?deliverymanID=${deliverymanID}`);
  }
  addToQueue(Id: number) {
    return this._apiService.get(`/${this.controller}/AddToQueue?deliverymanID=${Id}`);
  }
  changeStore(model: AgentChangeStoreViewModel) {
    return this._apiService.update(`/${this.controller}/ChangeBranch?branchID=${model.StoreID}&deliverymanID=${model.ID}`);
  }
  archive(Id: number) {
    return this._apiService.remove(`/${this.controller}/Archive?id=${Id}`);
  }
  unArchive(Id: number) {
    return this._apiService.update(`/${this.controller}/UnArchive?id=${Id}`);
  }
  logOut(Id: number) {
    return this._apiService.get(`/${this.controller}/LogOutFromAllDevices?deliverymanID=${Id}`);
  }
  endBreak(id: number) {
    return this._apiService.get(`/DeliverymanBreak/Close?deliverymanID=${id}`);
  }
  startBreak(id: number) {
    return this._apiService.get(`/DeliverymanBreak/Start?deliverymanID=${id}`);
  }
  removePenalize(model: { DeliverymanID: number }) {
    return this._apiService.update(`/DeliverymanPenalize/Remove`, model);
  }
  changePassword(body) {
    // return this._apiService.update(`/${this.controller}/ChangePassword`, body);
    return this._apiService.update(`/owner/DeliverymanProfile/ChangePassword`, body);
  }
  updatePersonalInfo(body: PersonalInformationViewModel) {
    return this._apiService.update(`/${this.controller}/UpdatePersonalInfo`, body);
  }
  startTracking(Id: number) {
    return this._apiService.post(`/Demo/StartTracking?deliverymanID=${Id}&interval=${10}&syncInterval=${30}`);
  }

  getDeliverymanDetails(id: number) {
    return this._apiService.get(`/${this.controller}/GetDeliverymanDetails?id=${id}`);
  }
  getDMMainInfo(id: number) {
    return this._apiService.get(`/${this.controller}/GetDMMainInfo?id=${id}`);
  }
  getTripPerformanceData(deliverymanID, numberOfDays) {
    return this._apiService.get(`/Trip/GetTripPerformanceData?deliverymanID=${deliverymanID}&numberOfDays=${numberOfDays}`);
  }
  getDMTripsLineChart(deliverymanID, numberOfDays) {
    return this._apiService.get(`/Trip/GetDMTripsColumnChart?deliverymanID=${deliverymanID}&numberOfDays=${numberOfDays}`);
  }
  getOrderPerformanceData(deliverymanID, numberOfDays) {
    return this._apiService.get(`/Order/GetOrderPerformanceData?deliverymanID=${deliverymanID}&numberOfDays=${numberOfDays}`);
  }
  getDeliverymanOrdersLineChart(deliverymanID, numberOfDays) {
    return this._apiService.get(`/Order/GetDeliverymanOrdersLineChart?deliverymanID=${deliverymanID}&numberOfDays=${numberOfDays}`);
  }
  getDMPersonalInfo(id: number) {
    return this._apiService.get(`/${this.controller}/GetDMPersonalInfo?id=${id}`);
  }
  getDMWalletSummary(deliverymanID, numOfDays: number) {
    return this._apiService.get(`/owner/DeliverymanProfile/GetDMWalletSummary?deliverymanID=${deliverymanID}&numOfDays=${numOfDays}`);
  }
  getDMRewards(id: number, numOfDays: number) {
    return this._apiService.get(`/${this.controller}/GetDMRewards?id=${id}&numOfDays=${numOfDays}`);
  }
  updateDeliverymanServices(body) {
    return this._apiService.update(`/${this.controller}/UpdateDeliverymanServices`, body);
  }
  getDeliverymanOnDutyLineChart(deliverymanID: number, numOfDays: number) {
    return this._apiService.get(`/Trip/GetDeliverymanOnDutyLineChart?deliverymanID=${deliverymanID}&numOfDays=${numOfDays}`);
  }
  getDeliverymanStatistic(deliverymanID: number, numOfDays: number) {
    return this._apiService.get(`/${this.controller}/GetOnDutyInfo?deliverymanID=${deliverymanID}&numOfDays=${numOfDays}`);
  }
  getAvgOnShift(deliverymanID: number, numOfDays: number) {
    return this._apiService.get(`/${this.controller}/GetAVGOnShiftTime?deliverymanID=${deliverymanID}&numOfDays=${numOfDays}`);
  }
}
