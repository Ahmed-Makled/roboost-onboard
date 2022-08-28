import { Injectable } from '@angular/core';
import { OrderStatus } from 'src/app/enum/order-status.enum';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { DummyDataService } from 'src/app/service/dummy-data.service';
import { SharedService } from 'src/app/service/shared.service';
import { AgentChangeStoreViewModel } from '../../../../deliveryman/home/view-models/deliveryman-create.model';
import { DeliverymanViewModel } from '../../../../deliveryman/home/view-models/deliveryman.model';
import { OnboardingDispatchService } from '../../onboarding.service';
import { ScheduledOrderViewModel, UpdateOrderInfoViewModel } from '../../view-models/dispatch-create.model';
import { DispatchOrderViewModel } from '../../view-models/dispatch.model';
import { TaskLogViewModel } from '../../view-models/log.model';
import { TaskDataService } from './task.data';
import { TaskUtilsService } from './task.utils';

@Injectable({
  providedIn: 'root',
})

export class TaskActionService {

  constructor(
    private _dispatchService: OnboardingDispatchService, 
    public _taskService: TaskDataService,
    private _sharedService: SharedService,
    public _taskUtils:TaskUtilsService,
    private DummyDataService :DummyDataService

  ) { }


 
  getRunningOrders(callback:Function) {
    // this._taskService.getRunningOrders(this._dispatchService.searchViewModel).subscribe((res) => {
    //   if (res.Success) {
    //     this._dispatchService.tasks = res.Data
    //     this._dispatchService.districtList = [...new Set(this._dispatchService.tasks
    //       .map(i => i.District))].map(i => {return { Name: i, Selected: false }})
    //     callback()
    //     if (!this._dispatchService.pageUtils.IsKpisSearching) {
    //     }
    //   }
    //   this._dispatchService.pageUtils.IsOrderSearching = false
    // })


    this._dispatchService.tasks = this.DummyDataService.DummyOrders
    this._dispatchService.districtList = [...new Set(this._dispatchService.tasks
      .map(i => i.District))].map(i => {return { Name: i, Selected: false }})
    callback()
    

    this._dispatchService.pageUtils.IsOrderSearching = false

  }

  cancelOrder(item: DispatchOrderViewModel, callback?) {
    this._dispatchService.page.isSaving = true;
    this._taskService.cancelOrder(item.ID).subscribe(res => {
      this._sharedService.showToastr(res)
      this._dispatchService.page.isSaving = false;
      if (res.Success) {
        this._dispatchService.tasks.splice(this._dispatchService.tasks.findIndex(i=>i.ID == item.ID),1)
      }
      if (callback) callback(res.Success)
    }, () => { this._dispatchService.page.isSaving = false; })
  }
  pauseOrder(item: DispatchOrderViewModel, callback?) {
    this._dispatchService.page.isSaving = true;
    this._taskService.pauseOrder(item.ID).subscribe(res => {
      this._sharedService.showToastr(res)
      this._dispatchService.page.isSaving = false;
      if (res.Success) {
        item.IsPaused = true
      }
      if (callback) callback(res.Success)
    }, () => { this._dispatchService.page.isSaving = false; })
  }
  unPauseOrder(item: DispatchOrderViewModel, callback?) {
    this._dispatchService.page.isSaving = true;
    this._taskService.unPauseOrder(item.ID).subscribe(res => {
      this._sharedService.showToastr(res)
      this._dispatchService.page.isSaving = false;
      if (res.Success) {
        if (res.Data > 0) {
          this._taskUtils.addToTrip(item,res.Data)
        }
        item.IsPaused = false
      }
      if (callback) callback(res.Success)
    }, () => { this._dispatchService.page.isSaving = false; })
  }
  changeOrderPriority(item: DispatchOrderViewModel, callback?) {
    this._dispatchService.page.isSaving = true;
    this._taskService.changeOrderPriority(item.ID, !item.IsTopPriority).subscribe(res => {
      this._sharedService.showToastr(res)
      this._dispatchService.page.isSaving = false;
      if (res.Success) {
        item.IsTopPriority = !item.IsTopPriority
      }
      if (callback) callback(res.Success)
    }, () => { this._dispatchService.page.isSaving = false; })
  }
  setOrderAsDelivered(item: DispatchOrderViewModel, callback?) {
    this._dispatchService.page.isSaving = true;
    this._taskService.setOrderAsDelivered(item.ID).subscribe(res => {
      this._sharedService.showToastr(res)
      this._dispatchService.page.isSaving = false;
      if (res.Success) {
        item.IsPaused = false
        item.Status = OrderStatus.DELIVERED
      }
      if (callback) callback(res.Success)
    }, () => { this._dispatchService.page.isSaving = false; })
  }
  setOrderAsReady(item: DispatchOrderViewModel, callback?) {
    this._dispatchService.page.isSaving = true;
    this._taskService.setOrderAsReady(item.ID).subscribe(res => {
      this._sharedService.showToastr(res)
      this._dispatchService.page.isSaving = false;
      if (res.Success) {
        if (res.Data == 0) this._taskUtils.setAsReady(item)
        else this._taskUtils.addToTrip(item,res.Data)
        this._dispatchService.setAnimationTimeout(item)
      }
      if (callback) callback(res.Success)
    }, () => { this._dispatchService.page.isSaving = false; })
  }
  setOrderAsInProgress(item: DispatchOrderViewModel, callback?) {
    this._dispatchService.page.isSaving = true;
    this._taskService.setOrderAsInProgress(item.ID).subscribe(res => {
      this._sharedService.showToastr(res)
      this._dispatchService.page.isSaving = false;
      if (res.Success) {
        this._dispatchService.setAnimationTimeout(item)
        item.Status = OrderStatus.CREATED
      }
      if (callback) callback(res.Success)
    }, () => { this._dispatchService.page.isSaving = false; })
  }
  setOrderAsNew(item: DispatchOrderViewModel, callback?) {
    this._dispatchService.page.isSaving = true;
    this._taskService.setOrderAsNew(item.ID).subscribe(res => {
      this._sharedService.showToastr(res)
      this._dispatchService.page.isSaving = false;
      if (res.Success) {
        this._dispatchService.setAnimationTimeout(item)
        item.Status = OrderStatus.New
      }
      if (callback) callback(res.Success)
    }, () => { this._dispatchService.page.isSaving = false; })
  }
  scheduledOrder(model:ScheduledOrderViewModel) {
    this._dispatchService.page.isSaving = true;
    let item = this._dispatchService.tasks.find(i => i.ID == model.OrderID)
    this._sharedService.dateService.setDateTimeToDate(model.ScheduledTime, model.ScheduledDateTime)
    this._taskService.scheduledOrder(model).subscribe(res => {
      this._sharedService.showToastr(res)
      this._dispatchService.page.isSaving = false;
      if (res.Success) {
        this._dispatchService.setAnimationTimeout(item)
        item.Status = OrderStatus.SCHEDULED
      }
    }, () => { this._dispatchService.page.isSaving = false })
  }
  removeOrderFromTrip(item: DispatchOrderViewModel, callback?) {
    this._dispatchService.page.isSaving = true;
    this._taskService.removeFromTrip(item.ID).subscribe(res => {
      this._sharedService.showToastr(res)
      this._dispatchService.page.isSaving = false;
      if (res.Success) {
        this._dispatchService.setAnimationTimeout(item)
        this._taskUtils.removeFromTrip(item)
      }
      if (callback) callback(res.Success)
    }, () => { this._dispatchService.page.isSaving = false; })
  }
  getTaskLog(item: DispatchOrderViewModel, taskLog: TaskLogViewModel) {
    item.ShowTaskLog = true
    taskLog.IsLoading = true
    // this._taskService.getTaskLog(item.Code).subscribe((res) => {
    //   taskLog.Logs = res.Data
    //   taskLog.IsLoading = false
    //   this._sharedService.sortBy(taskLog.Logs, { prop: "CreatedDate", desc: true })
    // })
  }

  showChangeStoreTemplate(model: AgentChangeStoreViewModel, item: DeliverymanViewModel, template: any) {
    model.ID = item.ID;
    model.StoreID = item.BranchID;
    this._dispatchService.modalRef = this._sharedService.modalService.show(template, { class: 'modal-500' });
    this._dispatchService.onModalRefChange()
  }
  addToTrip(item: DispatchOrderViewModel, tripID: number,isChangeTrip:boolean, callback?) {
    this._dispatchService.page.isSaving = true;
    this._taskService.addToTrip(item.ID, tripID,isChangeTrip).subscribe(res => {
      this._sharedService.showToastr(res)
      this._dispatchService.page.isSaving = false;
      if (callback) callback(res.Success)
      if (res.Success) {
        this._dispatchService.setAnimationTimeout(item)
        this._taskUtils.addToTrip(item,tripID)
      }
    }, () => { this._dispatchService.page.isSaving = false; })
  }
  updateInfo(model: UpdateOrderInfoViewModel,item:DispatchOrderViewModel,serviceList:SelectItem[]) {
    let services = serviceList.filter(i => i.Selected == true)
    model.ServicesID = services.map(x => x.ID)
    model.OrderID = item.ID
    this._taskService.updateOrderInfo(model).subscribe(res => {
      this._sharedService.showToastr(res)
      if (res.Success) {
        item.Address = model.Address
        item.Note = model.Note
        item.Services = services.map(i=> 
          { return { ServiceID: i.ID, Name: i.Name, Image: i.Icon, OrderID: item.ID} }
        )
      }
    })
  }
  cancelOTP(item:DispatchOrderViewModel) {
    this._taskService.cancelOTP(item.ID).subscribe(res => {
      this._sharedService.showToastr(res);
      if (res.Success) {
        item.DeliveryVerificationCode = null;
      }
    })
  }
}
