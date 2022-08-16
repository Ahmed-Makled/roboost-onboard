import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DeliverymanViewModel } from 'src/app/components/track-location/view-models/deliveryman-model';
import { BranchTrackingViewModel } from 'src/app/components/track-location/view-models/tracking.model';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { ListService } from 'src/app/service/list.service';
import { SharedService } from 'src/app/service/shared.service';
import { NotificationService } from '../notification.service';
import { AgentNotificationViewModel,  } from '../view-models/agent.model';
import { FilterViewModel, NotificationCreateModel, } from '../view-models/notification.model';
import { StoreNotificationViewModel } from '../view-models/store.model';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: NotificationCreateModel = new NotificationCreateModel()
  @Input() showPushNotificationFlag: boolean
  modalRef: BsModalRef;
  @ViewChild('pushNotificationTemplate', { static: true }) pushNotificationTemplate: any;
  filter: FilterViewModel = new FilterViewModel()
  storeList: StoreNotificationViewModel[] = []
  agentList: AgentNotificationViewModel[] = []
  toggelSearch: Boolean = false
  searchAgentNameValue: string = ''
  selectAll: boolean = false
  constructor(
    private _notificationService: NotificationService,
    private _sharedService: SharedService,
    private _listService: ListService
  ) { }
  ngOnInit(): void {
    this.getStoreList()
    this.getAgentListWithStatus()
    this.createForm()
    if (this.showPushNotificationFlag) {
      this.viewPushNotificationModal()
    }
  }
  getStoreList() {
    this._listService.getBranchListWithLocation().subscribe((res) => {
      this.storeList = res.Data
    })
  }
  getAgentListWithStatus(){
    this._listService.getAgentListWithStatus().subscribe((res) => {
      this.agentList = res.Data
    })
  }
  getAgentsByStore(id: number): DeliverymanViewModel[] {
    return this.agentList.filter(i => i.BranchID == id)
  }
  filterSelectedListAgent(id:number):DeliverymanViewModel[]{
    return this.getSelectedAgents().filter(i => i.BranchID == id)

  }
  getAgentList(id) {
    if (this.searchAgentNameValue)
      return this.getAgentsByStore(id).filter(i => i.Name.toLowerCase().includes(this.searchAgentNameValue.toLowerCase()))
    else if (this.filter.SearchValue && +this.filter.SearchValue != 0)
      return this.getAgentsByStore(id).filter(i => i.StatusID == +this.filter.SearchValue)
    else return this.getAgentsByStore(id)
  }
  getSearchByValue(): string {
    return this.filter.SearchByList.find(i => i.ID == this.filter.SearchValue).Name
  }
  onAgentChange(item: BranchTrackingViewModel) {
    item.Selected = this.getAgentsByStore(item.ID).every(i => i.Selected)
  }
  getSelectedAgents() {
    return this.agentList.filter(i => i.Selected).map(i => i)
  }
  onStoreClick(item: BranchTrackingViewModel) {
    this.getAgentsByStore(item.ID).forEach(element => {
      element.Selected = item.Selected
    });
  }
  selectAllAgent() {
    this.selectAll = !this.selectAll
    this.storeList.forEach(element => {
      element.Selected = this.selectAll
      this.getAgentsByStore(element.ID).forEach(element => {
        element.Selected = this.selectAll
      });
    });
  }
  save() {
    Object.assign(this.item, this.page.form.value)
    this.item.DelivermanIDs = this.getSelectedAgents().map(i=>i.ID)
    console.log(this.item);
    
    this._notificationService.pushNotification(this.item).subscribe((res) => {
      this._sharedService.showToastr(res)
      this.modalRef.hide()
    })
  }
  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      Title: [this.item.Title, [Validators.required]],
      Body: [this.item.Body, [Validators.required]],
    })
    this.page.isPageLoaded = true
  }
  viewPushNotificationModal() {
    this.modalRef = this._sharedService.modalService.show(this.pushNotificationTemplate, { class: 'modal-dialog modal-712' });
  }

  nextFlag:boolean=false
  next(){
    this.nextFlag = !this.nextFlag
  }

  isControlNotValidAndTouched(form: FormGroup, controlName: string) {
    let control = form.controls[controlName];
    return !control.valid && control.touched;
  }
  isControlValidAndDirty(form: FormGroup, controlName: string) {
    let control = form.controls[controlName];
    return control.valid && control.dirty;
  }
  isControlNotValidAndDirty(form: FormGroup, controlName: string) {
    let control = form.controls[controlName];
    return !control.valid && control.dirty;
  }
  isControlHasError(form: FormGroup, controlName: string, error: string) {
    return form.controls[controlName].hasError(error);
  }
  disabledSubmit() {
    return this.page.isSaving || this.page.form.invalid || this.getSelectedAgents().length <= 0;
  }
}
