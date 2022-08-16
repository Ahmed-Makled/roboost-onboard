import { CdkDrag, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';
import { ElementRef, Injectable, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { DispatchService } from 'src/app/components/dispatch/page/dispatch.service';
import { DispatchOrderViewModel } from 'src/app/components/dispatch/page/view-models/dispatch.model';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { OrderStatus } from 'src/app/enum/order-status.enum';
import { bound, SharedService } from 'src/app/service/shared.service';
import { TaskActionService } from './task/task.action';

@Injectable({
  providedIn: 'root',
})

export class DragDropUtilsService {

  featureEnum = FeatureEnum

  constructor(
    private _dispatchService: DispatchService, 
    private _taskActionService: TaskActionService, 
    private _sharedService: SharedService
  ) { }

  drop(event: any) {
    let item: DispatchOrderViewModel = event.item.data
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.onDrop(item, item.Status, event.container, ((success, orderStatus) => {
        if (success) {
          let order = this._dispatchService.tasks.find(i => i.ID == item.ID)
          this._dispatchService.tasks.splice(this._dispatchService.tasks.indexOf(order), 1)
          this._dispatchService.tasks.unshift(order)
          let element = document.getElementById(orderStatus.toString());
          element.scrollIntoView({ behavior: 'smooth', block: "center" });
        }
      }))
    }
  }
  onDrop(item: DispatchOrderViewModel, source, target, afterDropCallback) {
    if ((item.Status == OrderStatus.New && +target.id == OrderStatus.READY)) {
      if (!this._sharedService.hasFeature(this.featureEnum.Task_SetAsInProgress) || !this.canDrop(OrderStatus.READY)) return false;
      this._taskActionService.setOrderAsInProgress(this._dispatchService.tasks.find(i => i.ID == item.ID), (success) => {
        afterDropCallback(success, OrderStatus.READY)
      })
    }
    else if ((item.Status == OrderStatus.CREATED && +target.id == OrderStatus.READY)) {
      if (!this._sharedService.hasFeature(this.featureEnum.Task_SetAsReady) || !this.canDrop(OrderStatus.READY)) return false;
      this._taskActionService.setOrderAsReady(this._dispatchService.tasks.find(i => i.ID == item.ID), (success) => {
        afterDropCallback(success, OrderStatus.READY)
      })
    }
    else if ((item.Status == OrderStatus.SCHEDULED && +target.id == OrderStatus.New)) {
      if (!this._sharedService.hasFeature(this.featureEnum.Task_SetAsNew) || !this.canDrop(OrderStatus.New)) return false;
      this._taskActionService.setOrderAsNew(this._dispatchService.tasks.find(i => i.ID == item.ID), (success) => {
        afterDropCallback(success, OrderStatus.SCHEDULED)
      })
    }
    // else if ((item.Status == OrderStatus.New || item.Status == OrderStatus.CREATED || item.Status == OrderStatus.READY) &&
    //   +target.id == OrderStatus.SCHEDULED) {
    //   if (!this._sharedService.hasFeature(this.featureEnum.Task_ScheduleOrder) || !this.canDrop(OrderStatus.SCHEDULED)) return false;
    //   this._taskActionService.showScheduledOrderTemplate(this._dispatchService.tasks.find(i => i.ID == item.ID))
    // }
    else if (+target.id == OrderStatus.ADDED_TO_TRIP && this.canDrop(OrderStatus.ADDED_TO_TRIP) ) {
      let tripId = +((target.element as ElementRef).nativeElement as Element).getAttribute("tripId")
      let trip = this._dispatchService.trips.find(i => i.ID == tripId)
      if (!this._sharedService.hasFeature(this.featureEnum.Task_ChangeTrip) || (trip.BranchID != item.BranchID && !item.IsTransite)) return false;
      if (item.Status == OrderStatus.ADDED_TO_TRIP) {
        this._taskActionService.addToTrip(this._dispatchService.tasks.find(i => i.ID == item.ID), trip.ID, true, (success) => {
          afterDropCallback(success, OrderStatus.ADDED_TO_TRIP)
        })
      }
      else {
        if (!this._sharedService.hasFeature(this.featureEnum.Task_AddToTrip)) return false;
        this._taskActionService.addToTrip(this._dispatchService.tasks.find(i => i.ID == item.ID), trip.ID ,false, (success) => {
          afterDropCallback(success, OrderStatus.ADDED_TO_TRIP)
        })
      }
      // this.detectTripOrdersChanges()
    }
    // this.detectOrdersChanges()
  }

  onDragMoved(event) {

    if (document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y)) {
      let element: Element = this.getDropListElement(document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y))
      this._dispatchService.pageUtils.currentDropConrainerID = element.id
    }
    else this._dispatchService.pageUtils.currentDropConrainerID = null



  }
  canDrop(sourceID: OrderStatus) {
    return sourceID == +this._dispatchService.pageUtils.currentDropConrainerID
  }
  getDropListElement(element: Element): Element {
    if (!element) return document.getElementsByClassName("main-panel")[0]
    if (!element.classList.contains('cdk-drop-list') && !element.classList.contains('main-panel')) {
      return this.getDropListElement(element.parentElement)
    }
    else return element
  }
  canDropOrder(event): boolean {
    // switch (this._dispatchService.pageUtils.CurrentTasksTab) {
    //   case OrderStatus.READY:
    //     return this.canDropReadyOrder(event)
    //   case OrderStatus.New:
    //     return this.canDropNewOrder(event)
    //   case OrderStatus.SCHEDULED:
    //     return this.canDropSchedualedOrder(event)
    //   default: 
    //   return false;
    // }
    return true;
  }
  canDropOrderToTrip(event): boolean {
    let item: DispatchOrderViewModel = event.data
    return true;
  }
  canDropReadyOrder(event): boolean {
    let sourceID: OrderStatus = (event.data as DispatchOrderViewModel).Status
    return sourceID == OrderStatus.CREATED || sourceID == OrderStatus.SCHEDULED
  }
  canDropPreparedOrder(event): boolean {
    let sourceID: OrderStatus = (event.data as DispatchOrderViewModel).Status
    return sourceID == OrderStatus.New || sourceID == OrderStatus.SCHEDULED
  }
  canDropNewOrder(event): boolean {
    let sourceID: OrderStatus = (event.data as DispatchOrderViewModel).Status
    return sourceID == OrderStatus.SCHEDULED
  }
  canDropSchedualedOrder(event): boolean {
    let sourceID: OrderStatus = (event.data as DispatchOrderViewModel).Status
    return sourceID == OrderStatus.New || sourceID == OrderStatus.CREATED || sourceID == OrderStatus.READY
  }


}
