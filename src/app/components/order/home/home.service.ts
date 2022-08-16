
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/service/api.service';
import { OrderSearchViewModel } from './view-models/order-search.model';
import { OrderCreateViewModel } from './view-models/order-create.model';


@Injectable({
  providedIn: 'root'
})
export class OrderHomeService {
  controller: string = "Order";
  constructor(private _apiService: ApiService) { }

  get(searchViewModel: OrderSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0,isArchive:boolean) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.OrderNumber) {
      params = params.set("OrderNumber", searchViewModel.OrderNumber);
    }
    if (searchViewModel.TripNumber) {
      params = params.set("TripNumber", searchViewModel.TripNumber.toString());
    }
    if (searchViewModel.Status) {
      params = params.set("Status", searchViewModel.Status.toString());
    }
    if (searchViewModel.Performance) {
      params = params.set("Performance", searchViewModel.Performance.toString());
    }
    if (searchViewModel.IsFastOrder) {
      params = params.set("isFastOrder", searchViewModel.IsFastOrder.toString());
    }
    if (searchViewModel.CustomerName) {
      params = params.set("CustomerName", searchViewModel.CustomerName.toString());
    }
    if (searchViewModel.CustomerMobile) {
      params = params.set("CustomerMobile", searchViewModel.CustomerMobile.toString());
    }
    if (searchViewModel.CustomerNumber) {
      params = params.set("CustomerNumber", searchViewModel.CustomerNumber.toString());
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
    if (searchViewModel.DeliverymanID) {
      params = params.set("deliverymanID", searchViewModel.DeliverymanID.toString());
    }
    if (searchViewModel.EnrollID != null) {
      params = params.set("enrollID", searchViewModel.EnrollID.toString());
    }
    if (searchViewModel.ServiceID != null) {
      params = params.set("serviceID", searchViewModel.ServiceID.toString());
    }
    if (searchViewModel.TripRate) {
      params = params.set("tripRate", searchViewModel.TripRate.toString());
    }
    if (searchViewModel.IsTransite) {
      params = params.set("isTransite", searchViewModel.IsTransite.toString());
    }
    
    if(!isArchive)
    return this._apiService.get(`/${this.controller}/GetLiveOrders?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,params);
    else  
    return this._apiService.get(`/${this.controller}/GetArchiveOrders?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`,params);

  }
  getReport(searchViewModel: any, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.OrderNumber) {
      params = params.set("OrderNumber", searchViewModel.OrderNumber);
    }
    if (searchViewModel.TripNumber) {
      params = params.set("TripNumber", searchViewModel.TripNumber.toString());
    }
    if (searchViewModel.Status) {
      params = params.set("Status", searchViewModel.Status.toString());
    }
    if (searchViewModel.Performance) {
      params = params.set("Performance", searchViewModel.Performance.toString());
    }
    if (searchViewModel.IsFastOrder) {
      params = params.set("isFastOrder", searchViewModel.IsFastOrder.toString());
    }
    if (searchViewModel.CustomerName) {
      params = params.set("CustomerName", searchViewModel.CustomerName.toString());
    }
    if (searchViewModel.CustomerMobile) {
      params = params.set("CustomerMobile", searchViewModel.CustomerMobile.toString());
    }
    if (searchViewModel.CustomerNumber) {
      params = params.set("CustomerNumber", searchViewModel.CustomerNumber.toString());
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
    if (searchViewModel.DeliverymanID) {
      params = params.set("deliverymanID", searchViewModel.DeliverymanID.toString());
    }
    if (searchViewModel.EnrollID != null) {
      params = params.set("enrollID", searchViewModel.EnrollID.toString());
    }
    if (searchViewModel.ServiceID != null) {
      params = params.set("serviceID", searchViewModel.ServiceID.toString());
    }
    if (searchViewModel.TripRate) {
      params = params.set("tripRate", searchViewModel.TripRate.toString());
    }
    return this._apiService.getFiles(`/${this.controller}/GetReport?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  creatRandomOrder() {
    return this._apiService.get(`/Integration/CreateRandomOrder`);
  }
  CanCreateRandomOrder() {
    return this._apiService.get(`/Integration/CanCreateRandomOrder`);
  }

}
