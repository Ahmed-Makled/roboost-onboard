import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { TripSearchViewModel } from '../../home/view-models/trip-search.model';
import { SharedService } from 'src/app/service/shared.service';
import { TripByBranchViewModel } from '../view-models/by-branch.model';
import { TripByBranchService } from '../by-branch.service';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  orderBy = "BranchID";
  pageRoute = '/analytics/trip/store'
  modalRef: BsModalRef;
  items: TripByBranchViewModel[] = [];
  selectedItem: TripByBranchViewModel = new TripByBranchViewModel();
  searchViewModel: TripSearchViewModel = new TripSearchViewModel();
  Date: string = ""
  constructor(
    private activatedRoute: ActivatedRoute,
    private _pageService: TripByBranchService,
    public _sharedService: SharedService,
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
      { Name: "BranchID", Title: "system.store", Selectable: true, Sortable: true },
      { Name: "Total", Title: "trip.trip-performance.total", Selectable: true, Sortable: true },
      { Name: "AverageDeliveryTime", Title: "trip.trip-performance.average-delivery-time", Selectable: true, Sortable: true },
      { Name: "AverageDistance", Title: "trip.trip-performance.average-distance", Selectable: true, Sortable: true },
      { Name: "AverageOnDutyTime", Title: "trip.trip-performance.avg-on-duty-time", Selectable: true, Sortable: true },
      { Name: "AverageOrderOnTrip", Title: "trip.trip-performance.avg-order-on-trip", Selectable: true, Sortable: true },
      { Name: "ScoreStar", Title: "trip.trip-performance.score-stars", Selectable: true, Sortable: true },
      { Name: "ExcellentTrips", Title: "trip.trip-performance.excellent-trips", Selectable: true, Sortable: true },
      { Name: "GoodTrips", Title: "trip.trip-performance.good-trips", Selectable: true, Sortable: true },
      { Name: "LateTrips", Title: "trip.trip-performance.late-trips", Selectable: true, Sortable: true },
      { Name: "TooLateTrips", Title: "trip.trip-performance.too-late-trips", Selectable: true, Sortable: true },
    ];
    this.page.orderBy = "BranchID"
    this.subscribeToParentEvent()
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.FromDate) this.Date = params.FromDate;
      this.subscribeFilteration(params)
    })
  }
  createSearchForm() {
    if (this.Date === "") this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    else this.searchViewModel.FromDate = new Date(this.Date)
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      ToDate: [this.searchViewModel.ToDate],
      FromDate: [this.searchViewModel.FromDate],
    });
    this.page.isPageLoaded = true
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
        this.items = response.Data.Items as TripByBranchViewModel[];
      }
      this.fireEventToParent()
    });
  }
  getTimeWithHours(timeInMinuts: number) {
    let time = Math.abs(timeInMinuts);
    var hours = Math.floor(time / 60);
    var minutes = Math.round(time - hours * 60);
    return `${hours}:${minutes}`;
  }
  getReport() {
    this.page.isSearching = true;
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._pageService.getReport(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      this.fireEventToParent()
      this._sharedService.downloadFile(response, "Trip Performance Detail By Branch Report")
    });
  }
}