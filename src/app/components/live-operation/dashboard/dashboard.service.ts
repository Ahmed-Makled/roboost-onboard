import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from 'src/app/service/api.service';
import { DashboardSearchViewModel } from './view-models/dashboard-search.model';


@Injectable({
  providedIn: 'root'
})
export class DashBoardService {
  
  controller : string = "owner/dashboard";
  constructor(private _apiService:ApiService) { }
  
  
  getParams(searchViewModel:DashboardSearchViewModel):HttpParams{
    let params = new HttpParams();
    if (searchViewModel.AreaID) {
      params = params.set("areaID", searchViewModel.AreaID.toString());
    }
    if (searchViewModel.BranchID) {
      params = params.set("branchID", searchViewModel.BranchID.toString());
    }
    if (searchViewModel.FromDate) {
      params = params.set("fromDate", moment(searchViewModel.FromDate).format('YYYY-MM-DD'));
    }
    if (searchViewModel.ToDate) {
      params = params.set("toDate", moment(searchViewModel.ToDate).format('YYYY-MM-DD'));
    }
    return params
  }

  getExcellentOrders(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Order/GetExcellentOrders`,params)
  }

  getPenddingOrders(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Order/GetPenddingOrders`,params)
  }

  getNewCustomers(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Customer/GetNewCustomersCount`,params)
  }

  getOrderKpis(searchViewModel:DashboardSearchViewModel) {
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Order/GetOrdersKpis`,params)

  }
  getRecentOrders(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Order/GetRecentOrders`,params)
  }
  getReadyOrders(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Order/GetReadyOrders`,params)
  }

  getTopDM(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Trip/GetTOPDM`,params)
  }
  getTOPDMByPoint(searchViewModel:DashboardSearchViewModel) {
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/DeliverymanPoint/GetTOPDMByPoint`,params)
  }
  
  getTopCustomer(searchViewModel:DashboardSearchViewModel) {
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Order/GetTOPCustomer`,params)
  }
  getOrderStatusPieData(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Order/GetOrderStatusPieChartData`,params)
  }
  // getAverageDeliveryTime(searchViewModel:DashboardSearchViewModel) {
  //   let params = this.getParams(searchViewModel)
  //   return this._apiService.get(`/${this.controller}/GetAverageDeliveryTime`,params)
  // }
  
  getTripsLineChart(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Trip/GetTripsLineChart`,params)
  }
  getTripsLineChartByHour(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Trip/GetTripsLineChartByHour`,params)
  }
  getOrdersLineChart(searchViewModel:DashboardSearchViewModel) {
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Order/GetOrdersLineChart`,params)
  }
  getOrdersLineChartByHour(searchViewModel:DashboardSearchViewModel) {
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Order/GetOrdersLineChartByHour`,params)
  }
  getTopItems(searchViewModel:DashboardSearchViewModel) {
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Item/GetTopItems`,params)
  }
  getTripRatePieChartData(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Trip/GetTripRatePieChartData`,params)
  }
  getOrderAvgDeliveryTime(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Order/GetOrderAvgDeliveryTime`,params)
  }
  getOrderAvgDeliveryTimeByBranch(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Order/GetOrderAvgDeliveryTimeByBranch`,params)
  }
  getAvgDeliveryTime(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Order/GetAvgDeliveryTime`,params)
  }
  
  getOrderAvgDeliveryTimeForEqbal() {
    return this._apiService.get(`/${this.controller}/GetOrderAvgDeliveryTimeForEqbal`)
  }
  //
  getOrderAvgDeliveryTimeByHour(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Order/GetOrderAvgDeliveryTimeByHour`,params)
  }
  getOrderAvgDeliveryTimeByWeek(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/Order/GetOrderAvgDeliveryTimeByWeek`,params)
  }

  getDeliverymanShiftPieChart(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/DeliverymanShift/GetDeliverymanShiftPieChartData`,params)
  }
  getDeliverymanShiftLineChart(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/DeliverymanShift/GetDeliverymanShiftLineChartData`,params)
  }
  getDeliverymanShiftByHourLineChart(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/DeliverymanShift/GetDeliverymanShiftByHourLineChartData`,params)
  }
  getDeliverymanOnShiftByHour(searchViewModel:DashboardSearchViewModel){
    let params = this.getParams(searchViewModel)
    return this._apiService.get(`/DeliverymanShift/GetDeliverymanOnShiftByHour`,params)
  }

}

