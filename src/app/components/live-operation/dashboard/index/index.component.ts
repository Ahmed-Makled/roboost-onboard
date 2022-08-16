import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashBoardService } from '../dashboard.service';
import { NgProgress } from 'ngx-progressbar';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
import { forkJoin } from 'rxjs';
import { DashboardSearchViewModel } from '../view-models/dashboard-search.model';
import * as moment from 'moment';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage()
  branchList: SelectItem[] = [];
  areaList: SelectItem[] = [];
  searchViewModel:DashboardSearchViewModel = new DashboardSearchViewModel()
  fromDate: Date
  toDate: Date = new Date();
  isloading: boolean = false
  branchChange: EventEmitter<number> = new EventEmitter()

  constructor(
    private _sharedService: SharedService,
    private _listService: ListService,
    private _dashBoard: DashBoardService,
    private activatedRoute: ActivatedRoute,
    private _ngProgress: NgProgress,
  ) {
 
  }

  ngOnInit(): void {
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      Object.assign(this.searchViewModel, this.page.searchForm.value);
      this.searchViewModel = {...this.searchViewModel}
    });
    forkJoin([
      this._listService.getAreaList(),
      this._listService.getBranchList(this.searchViewModel.AreaID),
    ]).subscribe((res) => {
      this.areaList = res[0].Data
      this.branchList = res[1].Data
      this.page.isPageLoaded = true;
    });
    this._ngProgress.ref().started.subscribe(x => {
      this.isloading = true
    })
    this._ngProgress.ref().completed.subscribe(x => {
      this.isloading = false
    })
  }

  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      AreaID: [this.searchViewModel.AreaID],
      BranchID: [this.searchViewModel.BranchID],
      FromDate: [ this.searchViewModel.FromDate],
      ToDate:  [ this.searchViewModel.ToDate]
    });
  }
  areaChanged(value:number) {
    this._listService.getBranchList(value).subscribe(res => {
      this.branchList = res.Data
    })
    this.page.searchForm.get("BranchID").setValue(null)
    this.onSearchClicked()
  }
  branchChanged() {
    this.onSearchClicked()
  }

  onSearchClicked() {
    this._sharedService.saveFilteration({
      pageRoute: '/live-operation/live-dashboard',
      searchForm: this.page.searchForm,
    });
  }

  isSingleStore() {
    return this._sharedService._storageService.getISSingleStore()
  }

}
