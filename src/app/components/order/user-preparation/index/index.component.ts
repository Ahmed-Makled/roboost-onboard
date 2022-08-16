import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { ListService } from 'src/app/service/list.service';
import { SharedService } from 'src/app/service/shared.service';
import { UserPreparationService } from '../user-preparation.service';
import { UserPreparationSearchViewModel } from '../view-models/user-preparation-search.model';
import { UserPreparationViewModel } from '../view-models/user-preparation.model';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  // styleUrls: ['./index.component.css']
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/analytics/task/preparation-time/user'
  items: UserPreparationViewModel[] = [];
  searchViewModel: UserPreparationSearchViewModel = new UserPreparationSearchViewModel();
  branchList: SelectItem[] = [];
  constructor(
    private _activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _listService: ListService,
    private _pageService: UserPreparationService,
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
      { Name: "BranchID", Title: "shared.name", Selectable: true, Sortable: false },
      { Name: "AvgPreparationDuration", Title: "order.preparation.average-preparation-duration", Selectable: true, Sortable: false },
    ];
    this._listService.getBranchList().subscribe(res => { this.branchList = res.Data; });
    this.createSearchForm();
    this._activatedRoute.queryParams.subscribe(params => { this.subscribeFilteration(params) });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      FromDate: [this.searchViewModel.FromDate],
      ToDate: [this.searchViewModel.ToDate],
      BranchID: [this.searchViewModel.BranchID],
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
        this.page.options.itemsPerPage = 1000;
        this.items = response.Data as UserPreparationViewModel[];
      }
      this.fireEventToParent()
    });
  }
}
