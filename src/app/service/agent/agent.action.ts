import { EventEmitter, Injectable, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { DeliverymanService } from '../../components/deliveryman/home/deliveryman.service';
import { AgentChangeStoreViewModel } from '../../components/deliveryman/home/view-models/deliveryman-create.model';
import { DeliverymanViewModel } from '../../components/deliveryman/home/view-models/deliveryman.model';
import { AgentUtilsService } from './agent.utils';

@Injectable({
  providedIn: 'root',
})

export class AgentActionService {

  private page: CRUDIndexPage
  private modalRef: BsModalRef;

  @Output() modalRefEvent = new EventEmitter<BsModalRef>();

  constructor(private _deliverymanService: DeliverymanService, private _sharedService: SharedService, 
    private _agentUtils: AgentUtilsService) { }

  initService(page: CRUDIndexPage, modalRef: BsModalRef) {
    this.page = page
    this.modalRef = modalRef
  }
  onModalRefChange() {
    this.modalRefEvent.emit(this.modalRef);
  }
  startShift(deliverymanID: number) {
    this.page.isSaving = true;
    this._deliverymanService.startShift(deliverymanID).subscribe(response => {
      this._sharedService.showToastr(response);
      this.page.isSaving = false;
    }, (err) => { this.page.isSaving = false; });
  }
  endShift(deliverymanID: number, callback?) {
    this.page.isSaving = true;
    this._deliverymanService.endShift(deliverymanID).subscribe((response) => {
      this._sharedService.showToastr(response);
      this.page.isSaving = false;
      if (response.Success) {
        callback()
      }
    }, (err) => { this.page.isSaving = false; });
  }
  startBreak(item: DeliverymanViewModel) {
    this.page.isSaving = true;
    this._deliverymanService.startBreak(item.ID).subscribe((res) => {
      this._sharedService.showToastr(res);
      this.page.isSaving = false;
      if (res.Success) {
        this._agentUtils.startBreak(item)
      }
    }, (err) => { this.page.isSaving = false; });
  }
  endBreak(id: number, callback?) {
    this.page.isSaving = true;
    this._deliverymanService.endBreak(id).subscribe((res) => {
      this._sharedService.showToastr(res);
      this.page.isSaving = false;
      if (res.Success) {
        callback()
      }
    }, (err) => { this.page.isSaving = false; });
  }
  removePenalize(id, callback?) {
    this.page.isSaving = true;
    this._deliverymanService.removePenalize({ DeliverymanID: id }).subscribe((response) => {
      this._sharedService.showToastr(response);
      this.page.isSaving = false;
      if (response.Success) {
        callback()
      }
    }, (err) => { this.page.isSaving = false; });
  }
  addToQueue(id, callback?) {
    this.page.isSaving = true;
    this._deliverymanService.addToQueue(id).subscribe((response) => {
      this._sharedService.showToastr(response);
      this.page.isSaving = false;
      if (response.Success) {
        callback()
      }
    }, (err) => { this.page.isSaving = false; });
  }
  logOut(item: DeliverymanViewModel) {
    this._deliverymanService.logOut(item.ID).subscribe((response) => {
      this._sharedService.showToastr(response);
      if (response.Success) {
        item.IsLoggedIn = false;
        // item.StatusName = 'Off Duty';
        // item.StatusColor = this._sharedService.getAgentStausColor(DeliveryStatus.OFF_DUTY)
        // item.QueueNo = 0;
      }
    });
  }
  archive(item: DeliverymanViewModel, items: DeliverymanViewModel[]) {
    this._deliverymanService.archive(item.ID).subscribe((response) => {
      if (response.Success) {
        items.splice(items.indexOf(item), 1);
        let pageIndex: number = this.page.options.currentPage;
        if (items.length == 0) {
          pageIndex = pageIndex > 1 ? --pageIndex : 1;
        }
        this._sharedService.showSuccessAlert(response.Message + ' - ' + item.Name);
      }
    }, (error) => {
      this._sharedService.showErrorAlert('حدث خطأ اثناء عملية الحذف');
    });
  }
  unArchive(item: DeliverymanViewModel, items: DeliverymanViewModel[]) {
    this._deliverymanService.unArchive(item.ID).subscribe((response) => {
      if (response.Success) {
        items.splice(items.indexOf(item), 1);
        let pageIndex: number = this.page.options.currentPage;
        if (items.length == 0) {
          pageIndex = pageIndex > 1 ? --pageIndex : 1;
        }
        this._sharedService.showSuccessAlert(response.Message + ' - ' + item.Name);
      }
    }, (error) => {
      this._sharedService.showErrorAlert('حدث خطأ اثناء عملية الحذف');
    });
  }
  showChangeStoreTemplate(model: AgentChangeStoreViewModel, item: DeliverymanViewModel, template: any) {
    model.ID = item.ID;
    model.StoreID = item.BranchID;
    this.modalRef = this._sharedService.modalService.show(template, { class: 'modal-500' });
    this.onModalRefChange()
  }
  changeStore(model: AgentChangeStoreViewModel, items: DeliverymanViewModel[]) {
    this.page.isSaving = true
    this._deliverymanService.changeStore(model).subscribe((res) => {
      this.page.isSaving = false
      this._sharedService.showToastr(res)
      if (res.Success) {
        items.find(i => i.ID == model.ID).BranchID = model.StoreID
      }
    }, (err) => { this.page.isSaving = false })
  }
}
