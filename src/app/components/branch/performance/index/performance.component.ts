import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { BranchPerformanceViewModel } from '../view-models/branch-performance.model';
import { BranchHomeSearchViewModel } from '../../home/view-models/branch-home-search.model';
import { BranchPerformanceService } from '../branch-performance.service';
import { GroupingTypeEnum } from 'src/app/components/dispatch/page/view-models/filter.model';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
})
export class PerformanceComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  items: BranchPerformanceViewModel[] = [];
  advancedSearch: boolean = false;
  selectedItem: BranchPerformanceViewModel = new BranchPerformanceViewModel();
  modalRef: BsModalRef;
  searchViewModel: BranchHomeSearchViewModel = new BranchHomeSearchViewModel();
  areaList: SelectItem[] = []
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  orderBy = 'BranchID';
  pageRoute = '/analytics/performance/store'
  constructor(
    private activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _pageService: BranchPerformanceService,
    private _listService: ListService
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
      { Name: "BranchID", Title: "shared.id", Selectable: true, Sortable: true },
      { Name: "BranchName", Title: "shared.name", Selectable: true, Sortable: true },
      { Name: "DeliverymanCount", Title: "system.deliverymen", Selectable: true, Sortable: true },
      { Name: "AvgDeliveryTime", Title: "store.performance.avg-delivery-time", Selectable: true, Sortable: true },
      { Name: "WaitingDuration", Title: "store.performance.avg-waiting-time", Selectable: true, Sortable: true },
      { Name: "OrderCount", Title: "system.orders-count", Selectable: true, Sortable: true },
      { Name: "OrderDistance", Title: "trip.trip-performance.average-distance", Selectable: true, Sortable: true },
      { Name: "TripDistance", Title: "store.performance.trip-distance", Selectable: true, Sortable: true },
      { Name: "AverageOnDutyTime", Title: "store.performance.avg-on-duty", Selectable: true, Sortable: true },
      { Name: "OrderPerDeliveryman", Title: "store.performance.orders-per-dm", Selectable: true, Sortable: true },
      { Name: "AverageOrderOnTrip", Title: "store.performance.orders-per-trip", Selectable: true, Sortable: true },
      { Name: "ExcellentTrips", Title: "trip.trip-performance.excellent-trips", Selectable: true, Sortable: true },
      { Name: "ExcellentOrders", Title: "order.excellent-orders", Selectable: true, Sortable: true },
    ];
    forkJoin([
      this._listService.getAreaList()
    ]).subscribe(res => {
      this.areaList = res[0].Data
    });
    this.subscribeToParentEvent()
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe((params) =>   this.subscribeFilteration(params));
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      FromDate: [this.searchViewModel.FromDate],
      ToDate: [this.searchViewModel.ToDate],
      AreaID: [this.searchViewModel.AreaID],
    });
    this.page.isPageLoaded = true;
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    if (this.page.orderBy == "ID") this.page.orderBy = "BranchID"
    this._pageService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.items = response.Data as BranchPerformanceViewModel[];
        this.page.options.totalItems = response.Data?.length;
      }
      this.fireEventToParent()
    });
  }
  getReport() {
    this.page.isSearching = true;
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._pageService.getReport(this.searchViewModel, this.page.orderBy, this.page.isAscending).subscribe(response => {
      this.page.isSearching = false;
      this.fireEventToParent()
      this._sharedService.downloadFile(response, "Branch Performance Report")
    });
  }
  getFilterByStoreValue() {
    return GroupingTypeEnum.STORE;
  }
}
