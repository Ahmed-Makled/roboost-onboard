import { Component, OnInit, } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { BranchBehaviorViewModel } from '../view-models/branch-behavior.model';
import { BranchBehaviorSearchViewModel } from '../view-models/branch-behavior-search.model';
import { BranchBehaviorService } from '../branch-behavior.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute } from '@angular/router';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/analytics/performance/behavior';
  orderBy = 'BranchID';
  items: BranchBehaviorViewModel[] = [];
  modalRef: BsModalRef;
  searchViewModel: BranchBehaviorSearchViewModel = new BranchBehaviorSearchViewModel();
  constructor(
    public _sharedService: SharedService,
    private _pageService: BranchBehaviorService,
    private _activatedRoute: ActivatedRoute
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
      { Name: "DeliverymanCount", Title: "system.deliveryman", Selectable: true, Sortable: true },
      { Name: "IgnoredRequest", Title: "store.behavior.ignored-trip", Selectable: true, Sortable: true },
      { Name: "FastOrderCount", Title: "store.behavior.fast-order-count", Selectable: true, Sortable: true },
      { Name: "SpecialTripCount", Title: "store.behavior.special-count", Selectable: true, Sortable: true },
      { Name: "AddToSpecificTripCount", Title: "store.behavior.added-to-trip", Selectable: true, Sortable: true },
    ];
    this.page.orderBy = "ID";
    this.createSearchForm();
    this._activatedRoute.queryParams.subscribe(params => {
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
    if (this.page.orderBy == "ID")
      this.page.orderBy = "BranchID"
    this._pageService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.page.options.totalItems = response.Data.length;
        this.items = response.Data as BranchBehaviorViewModel[];
      }
      this.fireEventToParent()
    });
  }
}
