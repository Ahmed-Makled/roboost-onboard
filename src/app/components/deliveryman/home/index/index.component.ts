import { Component, OnDestroy, OnInit, Predicate, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { ActivatedRoute, Router } from '@angular/router';
import { DeliverymanSearchViewModel } from '../view-models/deliveryman-search.model';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { DeliverymanViewModel } from '../view-models/deliveryman.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { DeliveryStatus } from 'src/app/enum/delivery-status';
import { DeliverymanService } from '../deliveryman.service';
import { forkJoin } from 'rxjs';
import { ListService } from 'src/app/service/list.service';
import { AgentChangeStoreViewModel } from '../view-models/deliveryman-create.model';
import { AgentActionService } from '../../../../service/agent/agent.action';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
import { StatusUtilsService } from 'src/app/service/status.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit, OnDestroy {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/agent/profiles';
  modalRef: BsModalRef;
  items: DeliverymanViewModel[] = [];
  selectedItem: DeliverymanViewModel = new DeliverymanViewModel();
  searchViewModel: DeliverymanSearchViewModel = new DeliverymanSearchViewModel();
  statusList: SelectItem[] = [];
  deviceTypeList: SelectItem[] = [];
  branchList: SelectItem[] = [];
  selectedDmID: number;
  selectedDmName: string;
  selectedBracnhID: number;
  timer: any;
  @ViewChild('addToQueueTemplate', { static: false }) addToQueueTemplate: any;
  @ViewChild('archiveTemplate', { static: false }) archiveTemplate: any;
  @ViewChild('unarchiveTemplate', { static: false }) unarchiveTemplate: any;
  @ViewChild('forceLogOutTemplate', { static: false }) forceLogOutTemplate: any;
  @ViewChild('startTrackingTemplate', { static: false }) startTrackingTemplate: any;
  @ViewChild('removePenalizeTemplate', { static: false }) removePenalizeTemplate: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _listService: ListService,
    private router: Router,
    private _deliverymanService: DeliverymanService,
    private _agentActionService: AgentActionService,
    private _statusUtils :StatusUtilsService
  ) {
    super(_sharedService);
  }
  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
  ngOnInit() {
    this._agentActionService.initService(this.page, this.modalRef)
    this._agentActionService.modalRefEvent.subscribe((modal) => this.modalRef = modal)
    this.initializePage();
  }
  initializePage() {
    forkJoin([
      this._listService.getDeliverymanStatusList(),
      this._listService.getDeviceTypeList(),
      this._listService.getBranchList(),
    ]).subscribe((res) => {
      this.statusList = res[0].Data;
      this.deviceTypeList = res[1].Data;
      this.branchList = res[2].Data;
    });
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe((params) => this.subscribeFilteration(params));
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.items.filter(i=>this.onBreak(i.StatusID)).forEach((item) => {
        item.BreakSpentTime = item.BreakSpentTime + 1;
      });
    }, 1000);
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      Mobile: [this.searchViewModel.Mobile],
      Name: [this.searchViewModel.Name],
      IsActive: [this.searchViewModel.IsActive],
      IsLoggedIn: [this.searchViewModel.IsloggedIn],
      IsArchive: [this.searchViewModel.IsArchive],
      Status: [this.searchViewModel.Status],
      DeviceType: [this.searchViewModel.DeviceType],
      AppVersionNumber: [this.searchViewModel.AppVersionNumber],
      branchID: [this.searchViewModel.branchID],
      EnrollID: [this.searchViewModel.EnrollID],
    });
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this._deliverymanService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe((response) => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as DeliverymanViewModel[];
        this.getColors();
        this.page.isPageLoaded = true;
      }
    });
  }
  onBreak(status: DeliveryStatus): boolean {
    return status == DeliveryStatus.Break;
  }
  isDMPenalize(deliveryman: DeliverymanViewModel): boolean {
    return deliveryman.StatusID == DeliveryStatus.PENALIZED;
  }
  isDMOfDuty(DmStatus: DeliveryStatus) {
    return DmStatus == DeliveryStatus.OFF_DUTY;
  }
  isDMAvailable(Status: DeliveryStatus) {
    return Status == DeliveryStatus.AVAILABLE;
  }
  isDMOnDuty(Status: DeliveryStatus) {
    return Status == DeliveryStatus.ON_DUTY;
  }
  startShift(deliverymanID: number) {
    this._agentActionService.startShift(deliverymanID)
  }
  endShift(deliverymanID: number) {
    this._agentActionService.endShift(deliverymanID, () => { this.search() })
  }
  startBreak(item: DeliverymanViewModel) {
    this._agentActionService.startBreak(item)
  }
  endBreak(id: number) {
    this._agentActionService.endBreak(id, () => {
      clearInterval(this.timer);
      this.search();
    })
  }
  removePenalize() {
    this._agentActionService.removePenalize(this.selectedItem.ID, () => { this.search() })
  }
  addToQueue() {
    this._agentActionService.addToQueue(this.selectedItem.ID, () => { this.search() })
  }
  logOut() {
    this._agentActionService.logOut(this.selectedItem)
  }
  archive() {
    this._agentActionService.archive(this.selectedItem, this.items)
  }
  unArchive() {
    this._agentActionService.unArchive(this.selectedItem, this.items)
  }
  showArchiveConfirmation(selectedItem: DeliverymanViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.archiveTemplate, { class: 'modal-sm' });
  }
  showUnArchiveConfirmation(selectedItem: DeliverymanViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.unarchiveTemplate, { class: 'modal-sm' });
  }
  showAddToQueueConfirmation(selectedItem: DeliverymanViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.addToQueueTemplate, { class: 'modal-sm' });
  }
  showForceLogOutConfirmation(selectedItem: DeliverymanViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.forceLogOutTemplate, { class: 'modal-sm' });
  }
  showStartTrackingTemplate(selectedItem: DeliverymanViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.startTrackingTemplate, { class: 'modal-sm' });
  }
  showRemovePenalizeConfirmation(selectedItem: DeliverymanViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.removePenalizeTemplate, { class: 'modal-sm' });
  }
  changeStoreModel: AgentChangeStoreViewModel = new AgentChangeStoreViewModel()
  @ViewChild('changeStoreTemplate', { static: false }) changeStoreTemplate: any;
  showChangeStoreTemplate(item: DeliverymanViewModel) {
    this._agentActionService.showChangeStoreTemplate(this.changeStoreModel, item, this.changeStoreTemplate)
  }
  changeStore() {
    this._agentActionService.changeStore(this.changeStoreModel, this.items)
  }
  startTracking() {
    this._deliverymanService.startTracking(this.selectedItem.ID).subscribe((response) => {
      this.selectedItem.IsDeleting = false;
      this._sharedService.showSuccessAlert(response.Message);
    });
  }
  getColors() {
    this.items.forEach((element) => {
      element.ColorStatus = this._statusUtils.getAgentStausColor(element.StatusID);
    });
  }
  navigateToLog(id) {
    this.router.navigate(['/agent/log'], { queryParams: { DeliverymanID: id, }, })
  }
}
