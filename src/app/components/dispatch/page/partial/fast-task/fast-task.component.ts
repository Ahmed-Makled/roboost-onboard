import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { TaskActionService } from 'src/app/components/dispatch/page/service/task/task.action';
import { ListService } from 'src/app/service/list.service';
import { SharedService } from 'src/app/service/shared.service';
import { DispatchService } from '../../dispatch.service';
import { DispatchOrderViewModel, DispatchSelectItemViewModel } from '../../view-models/dispatch.model';
import { OrderCreateViewModel, ServiceItemViewModel, ShippingAddressViewModel } from '../../view-models/order-create.model';

@Component({
  selector: 'fast-task',
  templateUrl: './fast-task.component.html',
  styleUrls: ['./fast-task.component.css']
})

export class FastTaskComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage();
  orderModel: OrderCreateViewModel = new OrderCreateViewModel();
  shippingAddresses: ShippingAddressViewModel[] = []
  orderReasonList: SelectItem[] = []
  orderForm: FormGroup;
  customerSearchForm: FormGroup;
  modalRef: BsModalRef;
  @Input() tasks: DispatchOrderViewModel[]
  @Input() storeList: DispatchSelectItemViewModel[] = []
  @Input() serviceList: ServiceItemViewModel[] = []
  @Output() onCreateTask = new EventEmitter();

  @ViewChild('createOrderTemplate', { static: false }) createOrderTemplate: any;

  constructor(
    private _sharedService: SharedService,
    private _listService: ListService,
    private _dispatchService: DispatchService,
    private _taskAction: TaskActionService
  ) { }
  ngOnInit(): void {

  }

  showCreateOrderTemplate() {
    this.orderModel = new OrderCreateViewModel()
    this.createOrderForm()
    this.modalRef = this._sharedService.modalService.show(this.createOrderTemplate, { class: 'modal-440 fast-order-modal' });
    this.getOrderReasonList()
  }
  createOrderForm() {
    this.customerSearchForm = this._sharedService.formBuilder.group({
      CustomerMobile: [this.orderModel.CustomerMobile, [Validators.required]]
    });
    this.orderForm = this._sharedService.formBuilder.group({
      OrderNumber: [this.orderModel.OrderNumber, [Validators.required]],
      FastOrderReasonID: [this.orderModel.FastOrderReasonID, [Validators.required]],
      IsTopPriority: [this.orderModel.IsTopPriority],
      IsPaused: [this.orderModel.IsPaused],
      MaxPreperationTime: [this.orderModel.MaxPreperationTime, [Validators.required]],
      BranchID: [this.orderModel.BranchID, this.isSingleStore() ? [] : [Validators.required]],
      CustomerSerialNumber: [this.orderModel.CustomerSerialNumber, [Validators.required]],
      CustomerName: [this.orderModel.CustomerName, [Validators.required]],
      Address: [this.orderModel.Address, [Validators.required]],
      NewAddress: [this.orderModel.NewAddress, [Validators.required]],
    });
    setTimeout(() => {
      this.updateCustomerOrderValidity(true)
    }, 100);
  }
  getCustomerByMobile() {
    this.orderModel.CustomerMobile = this.customerSearchForm.get("CustomerMobile").value
    this.shippingAddresses = []
    this._taskAction._taskService.getCustomerByMobile(this.orderModel.CustomerMobile).subscribe((res) => {
      this.shippingAddresses.push({ ID: 0, Address: "Add Address" })
      if (res.Success && res.Data != null) {
        this.orderModel.CustomerName = res.Data.Name;
        this.orderModel.CustomerMobile = res.Data.Mobile;
        this.orderModel.CustomerSerialNumber = res.Data.SerialNumber;
        this.orderModel.Address = res.Data.ShippingAddresses[0].Address;
        this.shippingAddresses = [...res.Data.ShippingAddresses, ...this.shippingAddresses]
      }
      else {
        this.orderModel.CustomerName = null;
        this.orderModel.Address = this.shippingAddresses[0].Address;
        // this._sharedService.showErrorAlert("No Customer Found")
      }
      this.createOrderForm()
      document.getElementsByClassName("fast-order-modal")[0].classList.replace("modal-440", "modal-640")
      this.orderModel.IsCustomerSearched = true;
      setTimeout(() => {
        this.updateCustomerOrderValidity(res.Success && res.Data != null)
      }, 100);
      if (this.shippingAddresses.length == 1) {
        this.orderForm.removeControl('Address')
        this.orderModel.isNewCustomer = true;
      }
      else {
        this.orderForm.addControl('Address', new FormControl(this.orderModel.Address, Validators.required))
        this.orderModel.isNewCustomer = false;
      }
      this.addAddress(this.shippingAddresses.length == 1)
    })
  }
  createOrder() {
    if (this.orderForm.valid) {
      Object.assign(this.orderModel, this.orderForm.value);
      this.orderModel.Services = this.serviceList.filter(i => i.Selected)
      if (this.orderModel.NewAddress != "" && (this.orderModel.Address == "Add New Address" || this.orderModel.Address == "Add Address" || this.orderModel.isNewCustomer)) {
        this.orderModel.Address = this.orderModel.NewAddress;
      }
      this._taskAction._taskService.createOrder(this.orderModel).subscribe(response => {
        this._sharedService.showToastr(response);
        if (response.Success) {
          let order: DispatchOrderViewModel = new DispatchOrderViewModel()
          this._dispatchService.setAnimationTimeout(order)
          order.ID = response.Data
          order.BranchID = this.orderModel.BranchID
          order.BranchName = this.storeList.find(x => x.ID == this.orderModel.BranchID)?.Name
          order.IsTopPriority = this.orderModel.IsTopPriority
          order.Mobile = this.orderModel.CustomerMobile
          order.OrderNumber = this.orderModel.OrderNumber
          order.Name = this.orderModel.CustomerName
          order.Address = this.orderModel.Address
          order.Services = this.orderModel.Services.map(i=> 
            { return { ServiceID: i.ID, Name: i.Name, Image: i.Icon, OrderID: order.ID} }
          )
          order.IsPaused = this.orderModel.IsPaused;
          this._dispatchService.setAnimationTimeout(order)
          this.tasks.unshift(order);
          this.onCreateTask.emit()
        }
      });
    }
  }
  updateCustomerOrderValidity(customerFound: boolean) {
    if (customerFound) {
      this.customerName.disable()
      this.customerSerialNumber.disable()
    }
    else {
      this.customerName.setValue("")
      this.customerName.enable()
      this.customerSerialNumber.setValue("")
      this.customerSerialNumber.enable()
    }
  }
  addAddress(isNew: boolean) {
    if (isNew) {
      this.orderModel.Address = ""
      this.orderForm.addControl('NewAddress', new FormControl(this.orderModel.NewAddress, Validators.required))
    }
    else {
      this.orderForm.removeControl('NewAddress')
    }
    this.orderModel.isNewAddress = isNew;
  }
  get customerSerialNumber() {
    return this.orderForm.get('CustomerSerialNumber')
  }
  get customerName() {
    return this.orderForm.get('CustomerName')
  }
  getOrderReasonList() {
    this._listService.getOrderReasonList().subscribe(res => {
      if (res.Success) {
        this.orderReasonList = res.Data
        this.orderForm.get('FastOrderReasonID').setValue(this.orderReasonList[0].ID)
      }
    })
  }
  onSelectReason(isOther: boolean) {
    if (isOther)
      this.orderForm.addControl('FastOrderReasonNote', new FormControl(this.orderModel.FastOrderReasonNote, Validators.required))
    else this.orderForm.removeControl('FastOrderReasonNote')
    this.orderModel.isOtherReason = isOther;
  }
  disabledSubmit(form: FormGroup) {
    return this.page.isSaving || !form.valid;
  }
  isSingleStore() {
    return this._sharedService._storageService.getISSingleStore()
  }
  featureEnum = FeatureEnum
  hasFeature(value: FeatureEnum) {
    return SharedService.featureList.some(i => i == value)
  }
}
