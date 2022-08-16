import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { ActivatedRoute } from '@angular/router';
import { BranchAreaPerformanceService } from '../branch-area-performance.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { BranchAreaPerformanceViewModel } from '../view-models/area-performance.model';
import { BranchAreaPerformanceSearchViewModel } from '../view-models/area-performance-search.model';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  items: BranchAreaPerformanceViewModel[] = [];
  modalRef: BsModalRef;
  searchViewModel: BranchAreaPerformanceSearchViewModel = new BranchAreaPerformanceSearchViewModel();
  pageRoute = '/analytics/performance/area'
  constructor(
    private _activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _branchareaPerformanceService: BranchAreaPerformanceService,
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
      { Name: "ID", Title: "shared.id", Selectable: true, Sortable: false },
      { Name: "AreaName", Title: "shared.name", Selectable: true, Sortable: false },
      { Name: "BranchCount", Title: "store.stores-count", Selectable: true, Sortable: false },
      { Name: "DeliverymanCount", Title: "system.deliverymen", Selectable: true, Sortable: false },
      { Name: "OrderCount", Title: "system.orders-count", Selectable: true, Sortable: false },
      { Name: "Avgarea-performance", Title: "store.performance.avg-delivery-time", Selectable: true, Sortable: false },
      { Name: "OrderDistance", Title: "store.area-performance.avg-order-distance", Selectable: true, Sortable: false },
      { Name: "TripDistance", Title: "store.area-performance.avg-trip-distance", Selectable: true, Sortable: true },
      { Name: "AverageOnDutyTime", Title: "trip.trip-performance.avg-on-duty-time", Selectable: true, Sortable: false },
      { Name: "OrderPerDeliveryman", Title: "store.area-performance.orders-per-dm", Selectable: true, Sortable: false },
      { Name: "AverageOrderOnTrip", Title: "store.performance.orders-per-trip", Selectable: true, Sortable: false },
      { Name: "ExcellentTrips", Title: "trip.trip-performance.excellent-trips", Selectable: true, Sortable: false },
      { Name: "ExcellentOrders", Title: "order.excellent-orders", Selectable: true, Sortable: false },
    ];
    this.createSearchForm();
    this._activatedRoute.queryParams.subscribe((params) => {
      this.subscribeFilteration(params)
    });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      FromDate: [this.searchViewModel.FromDate],
      ToDate: [this.searchViewModel.ToDate],
    });
    this.page.isPageLoaded = true;
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    if (this.page.orderBy == "ID") this.page.orderBy = "AreaID"
    this._branchareaPerformanceService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.page.options.totalItems = response.Data?.length;
        this.items = response.Data as BranchAreaPerformanceViewModel[];
      }
      this.fireEventToParent()
    });
  }
}
