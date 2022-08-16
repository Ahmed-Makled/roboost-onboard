import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SharedService } from 'src/app/service/shared.service';
import { DeliverymanServiceEditViewModel } from '../../view-models/deliveryman-service-edit.model';
import { PersonalInformationViewModel } from './personal-info-view-model';
import { ListService } from 'src/app/service/list.service';
import { ServiceItemViewModel } from '../../../home/view-models/service.model';
import { DeliverymanService } from '../../../home/deliveryman.service';
import { Patterns } from 'src/app/pattern/patterns';
import { StatusUtilsService } from 'src/app/service/status.service';

@Component({
  selector: 'personal-info',
  templateUrl: './personal-info.component.html',
})
export class PersonalInfoComponent implements OnInit {

  constructor(
    private _sharedService: SharedService,
    private _activatedRoute: ActivatedRoute,
    private _deliverymanService: DeliverymanService,
    private _listService: ListService,
    private _statusUtilsService :StatusUtilsService
  ) { }

  modelInfo: PersonalInformationViewModel = new PersonalInformationViewModel()
  page: CRUDCreatePage = new CRUDCreatePage();
  @ViewChild('editServiceTemplate', { static: false }) editServiceTemplate: any;
  @ViewChild('editPersonalInfoTemplate', { static: false }) editPersonalInfoTemplate: any;
  @ViewChild('changePasswordTemplate', { static: false }) changePasswordTemplate: any;
  modalRef: BsModalRef;
  searchServiceList: ServiceItemViewModel[] = []
  serviceList: ServiceItemViewModel[] = []
  deliverymanServices: ServiceItemViewModel[] = []
  selectServices: ServiceItemViewModel[] = []
  serviceName: string
  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.modelInfo.ID = +params.get("id");
        this.getPersonalInfo()
      }
      forkJoin([
        this._listService.getServiceList(),
        this._deliverymanService.getDMPersonalInfo(this.modelInfo.ID)
      ]).subscribe((res: any) => {
        this.serviceList = res[0].Data;
        this.modelInfo = res[1].Data
        this.serviceList.forEach(service => {
          if (this.modelInfo.ServicesID?.includes(service.ID)) {
            service.Selected = true
          }
          else {
            service.Selected = false
          }
        })
      }
      );
    });
  }
  showEditService(): void {
    this.deliverymanServices = []
    this.selectServices = []
    this.serviceName = ""
    this.serviceList.forEach(element => {
      if (this.modelInfo.ServicesID?.includes(element.ID)) {
        this.deliverymanServices.push(element)
      }
      else {
        this.searchServiceList.push(element)
        this.selectServices.push(element)
      }
    });
    this.modalRef = this._sharedService.modalService.show(this.editServiceTemplate, { class: 'modal-sm modal-lg' });
  }
  selectService(service: ServiceItemViewModel, index) {
    this.deliverymanServices.push(service)
    this.selectServices.splice(index, 1)
    this.searchServiceList.splice(this.searchServiceList.indexOf(service), 1)
  }
  removeService(service: ServiceItemViewModel, index) {
    this.selectServices.push(service)
    this.searchServiceList.push(service)
    this.deliverymanServices.splice(index, 1)
  }
  searchForService() {
    this.selectServices = []
    this.searchServiceList.forEach(element => {
      if (element.Name.includes(this.serviceName))
        this.selectServices.push(element)
    });
  }
  updateServices() {
    this.modelInfo.ServicesID = []
    this.deliverymanServices.forEach(element => {
      this.modelInfo.ServicesID.push(element.ID)
    });
    this.page.isSaving = true;
    let res: DeliverymanServiceEditViewModel = new DeliverymanServiceEditViewModel();
    res.DeliverymanID = this.modelInfo.ID
    res.ServicesID = this.modelInfo.ServicesID
    this._deliverymanService.updateDeliverymanServices(res).subscribe(response => {
      this.page.isSaving = false;
      this.page.responseViewModel = response;
      this._sharedService.showToastr(response);
      if (response.Success) {
        this.serviceList.forEach(element => {
          if (this.modelInfo.ServicesID?.includes(element.ID))
            element.Selected = true
          else {
            element.Selected = false
          }
        });
      }
    }, (error: any) => {
      this._sharedService.showErrorAlert(error);
      this.page.isSaving = false;
    }, () => { this.page.isSaving = false; });
  }
  showEditPersonalInfo(): void {
    this.createMainInfoForm();
    this.modalRef = this._sharedService.modalService.show(this.editPersonalInfoTemplate, { class: 'modal-300' });
  }

  createMainInfoForm() {
    this.page.form = this._sharedService.formBuilder.group({
      Name: [this.modelInfo.Name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      Mobile: [this.modelInfo.Mobile, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      UserName: [this.modelInfo.UserName, [Validators.required, Validators.minLength(7), Validators.maxLength(100)]],
      NationalID: [this.modelInfo.NationalID, [Validators.required, Validators.minLength(7), Validators.maxLength(100)]],
      EnrollID: [this.modelInfo.EnrollID, [Validators.pattern(Patterns.OnlyNumbers)]],
    })
    this.page.isPageLoaded = true;
  }

  isControlNotValidAndTouched(controlName: string) {
    let control = this.page.form.controls[controlName];
    return control.invalid && control.touched;
  }

  isControlValidAndDirty(controlName: string) {
    let control = this.page.form.controls[controlName];
    return control.valid && control.dirty;
  }

  isControlNotValidAndDirty(controlName: string) {
    let control = this.page.form.controls[controlName];
    return !control.valid && control.dirty;
  }

  isControlHasError(controlName: string, error: string) {
    return this.page.form.controls[controlName].hasError(error);
  }
  disabledSubmit() {
    return this.page.isSaving || this.page.isUploading || !this.page.form.valid;
  }

  getPersonalInfo() {
    this._deliverymanService.getDMPersonalInfo(this.modelInfo.ID).subscribe(res => {
      if (res.Success) {
        this.modelInfo = res.Data
        this.modelInfo.Color = this._statusUtilsService.getAgentStausColor(this.modelInfo.StatusID)
      }
    })
  }
  save() {
    this.page.isSaving = true;
    Object.assign(this.modelInfo, this.page.form.value);
    this._deliverymanService.updatePersonalInfo(this.modelInfo).subscribe(response => {
      this.page.isSaving = false;
      this.page.responseViewModel = response;
      this._sharedService.showToastr(response);
      if (response.Success) {
        if (this.modelInfo.ID == 0) {
          this.createMainInfoForm();
        }
      }
    }, error => {
      this._sharedService.showErrorAlert(error);
      this.page.isSaving = false;
    }, () => { this.page.isSaving = false; });
  }

  createChangePasswordForm() {
    this.page.form = this._sharedService.formBuilder.group({
      Password: ["", [Validators.required, Validators.minLength(7), Validators.maxLength(100)]],
    })
    this.page.isPageLoaded = true;
  }

  changePassword() {
    this._deliverymanService.changePassword({ DeliverymanID: this.modelInfo.ID, Password: this.page.form.value["Password"] }).subscribe(res => {
      this._sharedService.showToastr(res)
    })
  }
  showChangePasswordTemplate(): void {
    this.createChangePasswordForm();
    this.modalRef = this._sharedService.modalService.show(this.changePasswordTemplate, { class: 'modal-300' });
  }
}

