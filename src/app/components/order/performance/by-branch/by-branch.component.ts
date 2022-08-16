import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { OrderSearchViewModel } from '../../home/view-models/order-search.model';
import { OrderPerformanceService } from '../order-performance.service';
import { OrderPerformanceViewModel } from '../view-models/performance.model';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-by-branch',
  templateUrl: './by-branch.component.html',
})
export class OrderByBranchComponent extends CrudIndexBaseUtils implements OnInit, OnDestroy {
  page: CRUDIndexPage = new CRUDIndexPage();
  orderBy = "BranchID";
  pageRoute = '/analytics/task/store'
  modalRef: BsModalRef;
  items: OrderPerformanceViewModel[] = [];
  selectedItem: OrderPerformanceViewModel = new OrderPerformanceViewModel();
  searchViewModel: OrderSearchViewModel = new OrderSearchViewModel();
  Date: string = ""
  constructor(
    private activatedRoute: ActivatedRoute,
    private _pageService: OrderPerformanceService,
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
      { Name: "BranchID", Title: "order.branch-name", Selectable: true, Sortable: true },
      { Name: "AverageDeliveryTime", Title: "order.average-delivery-time", Selectable: true, Sortable: true },
      { Name: "Total", Title: "order.total", Selectable: true, Sortable: true },
      { Name: "ExcellentOrders", Title: "order.excellent-orders", Selectable: true, Sortable: true },
      { Name: "GoodOrders", Title: "order.good-orders", Selectable: true, Sortable: true },
      { Name: "LateOrders", Title: "order.late-orders", Selectable: true, Sortable: true },
      { Name: "TooLateOrders", Title: "order.too-late-orders", Selectable: true, Sortable: true },
    ];
    this.page.orderBy = "BranchID"
    this.subscribeToParentEvent();
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      if (params.Date) {
        this.Date = params.Date;
      }
      this.search();
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
    this._pageService.getByBranch(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as OrderPerformanceViewModel[];
      }
      this.fireEventToParent();
    }, () => { this.page.isSearching = false });
  }
  getReport() {
    this.page.isSearching = true;
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._pageService.getByBranchReport(this.searchViewModel, this.page.orderBy, this.page.isAscending).subscribe(response => {
      this.page.isSearching = false;
      this.page.isSearching = false;
      this.fireEventToParent();
      this._sharedService.downloadFile(response, "Order Performance By Branch Report")
    });
  }
}