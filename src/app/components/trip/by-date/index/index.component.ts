import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { TripSearchViewModel } from '../../home/view-models/trip-search.model';
import { SharedService } from 'src/app/service/shared.service';
import { TripByDateViewModel } from '../view-models/by-date.model';
import { TripByDateService } from '../by-date.service';
import { ListService } from 'src/app/service/list.service';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  orderBy = "Date";
  pageRoute = '/analytics/trip/date'
  modalRef: BsModalRef;
  items: TripByDateViewModel[] = [];
  selectedItem: TripByDateViewModel = new TripByDateViewModel();
  searchViewModel: TripSearchViewModel = new TripSearchViewModel();
  Date: string = ""
  branchList: SelectItem[] = []
  constructor(
    private activatedRoute: ActivatedRoute,
    private _pageService: TripByDateService,
    public _sharedService: SharedService,
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
    this.page.columns = [
      { Name: "Date", Title: "shared.date", Selectable: true, Sortable: true },
      { Name: "Total", Title: "shared.total", Selectable: true, Sortable: true },
      { Name: "AverageDeliveryTime", Title: "trip.trip-performance.average-delivery-time", Selectable: true, Sortable: true },
      { Name: "ScoreStar", Title: "trip.trip-performance.score-stars", Selectable: true, Sortable: true },
      { Name: "ExcellentTrips", Title: "trip.trip-performance.excellent-trips", Selectable: true, Sortable: true },
      { Name: "GoodTrips", Title: "trip.trip-performance.good-trips", Selectable: true, Sortable: true },
      { Name: "LateTrips", Title: "trip.trip-performance.late-trips", Selectable: true, Sortable: true },
      { Name: "TooLateTrips", Title: "trip.trip-performance.too-late-trips", Selectable: true, Sortable: true },
    ];
    this._listService.getBranchList().subscribe(res => { this.branchList = res.Data });
    this.subscribeToParentEvent()
    this.createSearchForm();
    this.page.orderBy = "Date"
    this.activatedRoute.queryParams.subscribe(params => { this.subscribeFilteration(params) });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      ToDate: [this.searchViewModel.ToDate],
      FromDate: [this.searchViewModel.FromDate],
      BranchID: [this.searchViewModel.BranchID],
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
        this.items = response.Data.Items as TripByDateViewModel[];
      }
      this.fireEventToParent()
    });
  }
  getReport() {
    this.page.isSearching = true;
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._pageService.getReport(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      this.fireEventToParent()
      this._sharedService.downloadFile(response, "Trip Performance Detail By Date Report")
    }, () => this.page.isSearching = false);
  }
}
