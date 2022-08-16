import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
import { OrderSearchViewModel } from '../../home/view-models/order-search.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { OrderPerformanceService } from '../order-performance.service';
import { OrderPerformanceViewModel } from '../view-models/performance.model';
import { ActivatedRoute } from '@angular/router';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-by-deliveryman',
  templateUrl: './by-deliveryman.component.html',
})
export class OrderByDeliverymanComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  orderBy = "DeliverymanID";
  pageRoute = '/task/by-deliveryman'
  modalRef: BsModalRef;
  items: OrderPerformanceViewModel[] = [];
  selectedItem: OrderPerformanceViewModel = new OrderPerformanceViewModel();
  searchViewModel: OrderSearchViewModel = new OrderSearchViewModel();
  branchList: SelectItem[] = [];
  constructor(
    private _pageService: OrderPerformanceService,
    public _sharedService: SharedService,
    private _listService: ListService,
    private activatedRoute: ActivatedRoute
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
      { Name: "DeliverymanID", Title: "system.store", Selectable: false, Sortable: true },
      { Name: "DeliverymanID", Title: "order.deliveryman-name", Selectable: true, Sortable: true },
      { Name: "Stars", Title: "order.stars", Selectable: true, Sortable: true },
      { Name: "AverageDeliveryTime", Title: "order.average-delivery-time", Selectable: true, Sortable: true },
      { Name: "Total", Title: "order.total", Selectable: true, Sortable: true },
    ];
    this._listService.getBranchList().subscribe(res => { this.branchList = res.Data });
    this.page.orderBy = "DeliverymanID";
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe(params => { this.subscribeFilteration(params) })
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      branchID: [this.searchViewModel.branchID],
      ToDate: [this.searchViewModel.ToDate],
      FromDate: [this.searchViewModel.FromDate],
    });
    this.page.isPageLoaded = true;
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._pageService.getByDeliveryman(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as OrderPerformanceViewModel[];
      }
      this.fireEventToParent()
    });
  }
}