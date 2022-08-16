import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class CallCenterService {



  constructor(private apiService: ApiService) { }

  getCustomerMainInfo(id: number, phone: string) {
    let params = new HttpParams();
    if (phone) {
      params = params.set("phone", phone);
    }
    else {
      params = params.set("id", id.toString());
    }
    return this.apiService.get(`/Customer/GetCustomerMainInfo`, params);
  }


  getCustomerProfileKPI(id: number, phone: string) {
    let params = new HttpParams();
    if (phone) {
      params = params.set("phone", phone);
    }
    else {
      params = params.set("customerID", id.toString());
    }
    return this.apiService.get(`/Order/GetCustomerProfileKPI`, params);
  }
  getCustomerBranches(id: number, phone: string) {
    let params = new HttpParams();
    if (phone) {
      params = params.set("phone", phone);
    }
    else {
      params = params.set("customerID", id.toString());
    }
    return this.apiService.get(`/Branch/GetCustomerAndClosestBranchesLocations`, params);
  }
  getCustomerOrders(id: number, phone: string) {
    let params = new HttpParams();
    if (phone) {
      params = params.set("phone", phone);
    }
    else {
      params = params.set("customerID", id.toString());
    }
    return this.apiService.get(`/Order/GetCustomerOrders`, params);
  }
  getCustomerOrdersPieChart(id: number, phone: string) {
    let params = new HttpParams();
    if (phone) {
      params = params.set("phone", phone);
    }
    else {
      params = params.set("id", id.toString());
    }
    return this.apiService.get(`/Customer/GetCustomerOrdersPieChart`, params);
  }
  getCustomerOrdersLineChartByMonth(id: number, phone: string) {
    let params = new HttpParams();
    if (phone) {
      params = params.set("phone", phone);
    }
    else {
      params = params.set("id", id.toString());
    }
    return this.apiService.get(`/Order/GetCustomerOrdersByMonth`, params);
  }
  getCustomerOrdersLineChartByDay(id: number, phone: string) {
    let params = new HttpParams();
    if (phone) {
      params = params.set("phone", phone);
    }
    else {
      params = params.set("id", id.toString());
    }
    return this.apiService.get(`/Order/GetCustomerOrdersByMonth`, params);
  }
}
