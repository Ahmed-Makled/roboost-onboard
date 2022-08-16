import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ScheduledOrderViewModel, UpdateOrderInfoViewModel } from 'src/app/components/dispatch/page/view-models/dispatch-create.model';
import { DispatchSearchViewModel } from 'src/app/components/dispatch/page/view-models/dispatch-search.model';
import { OrderCreateViewModel } from 'src/app/components/dispatch/page/view-models/order-create.model';
import { ApiService } from '../../../../../service/api.service';

@Injectable({
  providedIn: 'root',
})

export class TaskDataService {

  orderController='Order';
  
  constructor(private _apiService:ApiService) { }
  
  getRunningOrders(searchViewModel:DispatchSearchViewModel) {
    let params = new HttpParams();
    if (searchViewModel.StoreID) {
      params = params.set("branchID", searchViewModel.StoreID.toString());
    }
    return this._apiService.get(`/${this.orderController}/GetDispatcherOrders`);
  }
  getCustomerByMobile(customerMobile: string) {
    return this._apiService.get(`/Customer/GetCustomerByMobile?mobile=${customerMobile}`);
  }
  getOrderKPi() {
    return this._apiService.get(`/${this.orderController}/GetDispatchKPI`);
  }
  getTaskLog(code:string){
    return this._apiService.get(`/OrderLog/GetByOrderCode?code=${code}`);
  }
  getTripLog(code){
    return this._apiService.get(`/TripLog/GetByTripCode?code=${code}`)
  }

  addToTrip(orderID, tripID,isChangeTrip:boolean) {
    if(isChangeTrip)
    return this._apiService.update(`/${this.orderController}/RemoveFromTrip?orderId=${orderID}&tripID=${tripID}`);
    else
    return this._apiService.update(`/${this.orderController}/AddToTrip?orderID=${orderID}&tripID=${tripID}`);
  }
  removeFromTrip(orderID: number) {``
    return this._apiService.update(`/${this.orderController}/RemoveFromTrip?orderId=${orderID}`);
  }
  createOrder(model: OrderCreateViewModel) {
    return this._apiService.post(`/${this.orderController}/CreateFastOrder`, model);
  }
  cancelOrder(orderID: number) {
    return this._apiService.update(`/${this.orderController}/CancelOrder?orderId=${orderID}`);
  }
  pauseOrder(orderID) {
    return this._apiService.update(`/${this.orderController}/PauseOrder?orderID=${orderID}`);
  }
  unPauseOrder(orderID) {
    return this._apiService.update(`/${this.orderController}/UnPauseOrder?orderID=${orderID}`);
  }
  changeOrderPriority(orderID: number, topPriority: boolean) {
    return this._apiService.update(`/${this.orderController}/ChangePriority?orderId=${orderID}&TopPriority=${topPriority}`);
  }
  setOrderAsDelivered(id: number) {
    return this._apiService.update(`/${this.orderController}/DeliverOrder?id=${id}`);
  }
  setOrderAsReady(orderID: number) {
    return this._apiService.update(`/${this.orderController}/SetAsReady?id=${orderID}`);
  }
  setOrderAsInProgress(orderID: number) {
    return this._apiService.update(`/${this.orderController}/SetAsInProgress?id=${orderID}`);
  }
  setOrderAsNew(orderID: number) {
    return this._apiService.update(`/${this.orderController}/SetAsNew?id=${orderID}`);
  }
  scheduledOrder(model: ScheduledOrderViewModel) {
    model.ScheduledTime = moment(model.ScheduledTime).format('YYYY-MM-DD HH:mm');
    return this._apiService.update(`/ScheduledOrder/ScheduleOrder`, model);
  }
  getOrderServices(id: number) {
    return this._apiService.get(`/dispatcher/Dispatcher/GetOrderServices?orderID=${id}`);
  }
  updateOrderInfo(model: UpdateOrderInfoViewModel) {
    return this._apiService.update(`/${this.orderController}/UpdateOrderInfo`, model);
  }
  cancelOTP(orderID: number){
    return this._apiService.update(`/${this.orderController}/CancelOTP?orderID=${orderID}`);
  }
}
