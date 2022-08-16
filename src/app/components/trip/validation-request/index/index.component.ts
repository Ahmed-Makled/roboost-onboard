import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
import { ColumnViewModel } from 'src/app/model/shared/column-view-model';
import { TripValidationRequestService } from '../validation-request.service';
import { TripValidationRequestViewModel } from '../view-models/validation-request.model';
import { TripValidationRequestSearchViewModel } from '../view-models/validation-request-search.model';
import { TripValidationRequestEnum } from '../view-models/validation-request.enum';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
import { StatusUtilsService } from 'src/app/service/status.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit, OnDestroy {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/trip/validation-request'
  featureType = FeatureEnum
  modalRef: BsModalRef;
  items: TripValidationRequestViewModel[] = [];
  item: TripValidationRequestViewModel;
  searchViewModel: TripValidationRequestSearchViewModel = new TripValidationRequestSearchViewModel();
  statusList: SelectItem[] = [];
  rateOptionList: SelectItem[] = [];
  deliverymanList: SelectItem[] = [];
  branchList: SelectItem[] = [];
  requestStatusList: SelectItem[] = []
  supervisorList: SelectItem[] = []
  selectedItem: TripValidationRequestViewModel = new TripValidationRequestViewModel();
  advancedSearch: boolean = false;
  constructor(
    private _pageService: TripValidationRequestService,
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
    this.page.isPageLoaded = false;
    this.page.columns = [
      { Name: "TripNumber", Title: "shared.number", Selectable: true, Sortable: true },
      { Name: "RequestStatus", Title: "system.status", Selectable: true, Sortable: true },
      { Name: "ValidationTime", Title: "trip.trip-validation.validation-date", Selectable: true, Sortable: true },
      { Name: "ValidationNote", Title: "trip.trip-validation.validation-note", Selectable: true, Sortable: true },
      { Name: "Note", Title: "shared.note", Selectable: true, Sortable: true },
      { Name: "DeliverymanName", Title: "system.deliveryman-name", Selectable: true, Sortable: true },
      { Name: "BranchName", Title: "system.store", Selectable: true, Sortable: true },
      { Name: "OrdersCount", Title: "system.orders", Selectable: true, Sortable: false },
      { Name: "TripStatus", Title: "shared.status", Selectable: true, Sortable: true },
      { Name: "TripRateStatus", Title: "system.performance", Selectable: true, Sortable: true },
      { Name: "Duration", Title: "system.duration", Selectable: true, Sortable: true },
      { Name: "CreatedDate", Title: "trip.trip-validation.create-date", Selectable: true, Sortable: true },
      { Name: "StartTime", Title: "trip.trip-validation.start-date", Selectable: true, Sortable: true },
      { Name: "CloseTime", Title: "trip.trip-validation.complete-date", Selectable: true, Sortable: true }
    ];
    this.subscribeToParentEvent()
    this.createSearchForm();
    forkJoin([
      this._listService.getTripStatusList(),
      this._listService.getDeliverymanList(),
      this._listService.getTripRateList(),
      this._listService.getBranchList(),
      this._listService.getTripValidationStatusList(),
    ]).subscribe(res => {
      this.statusList = res[0].Data;
      this.deliverymanList = res[1].Data
      this.rateOptionList = res[2].Data
      this.branchList = res[3].Data,
        this.requestStatusList = res[4].Data
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      if (params.deliverymanID) this.searchViewModel.deliverymanID = params.deliverymanID;
      if (params.branchID) this.searchViewModel.BranchID = params.branchID;
      this.search();
    });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      deliverymanID: [this.searchViewModel.deliverymanID],
      BranchID: [this.searchViewModel.BranchID],
      tripID: [this.searchViewModel.tripID],
      number: [this.searchViewModel.number],
      ToDate: [this.searchViewModel.ToDate],
      FromDate: [this.searchViewModel.FromDate],
      Status: [this.searchViewModel.Status],
      RequestStatus: [this.searchViewModel.RequestStatus = TripValidationRequestEnum.UNDER_REVIEW],
      Performance: [this.searchViewModel.Performance],
      supervisorID: [this.searchViewModel.supervisorID],
    })
    this.page.isPageLoaded = true;
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._pageService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as TripValidationRequestViewModel[];
        this.items.forEach(x => x.IsSelected = false);
        this.getColors()
      }
      this.fireEventToParent()
    }, () => { this.page.isSearching = false });
  }
  getColors() {
    this.items.forEach(element => { element.StatusColor = this._statusUtilsService.getTaskRateColors(element.TripRateStatus) });
  }
  getDeliverymanList(id) {
    this.page.searchForm.controls['deliverymanID']?.reset()
    this._listService.getDeliverymanList(id ?? 0).subscribe(res => {
      if (res.Success) {
        this.deliverymanList = res.Data
      }
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
      this._sharedService.downloadFile(response, "Trip Validation Report")
    });
  }
}
