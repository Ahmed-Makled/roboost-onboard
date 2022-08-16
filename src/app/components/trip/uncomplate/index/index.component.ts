import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TripViewModel } from '../view-models/trip.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TripSearchViewModel } from '../view-models/trip-search.model';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
import { TripStatus } from 'src/app/enum/trip-status';
import { TripRateEditViewModel } from '../view-models/trip-create.model';
import { TripService } from '../uncomplate.service';
import { TripRateOption } from 'src/app/enum/trip-rate-option';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
import { StatusUtilsService } from 'src/app/service/status.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit, OnDestroy {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/trip/uncompleted'
  modalRef: BsModalRef;
  items: TripViewModel[] = [];
  item: TripViewModel;
  statusList: SelectItem[] = [];
  rateOptionList: SelectItem[] = [];
  deliverymanList: SelectItem[] = [];
  branchList: SelectItem[] = [];
  selected: SelectItem
  tripRateEditReasons: SelectItem[] = [];
  selectedItem: TripViewModel = new TripViewModel();
  searchViewModel: TripSearchViewModel = new TripSearchViewModel();
  advancedSearch: boolean = false;
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  @ViewChild('EditPerformanceTemplate', { static: false }) EditPerformanceTemplate: any;
  editRateModel: TripRateEditViewModel = new TripRateEditViewModel();
  tripChangeperformanceRate = TripRateOption
  constructor(
    private _pageService: TripService,
    public _sharedService: SharedService,
    private _listService: ListService,
    private activatedRoute: ActivatedRoute,
    private _statusUtilsService:StatusUtilsService

  ) {
    super(_sharedService);
  }
  ngOnDestroy(): void {
    this.canSendToParent = false
  }
  ngOnInit() {
    this.initializePage();
  }
  initializePage() {
    this.page.columns = [
      { Name: "Number", Title: "order.trip-number", Selectable: true, Sortable: true },
      { Name: "BranchName", Title: "system.store-name", Selectable: true, Sortable: true },
      { Name: "DeliverymanID", Title: "system.deliveryman-name", Selectable: true, Sortable: true },
      { Name: "OrdersCount", Title: "order.title", Selectable: true, Sortable: false },
      { Name: "Status", Title: "system.status", Selectable: true, Sortable: true },
      { Name: "RateStatus", Title: "system.performance", Selectable: true, Sortable: true },
      { Name: "IsSpecialTrip", Title: "trip.is-special", Selectable: true, Sortable: false },
      { Name: "Duration", Title: "system.duration", Selectable: true, Sortable: false },
      { Name: "PlannedDistance", Title: "system.distance", Selectable: true, Sortable: true },
      { Name: "Amount", Title: "system.amount", Selectable: true, Sortable: true },
      { Name: "CreatedDate", Title: "system.create-date", Selectable: true, Sortable: true },
      { Name: "StartTime", Title: "system.start-date", Selectable: true, Sortable: true },
      { Name: "CloseTime", Title: "system.complete-date", Selectable: true, Sortable: true },
    ];
    this.subscribeToParentEvent()
    this.createSearchForm();
    forkJoin([
      this._listService.getTripStatusList(),
      this._listService.getDeliverymanList(),
      this._listService.getTripRateList(),
      this._listService.getBranchList(),
      this._listService.getTripRateEditReasonList()
    ]).subscribe(res => {
      this.statusList = res[0].Data;
      this.deliverymanList = res[1].Data
      this.rateOptionList = res[2].Data
      this.branchList = res[3].Data,
        this.tripRateEditReasons = res[4].Data
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      if (params.rate)
        this.searchViewModel.Performance = params.rate;
      if (params.deliverymanID)
        this.searchViewModel.DeliverymanID = params.deliverymanID;
      if (params.branchID) {
        this.searchViewModel.BranchID = params.branchID;
        this.selected = this.branchList.find(br => br.ID == this.searchViewModel.BranchID)
      }
      this.search();
    });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      DeliverymanID: [this.searchViewModel.DeliverymanID],
      BranchID: [this.searchViewModel.BranchID],
      ID: [this.searchViewModel.ID],
      Number: [this.searchViewModel.Number],
      ToDate: [this.searchViewModel.ToDate],
      FromDate: [this.searchViewModel.FromDate],
      Status: [this.searchViewModel.Status],
      Performance: [this.searchViewModel.Performance],
      IsSpecialTrip: [this.searchViewModel.IsSpecialTrip],
      EnrollID: [this.searchViewModel.EnrollID]
    });
    this.page.isPageLoaded = true;
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._pageService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage,).subscribe(response => {
      if (response.Success) {
        this.page.isSearching = false;
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as TripViewModel[];
        this.items.forEach(x => x.IsSelected = false);
        this.getColors()
        this.getStatusColors()
      }
      this.fireEventToParent()
    }, () => { this.page.isSearching = false });
  }
  getColors() {
    this.items.forEach(element => { element.PerformanceColor = this._statusUtilsService.getTaskRateColors(element.RateStatus) });
  }
  getStatusColors() {
    this.items.forEach(element => { element.StatusColor = this._statusUtilsService.getTripRateColors(element.Status) });
  }
  showEditPerformanceTemplate(item: TripViewModel) {
    this.editRateModel.Rate = null
    this.editRateModel.Note = null
    this.item = item
    this.modalRef = this._sharedService.modalService.show(this.EditPerformanceTemplate, { class: 'modal-sm modal-50' });
  }
  onReasonChange(reasonID: number) {
    this.editRateModel.ReasonID = reasonID;
  }
  disableUpdateRate(): boolean {
    return this.editRateModel.Rate == undefined
      || this.editRateModel.Rate == this.item.RateStatus
      || this.editRateModel.ReasonID == undefined
      || (this.editRateModel.ReasonID == 13 && (this.editRateModel.Note == null || this.editRateModel.Note == ""));
  }
  isTripClosed(tripStatus: TripStatus) {
    return tripStatus == TripStatus.COMPLETED;
  }
  getTripAnotationByStatus(tripStatus: TripStatus): any {
    return this._sharedService.getTripAnotationByStatus(tripStatus)
  }
  getDeliverymanList(id) {
    this.page.searchForm.controls['DeliverymanID']?.reset()
    this._listService.getDeliverymanList(id ?? 0).subscribe(res => {
      if (res.Success) { this.deliverymanList = res.Data }
    })
  }
  getReport() {
    this.page.isSearching = true;
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._pageService.getReport(this.searchViewModel, this.page.orderBy, this.page.isAscending).subscribe(response => {
      this.page.isSearching = false;
      this.fireEventToParent()
      this._sharedService.downloadFile(response, "Trip Report")
    });
  }
}
