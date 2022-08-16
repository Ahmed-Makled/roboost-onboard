import { Component, OnInit, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliverymanMainInfoViewModel } from '../view-models/deliveryman.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AvailabilityRequestService } from '../../availability-request/availability-request.service';
import { SharedService } from 'src/app/service/shared.service';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { DeliveryStatus } from 'src/app/enum/delivery-status';
import { DeliverymanService } from '../../home/deliveryman.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html'
})
export class IndexComponent implements OnInit {
  @ViewChild('editServiceTemplate', { static: false }) editServiceTemplate: any;
  modalRef: BsModalRef;
  mainInfo: DeliverymanMainInfoViewModel = new DeliverymanMainInfoViewModel();
  servicesItem: SelectItem[] = []
  deliverymanID: number = 0
  numOfDays: number = 30
  sideActive: any[] = [{ isActive: true }, { isActive: false }, { isActive: false },
  { isActive: false }, { isActive: false }]
  currentDay: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _deliverymanService: DeliverymanService,
    public _sharedService: SharedService,
    private _location: Location
  ) { }
  back(){
    // this._location.back();
    history.back()
  }
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.deliverymanID = +params.get("id");
        var today = new Date();
        this.currentDay = + String(today.getDate()).padStart(2, '0') - 1;
        this.getMainInfo()
      }
    })
  }
  showChooseServicesTemplate() {
  }
  showEditServiceTemplate(): void {
    this.modalRef = this._sharedService.modalService.show(this.editServiceTemplate,
      { class: 'modal-sm modal-lg' });
  }
  activeSide(index) {
    this.sideActive.forEach(element => {
      element.isActive = false
    });
    this.sideActive[index].isActive = true;
  }
  jumpToDiv(location: string) {
    window.location.hash = location
  }
  scroll(el) {
    document.getElementById(el).scrollIntoView({ behavior: "smooth" })
  }
  getMainInfo() {
    this._deliverymanService.getDMMainInfo(this.deliverymanID).subscribe(res => {
      if (res.Success) {
        this.mainInfo = res.Data
      }
    })
  }
  startShift(deliverymanID: number) {
    this._deliverymanService.startShift(deliverymanID).subscribe(response => {
      this._sharedService.showToastr(response);
    });
  }
  endShift(deliverymanID: number) {
    this._deliverymanService.endShift(deliverymanID).subscribe(response => {
      this._sharedService.showToastr(response);
    });
  }
  isDMOfDuty(DmStatus: number) {
    return DmStatus == DeliveryStatus.OFF_DUTY
  }
  isDMAvailable(Status: number) {
    return Status == DeliveryStatus.AVAILABLE
  }
  isDMOnDuty(Status: number) {
    return Status == DeliveryStatus.ON_DUTY
  }
  onBreak(status: DeliveryStatus): boolean {
    return status == DeliveryStatus.Break
  }
  changeNumOfDays(numOfDays) {
    this.numOfDays = + numOfDays
  }
}
