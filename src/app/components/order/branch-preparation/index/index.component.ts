import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { BranchPreparationService } from '../branch-preparation.service';
import { BranchPreparationSearchViewModel } from '../view-models/branch-preparation-search.model';
import { BranchPreparationViewModel } from '../view-models/branch-preparation.model';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  // styleUrls: ['./index.component.css']
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  orderBy = "BranchID";
  pageRoute = '/analytics/task/preparation-time/store'
  items: BranchPreparationViewModel[] = [];
  searchViewModel: BranchPreparationSearchViewModel = new BranchPreparationSearchViewModel();
  constructor(
    private _activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _pageService: BranchPreparationService,
  ) {
    super(_sharedService);
  }
  ngOnInit() {
    this.initializePage();
  }
  initializePage() {
    this.page.isPageLoaded = false;
    this.page.columns = [
      { Name: "BranchID", Title: "order.branch-name", Selectable: true, Sortable: false },
      { Name: "AvgPreparationDuration", Title: "order.preparation.average-preparation-duration", Selectable: true, Sortable: false },
    ];
    this.createSearchForm();
    this._activatedRoute.queryParams.subscribe(params => { this.subscribeFilteration(params) });
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
    if (this.page.orderBy == "ID") this.page.orderBy = "BranchID"
    this._pageService.get(this.searchViewModel).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.page.options.totalItems = response.Data.length;
        this.page.options.totalPages = 1;
        this.page.options.itemsPerPage = 50;
        this.items = response.Data as BranchPreparationViewModel[];
      }
      this.fireEventToParent()
    }, () => { this.page.isSearching = false });
  }
}
