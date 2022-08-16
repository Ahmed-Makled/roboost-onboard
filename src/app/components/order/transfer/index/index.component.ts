import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { ListService } from 'src/app/service/list.service';
import { SharedService } from 'src/app/service/shared.service';
import { TransferService } from '../transfer.service';
import { TransferSearchViewModel } from '../view-model/transfer-search.model';
import { TransferViewModel } from '../view-model/transfer.model';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: []
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit, OnDestroy {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/task/transfers'
  items: TransferViewModel[] = []
  selected: SelectItem
  selectedItem: TransferViewModel = new TransferViewModel();
  branchList: SelectItem[] = [];
  numbers: number[] = []
  modalRef: BsModalRef;
  searchViewModel: TransferSearchViewModel = new TransferSearchViewModel();
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _transferService: TransferService,
    public _sharedService: SharedService,
    private _listService: ListService,
  ) {
    super(_sharedService);
  }
  ngOnInit() {
    this.initializePage();
  }
  ngOnDestroy(): void {
    this.canSendToParent = false
  }
  initializePage() {
    this.page.isPageLoaded = false;
    this.page.columns = [
      { Name: "Transfer Number", Title: "order.transfer.transfer-number", Selectable: true, Sortable: false },
      { Name: "Order Number", Title: "order.order-number", Selectable: false, Sortable: false },
      { Name: "From Brach", Title: "order.transfer.from-store", Selectable: true, Sortable: false },
      { Name: "ToBranch", Title: "order.transfer.to-store", Selectable: true, Sortable: false },
      { Name: "Created Date", Title: "system.created-date", Selectable: true, Sortable: false },
    ];
    this.subscribeToParentEvent()
    this._listService.getBranchList().subscribe(res => { this.branchList = res.Data; });
    this.createSearchForm();
    this._activatedRoute.queryParams.subscribe(params => { this.subscribeFilteration(params) });
  }
  createSearchForm() {
    this.searchViewModel.ToDate = new Date();
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.page.searchForm = this._sharedService.formBuilder.group({
      TransferNumber: [this.searchViewModel.TransferNumber],
      OrderNumber: [this.searchViewModel.OrderNumber],
      FromDate: [this.searchViewModel.FromDate],
      ToDate: [this.searchViewModel.ToDate],
      FromBranchID: [this.searchViewModel.FromBranchID],
      ToBranchID: [this.searchViewModel.ToBranchID],
    });
    this.page.isPageLoaded = true;
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._transferService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as TransferViewModel[];
      }
      this.fireEventToParent();
    }, () => { this.page.isSearching = false });
  }
  getReport() {
    this.page.isSearching = true;
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._transferService.getReport(this.searchViewModel, this.page.orderBy, this.page.isAscending).subscribe(response => {
      this.page.isSearching = false;
      this.fireEventToParent();
      this._sharedService.downloadFile(response, "Transfer Report")
    });
  }
}