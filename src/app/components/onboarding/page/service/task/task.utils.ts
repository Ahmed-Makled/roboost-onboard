import { Injectable } from '@angular/core';
import { DeliveryTimeStatus } from 'src/app/enum/delivery-time-status';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { OrderStatus } from 'src/app/enum/order-status.enum';
import { SharedService } from 'src/app/service/shared.service';
import { OnboardingDispatchService } from '../../onboarding.service';
import { DispatchOrderViewModel } from '../../view-models/dispatch.model';
import { GroupingTypeEnum } from '../../view-models/filter.model';


@Injectable({
  providedIn: 'root',
})

export class TaskUtilsService {

  constructor(
    private _dispatchService: OnboardingDispatchService, 
    private _sharedService: SharedService, 
  ) { }
  //////////////////////
  addToTrip(item:DispatchOrderViewModel,tripID:number){
    item.TripID = tripID
    item.Status = OrderStatus.ADDED_TO_TRIP
    item.IsPaused = false
  }
  removeAllFromTrip(items:DispatchOrderViewModel[],tripID:number){
    items.filter(i => i.TripID == tripID).forEach(element => {
      if (element.Status == OrderStatus.DELIVERED || element.Status == OrderStatus.DELIVERED_MANUALLY)
        items.splice(items.findIndex(i => i.TripID == tripID), 1)
      else this.removeFromTrip(element)
    })
  }
  
  removeFromTrip(item:DispatchOrderViewModel){
    this.setAsReady(item)
    item.IsPaused = true;
  }
  setAsReady(item:DispatchOrderViewModel){
    item.TripID = null;
    item.Status = OrderStatus.READY;
  }
  resetTaskList(){
    this._dispatchService.tasks.filter(i => i.isSelected == true).forEach(x => x.isSelected = false)
  }
  ///////////////////////

  getTasks(status: OrderStatus): DispatchOrderViewModel[] {
    let filterList = this._dispatchService.pageUtils.TasksFilterList.filter(i => i.Selected).map(x => x.ID)
    return this.getTasksWithNoFilterStatus(status).filter(i => filterList.length > 0 && 
      !([OrderStatus.New,OrderStatus.SCHEDULED,OrderStatus.TRANSFERRED].some(x=>x == status)) ? filterList.some(x => x == i.Status) : true)
  }
  getTasksWithNoFilterStatus(status: OrderStatus){
    switch (status) {
      case OrderStatus.READY:
        return this.getReadyAndInProgressOrders()
      case OrderStatus.New:
        return this.getNewOrders()
      case OrderStatus.SCHEDULED:
        return this.getSchedualedOrders()
      case OrderStatus.TRANSFERRED:
        return this.getTransferredOrders()
      default:
        return this._dispatchService.tasks.filter(i => (i.TripID == 0 || i.TripID == null))
    }
  }
  getTasksByStatus(status: OrderStatus): DispatchOrderViewModel[] {
    return this._dispatchService.tasks.filter(x => x.Status == status && (this._sharedService.hasFeature(FeatureEnum.Task_TransferStatus) ? !x.IsTransite : true));
  }
  getReadyAndInProgressOrders(): DispatchOrderViewModel[] {
    return this._dispatchService.tasks.filter(x => (x.Status == OrderStatus.CREATED || x.Status == OrderStatus.READY) && (this._sharedService.hasFeature(FeatureEnum.Task_TransferStatus) ? !x.IsTransite : true));
  }
  getReadyOrders(): DispatchOrderViewModel[] {
    return this._dispatchService.tasks.filter(x => x.Status == OrderStatus.READY && (this._sharedService.hasFeature(FeatureEnum.Task_TransferStatus) ? !x.IsTransite : true));
  }
  getInProgressOrders(): DispatchOrderViewModel[] {
    return this._dispatchService.tasks.filter(x => x.Status == OrderStatus.CREATED && (this._sharedService.hasFeature(FeatureEnum.Task_TransferStatus) ? !x.IsTransite : true));
  }
  getNewOrders(): DispatchOrderViewModel[] {
    return this._dispatchService.tasks.filter(x => x.Status == OrderStatus.New && (this._sharedService.hasFeature(FeatureEnum.Task_TransferStatus) ? !x.IsTransite : true));
  }
  getSchedualedOrders(): DispatchOrderViewModel[] {
    return this._dispatchService.tasks.filter(x => x.Status == OrderStatus.SCHEDULED && (this._sharedService.hasFeature(FeatureEnum.Task_TransferStatus) ? !x.IsTransite : true));
  }
  getTransferredOrders(): DispatchOrderViewModel[] {
    return this._dispatchService.tasks.filter(x => x.Status != OrderStatus.ADDED_TO_TRIP && x.Status != OrderStatus.DELIVERED && x.IsTransite);
  }
  getPausedTasksCount(): number {
    return this._dispatchService.tasks.filter(i => i.IsPaused).length
  }
  getUrgentTasksCount(items: DispatchOrderViewModel[], groupValue?: number): number {
    return items.filter(i => i.DeliveryTimeStatus == DeliveryTimeStatus.TOP_URGENT &&
      (groupValue == null ? true : (this._dispatchService.filter.FiltterType == GroupingTypeEnum.STORE ? i.BranchID == groupValue :
        this._dispatchService.filter.FiltterType == GroupingTypeEnum.AREA ? i.AreaID == groupValue : true))).length
  }
  getTripOrderList(id: number, withUrgent: boolean): DispatchOrderViewModel[] {
    return this._dispatchService.tasks.filter(i => i.TripID == id && (withUrgent ? i.DeliveryTimeStatus == DeliveryTimeStatus.TOP_URGENT : true))
  }
  getOnTripOrderList(): DispatchOrderViewModel[] {
    return this._dispatchService.tasks.filter(i => i.TripID > 0)
  }
  getOrderLatitude(order: DispatchOrderViewModel) {
    return order.PlannedLatitude > 0 ? order.PlannedLatitude :
      order.Latitude == 0 ? false : order.Latitude
  }
  getOrderLongtude(order: DispatchOrderViewModel) {
    return order.PlannedLongitude > 0 ? order.PlannedLongitude :
      order.Longitude == 0 ? false : order.Longitude
  }
  getOrderMarker(order: DispatchOrderViewModel) {
    if (this.isOrderDelivered(order))
      return '/assets/rb-icon/map_marker_assigned_delivered.svg'
    if (this.isCantDelivered(order))
      return '/assets/rb-icon/map_marker_cannot_deliver.svg'
    if (order.TripID != 0)
      return '/assets/rb-icon/map_marker_assigned_selected.svg'
  }
  getUrgentTaskStoreCount(id) {
    if (this._dispatchService.filter.FiltterType == GroupingTypeEnum.AREA)
      return this._dispatchService.tasks.filter(order => order.AreaID == id && order.DeliveryTimeStatus == DeliveryTimeStatus.TOP_URGENT).length
    else return this._dispatchService.tasks.filter(order => order.BranchID == id && order.DeliveryTimeStatus == DeliveryTimeStatus.TOP_URGENT).length
  }
  getTaskBranch(item: DispatchOrderViewModel) {
    return this._dispatchService.storeList.find(i => i.ID == item.BranchID)
  }
  getOrderUrlONMaps(item: DispatchOrderViewModel) {
    // return `https://www.google.com/maps?saddr=${this.getTaskBranch(item).Latitude},${this.getTaskBranch(item).Longitude}&daddr=${this.getOrderLatitude(item)},${this.getOrderLongtude(item)}`;
  return ''
  }
  getCreateTripOrderList(branchID:number,withSelected: boolean = false): DispatchOrderViewModel[] {
    return this._dispatchService.tasks.filter(x => (branchID != 0 ? (x.BranchID == branchID) : true) &&
      (x.Status == OrderStatus.READY || x.Status == OrderStatus.CREATED) && (withSelected ? x.isSelected : true))
  }

  ///////////////////////

  
  isTripHasCantDeliverTask(id: number): boolean {
    return this._dispatchService.tasks.some(i => i.TripID == id && i.Status == OrderStatus.CAN_NOT_DELIVER)
  }
  isCantDelivered(item: DispatchOrderViewModel) {
    return item.Status == OrderStatus.CAN_NOT_DELIVER
  }
  isOrderDelivered(item: DispatchOrderViewModel) {
    return item.Status == OrderStatus.DELIVERED || item.Status == OrderStatus.DELIVERED_MANUALLY
  }
  isOrderCanceled(item: DispatchOrderViewModel) {
    return item.Status == OrderStatus.CANCELED
  }
  isOnTrip(item: DispatchOrderViewModel): boolean {
    return item.TripID > 0
  }
  isReady(item: DispatchOrderViewModel): boolean {
    return item.Status == OrderStatus.READY
  }
  isCreated(item: DispatchOrderViewModel): boolean {
    return item.Status == OrderStatus.CREATED
  }
  isNew(item: DispatchOrderViewModel): boolean {
    return item.Status == OrderStatus.New
  }
  isSchedualed(item: DispatchOrderViewModel): boolean {
    return item.Status == OrderStatus.SCHEDULED
  }
}
