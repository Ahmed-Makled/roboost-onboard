import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DeliverymanRankByPointViewModel } from '../view-models/ranking.model';
import { forkJoin } from 'rxjs';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { RankingAgentService } from '../ranking-agent.service';
import { ListService } from 'src/app/service/list.service';
import { DeliverymanRankByPointSearchViewModel } from '../view-models/ranking-search.model';
import * as moment from 'moment';
import { LocalizationService } from 'src/app/service/localization.service';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  orderBy = "Points";
  pageRoute = '/ranking-board/delivery-agents'
  items: DeliverymanRankByPointViewModel[] = [];
  branchList: SelectItem[] = [];
  areaList: SelectItem[] = [];
  agentList: SelectItem[] = [];
  selected: SelectItem
  selectedItem: DeliverymanRankByPointViewModel = new DeliverymanRankByPointViewModel();
  modalRef: BsModalRef;
  searchViewModel: DeliverymanRankByPointSearchViewModel = new DeliverymanRankByPointSearchViewModel();
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  rowSize: number = 10;
  btnList: SelectItem[] = [
    { ID: 1, Name: "By Quarter", Url: "", Selected: true },
    { ID: 2, Name: "By Month", Url: "", Selected: false },
  ]
  constructor(
    public _sharedService: SharedService,
    private _rankingAgentService: RankingAgentService,
    private _listService: ListService,
    private _localizationService: LocalizationService,
    private activatedRoute: ActivatedRoute,

  ) {
    super(_sharedService)
  }
  ngOnDestroy(): void {
    this.canSendToParent = false
  }
  ngOnInit() {
    this.initializePage();
  }
  initializePage() {
    this.page.columns = [
      { Name: "Rank", Title: "dm-rank.rank", Selectable: true, Sortable: true },
      { Name: "Name", Title: "dm-rank.name", Selectable: true, Sortable: true },
      { Name: "BranchName", Title: "dm-rank.branch-name", Selectable: true, Sortable: true, IsHidden: this.isSingleStore() },
      { Name: "Total", Title: "dm-rank.total", Selectable: true, Sortable: true },
      { Name: "Bonus", Title: "dm-rank.bonus", Selectable: true, Sortable: true },
      { Name: "Deduction", Title: "dm-rank.deduction", Selectable: true, Sortable: true },
      { Name: "Total", Title: "dm-rank.percentage", Selectable: true, Sortable: true },
    ];
    forkJoin([
      this._listService.getBranchList(),
      this._listService.getAreaList(),
      this._listService.getDeliverymanList()
    ]).subscribe(res => {
      this.branchList = res[0].Data
      this.areaList = res[1].Data
      this.agentList = res[2].Data
    }
    );
    this.subscribeToParentEvent()
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this.subscribeFilteration(params)
    });
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.Date = moment(this.searchViewModel.Date).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this._rankingAgentService.get(this.searchViewModel, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as DeliverymanRankByPointViewModel[];
        this.page.isPageLoaded = true;
      }
      this.fireEventToParent()
    });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.searchViewModel.Date = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.page.searchForm = this._sharedService.formBuilder.group({
      BranchID: [this.searchViewModel.BranchID],
      AreaID: [this.searchViewModel.AreaID],
      Date: [this.searchViewModel.Date],
      FromDate: [this.searchViewModel.FromDate],
      ToDate: [this.searchViewModel.ToDate],
      DeliverymanID: [this.searchViewModel.DeliverymanID]
    });
  }
  getDeliverymanList(id) {
    this.page.searchForm.controls['DeliverymanID']?.reset()
    this._listService.getDeliverymanList(id ?? 0).subscribe(res => {
      if (res.Success) this.agentList = res.Data
    })
  }
  getRankOrdinal(i: number): string {
    let j = i % 10;
    if (j == 1 && i != 11) {
      return "st";
    }
    if (j == 2 && i != 12) {
      return "nd";
    }
    if (j == 3 && i != 13) {
      return "rd";
    }
    return "th";
  }
  getScoreProgress(score: number): number {
    if (score <= 0)
      return 100
    return 100 - ((score / this.items[0].Total) * 100)
  }
  getReport() {
    this.page.isSearching = true;
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.Date = moment(this.searchViewModel.Date).format('YYYY-MM-DD');
    this._rankingAgentService.getReport(this.searchViewModel, this.page.options.currentPage, this.page.options.itemsPerPage)
      .subscribe(response => {
        this.page.isSearching = false;
        this.fireEventToParent()
        this.downloadFile(response)
      });
  }
  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = "Ranking  Report " + (new Date()).toLocaleDateString() + " .xlsx";
    anchor.href = url;
    anchor.click();
  }
  isEnglish() {
    return this._localizationService.getCurrentLanguage() === 'en';
  }
}
