import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DeliveryTimeStatus } from 'src/app/enum/delivery-time-status';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { OrderStatus } from 'src/app/enum/order-status.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { ResponseViewModel } from 'src/app/model/shared/response.model';
import { SharedService } from 'src/app/service/shared.service';
import { StatusUtilsService } from 'src/app/service/status.service';
import { DispatchActionEnum } from '../../view-models/dispatch-action.enum';
import { DispatchOrderViewModel } from '../../view-models/dispatch.model';

@Component({
  selector: 'order-card-board',
  templateUrl: './order-card.component.html',
  styleUrls: ['./index.component.css']
})


export class OrderCardBoardComponent implements OnInit {
  
  page:CRUDIndexPage;
  modalRef: BsModalRef;
  @Input() isActionTemplate: boolean = false;
  @Input() withSelect: boolean = false;
  @Input() allowFastAction: boolean = true;
  @Input() item: DispatchOrderViewModel;
  @Input() URLOnMaps:String;
  @Output() orderChange = new EventEmitter<DispatchOrderViewModel>();
  @Output() orderClick = new EventEmitter<{item: DispatchOrderViewModel,action?:DispatchActionEnum}>();

  constructor(
    private _sharedService: SharedService,
    private _statusUtilsService :StatusUtilsService
  ) { }

  ngOnInit(): void {
    this.initializePage()
  } 

  initializePage() {

  }

  getTaskStatus(){
    // console.log(this.item);
    return this._statusUtilsService.getTaskStatusList().find(i=>i.ID == this.item.Status)
  }

  isCantDelivered() {
    return this.item.Status == OrderStatus.CAN_NOT_DELIVER
  }
  isDelivered() {
    return this.item.Status == OrderStatus.DELIVERED || this.item.Status == OrderStatus.DELIVERED_MANUALLY
  }
  isOnTrip(): boolean {
    return this.item.TripID > 0
  }
  isReady(): boolean {
    return this.item.Status == OrderStatus.READY
  }
  isCreated(): boolean {
    return this.item.Status == OrderStatus.CREATED
  }
  isNew(): boolean {
    return this.item.Status == OrderStatus.New
  }
  isSchedualed(): boolean {
    return this.item.Status == OrderStatus.SCHEDULED
  }
  isUrgent(): boolean{
    return this.item.DeliveryTimeStatus == DeliveryTimeStatus.TOP_URGENT
  }
  isLate(): boolean{
    return this.item.SpentTime / 60 > this.item.OrderDeliveryTime
  }
  isOrderDelivered() {
    return this.item.Status == OrderStatus.DELIVERED || this.item.Status == OrderStatus.DELIVERED_MANUALLY
  }


  action=DispatchActionEnum
  showActionTamplate(event, sent:boolean,action?:DispatchActionEnum) {
    if(this.withSelect){
      this.item.isSelected = !this.item.isSelected
      return;
    }
    if(this.isActionTemplate) return;
    if (sent) this.orderClick.emit({item:this.item})
    else {
      event.stopPropagation();
      this.orderClick.emit({item:this.item,action:action})
    }
  }
  fireResponseEvent(res:ResponseViewModel,status: DispatchActionEnum,name:string){
    this._sharedService.fireEvent(false,{success:res.Success,status:status,name:name});
  }

  featureEnum = FeatureEnum
  hasFeature(value: FeatureEnum) {
    return SharedService.featureList.some(i => i == value)
  }

}
