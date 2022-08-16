import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { OrderRevenueConfigurationViewModel } from './view-models/order-revenue-configuration.model';
import { TripRevenueConfigurationViewModel } from './view-models/trip-revenue-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class RevenueConfigurationService {

  
  controller : string = "Branch";
  constructor(private _apiService:ApiService) { }
  getOrderRevenueConfigurations(){
    return this._apiService.get(`/${this.controller}/GetOrderRevenueConfigurations`);
  }
 
  updateOrderRevenueConfig(list:OrderRevenueConfigurationViewModel[]){
    return this._apiService.update(`/${this.controller}/UpdateOrderRevenueConfig`,list);
  }
 
  getTripRevenueConfigurations(){
    return this._apiService.get(`/${this.controller}/GetTripRevenueConfigurations`);
  }
 
  updateTripRevenueConfig(list:TripRevenueConfigurationViewModel[]){
    return this._apiService.update(`/${this.controller}/UpdateTripRevenueConfig`,list);
  }
 
}
