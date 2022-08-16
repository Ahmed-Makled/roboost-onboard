import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})  
export class CustomerProfileService {
  constructor(private _apiService: ApiService) { }

  getCustomerOrder(orderID) {
    return this._apiService.get(`/Order/GetCustomerOrder?orderID=${orderID}`);
  }
  getCustomerByMobile(customerMobile: string) {
    return this._apiService.get(`/Order/GetCustomerByMobile?mobile=${customerMobile}`);
  }
  getCustomerMainInfo(id: number) {
    let params = new HttpParams();
    params = params.set("id", id.toString());
    return this._apiService.get(`/Customer/GetCustomerMainInfo`, params);
  }
  getCustomerProfileKPI(id: number) {
    let params = new HttpParams();
    params = params.set("customerID", id.toString());
    return this._apiService.get(`/Order/GetCustomerProfileKPI`, params);
  }
  getCustomerBranches(id: number) {
    let params = new HttpParams();
    params = params.set("customerID", id.toString());
    return this._apiService.get(`/Branch/GetCustomerAndClosestBranchesLocations`, params);
  }
  getCustomerOrders(id: number) {
    let params = new HttpParams();
    params = params.set("customerID", id.toString());
    return this._apiService.get(`/Order/GetCustomerOrders`, params);
  }
  getCustomerOrdersPieChart(id: number) {
    let params = new HttpParams();
    params = params.set("id", id.toString());
    return this._apiService.get(`/Customer/GetCustomerOrdersPieChart`, params);
  }
  getCustomerOrdersLineChartByMonth(id: number) {
    let params = new HttpParams();
    params = params.set("id", id.toString());
    return this._apiService.get(`/Order/GetCustomerOrdersByMonth`, params);
  }
  getCustomerOrdersLineChartByDay(id: number) {
    let params = new HttpParams();
    params = params.set("id", id.toString());
    return this._apiService.get(`/Order/GetCustomerOrdersByDay`, params);
  }
}
