import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { ActivatedRoute } from '@angular/router';
import { BranchDeliveryTimeViewModel } from '../view-models/branch-avgdeliverytime.model';
import { BranchDeliveryTimeSearchViewModel } from '../view-models/branch-avgdeliverytime-search.model';
import { BranchAvgDeliveryTimeService } from '../branch-dlivery-time.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  items: BranchDeliveryTimeViewModel[] = [];
  modalRef: BsModalRef;
  searchViewModel: BranchDeliveryTimeSearchViewModel = new BranchDeliveryTimeSearchViewModel();
  orderBy = "BranchID";
  pageRoute = '/store/delivery-time'
  constructor(
    private _activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _pageService: BranchAvgDeliveryTimeService,
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
      { Name: "ID", Title: "shared.id", Selectable: true, Sortable: true },
      { Name: "BranchName", Title: "shared.name", Selectable: true, Sortable: true },
      { Name: "AverageDeliveryDuration", Title: "store.delivery-time.delivery-duration", Selectable: true, Sortable: true },
      { Name: "AverageIntegrationDuration", Title: "store.delivery-time.integration-duration", Selectable: true, Sortable: true },
      { Name: "AveragePendingDuration", Title: "store.delivery-time.avg-pending-duration", Selectable: true, Sortable: true },
      { Name: "WaitingDuration", Title: "store.delivery-time.waiting-duration", Selectable: true, Sortable: true },
    ];
    this.subscribeToParentEvent()
    this.createSearchForm();
    this._activatedRoute.queryParams.subscribe((params) => {
      this.subscribeFilteration(params)
    });
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    if (this.page.orderBy == "ID")
      this.page.orderBy = "BranchID"
    this._pageService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.page.options.totalItems = response.Data.length;
        this.items = response.Data as BranchDeliveryTimeViewModel[];
      }
      this.fireEventToParent()
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
  getReport() {
    this.page.isSearching = true;
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._pageService.getReport(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe((response) => {
      this.page.isSearching = false;
      this.fireEventToParent()
      this._sharedService.downloadFile(response, 'Avarage Delivery Time Report')
    });
  }
}
