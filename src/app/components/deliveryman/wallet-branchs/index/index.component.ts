import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { ActivatedRoute, Router } from '@angular/router';
import { BranchsWalletViewModel } from '../view-models/wallet-branchs.model';
import { BranchsWalletSearchViewModel } from '../view-models/wallet-branchs-search.model';
import { BranchsWalletService } from '../wallet-branchs.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  // styleUrls: ['./index.component.css']
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/accounting/wallet/store'
  items: BranchsWalletViewModel[] = [];
  typeList: SelectItem[] = [];
  trips: SelectItem[] = [];
  branchList: SelectItem[] = [];
  selectedItem: BranchsWalletViewModel = new BranchsWalletViewModel();
  modalRef: BsModalRef;
  searchViewModel: BranchsWalletSearchViewModel =
    new BranchsWalletSearchViewModel();
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _listService: ListService,
    private _walletService: BranchsWalletService,
    private router: Router
  ) {
    super(_sharedService);
  }
  ngOnDestroy(): void {
    this.canSendToParent = false
  }
  ngOnInit() {
    this.initializePage();
    this.page.columns = [
      { Name: 'BranchName', Title: 'system.store', Selectable: true, Sortable: true },
      { Name: 'TotalAmount', Title: 'deliveryman.total-amount', Selectable: true, Sortable: true },
      { Name: 'TotalPaidAmount', Title: 'deliveryman.paid-amount', Selectable: true, Sortable: true },
      { Name: 'TotalUnPaidAmount', Title: 'deliveryman.unpaid-amount', Selectable: true, Sortable: true },
    ];
  }
  initializePage() {
    this.page.isPageLoaded = false;
    this.subscribeToParentEvent()
    this.page.orderBy = 'BranchID';
    this.createSearchForm();
    this._listService.getBranchList().subscribe((res) => { this.branchList = res.Data; });
    this.activatedRoute.queryParams.subscribe((params) => {
      this.subscribeFilteration(params)
    });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = this._sharedService.dateService.getCurrentDateMinusNumberOfDays(1);
    this.page.searchForm = this._sharedService.formBuilder.group({
      ToDate: [this.searchViewModel.ToDate],
      FromDate: [this.searchViewModel.FromDate],
      BranchID: [this.searchViewModel.BranchID],
    });
    this.page.isPageLoaded = true;
  }
  search() {
    this.page.isSearching = true;
    this.page.orderBy = 'BranchID';
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._walletService.get(this.searchViewModel, this.page.options.currentPage, this.page.options.itemsPerPage, this.page.orderBy, this.page.isAscending).subscribe((response) => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data as BranchsWalletViewModel[];
      }
      this.fireEventToParent();
    }, () => { this.page.isSearching = false });
  }
  getReport() {
    this.page.isSearching = true;
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._walletService.getMonthlyWalletTransactionsReport(this.searchViewModel, 'BranchName', this.page.isAscending)
      .subscribe((response) => {
        this.page.isSearching = false;
        this.fireEventToParent()
        this._sharedService.downloadFile(response, 'Wallet Transaction Report ');
      });
  }
  navigateToDetails(item: BranchsWalletViewModel) {
    let toDate = moment(item.ToDate).format('YYYY-MM-DD');
    let fromDate = moment(item.FromDate).format('YYYY-MM-DD');
    if (toDate != null && fromDate != null) {
      this.router.navigate(['/accounting/wallet/agent'], { queryParams: { BranchID: item.BranchID, FromDate: fromDate, ToDate: toDate, }, });
    }
  }
}
