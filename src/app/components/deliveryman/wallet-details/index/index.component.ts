import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
import { WalletTransactionViewModel } from '../view-models/wallet-details.model';
import { WalletTransactionSearchViewModel } from '../view-models/wallet-details-search.model';
import { WalletTransactionService } from '../wallet-details.service';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit, OnDestroy {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/accounting/wallet/transaction/'
  items: WalletTransactionViewModel[] = [];
  typeList: SelectItem[] = [];
  deliverymanList: SelectItem[] = [];
  trips: SelectItem[] = [];
  branchList: SelectItem[] = [];
  selectedItem: WalletTransactionViewModel = new WalletTransactionViewModel();
  modalRef: BsModalRef;
  searchViewModel: WalletTransactionSearchViewModel = new WalletTransactionSearchViewModel();
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  list: number[];
  constructor(
    private activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _walletTransactionService: WalletTransactionService,
    private _listService: ListService,
  ) {
    super(_sharedService);
  }
  ngOnDestroy(): void {
    this.canSendToParent = false
  }
  ngOnInit() {
    this.initializePage();
    this.page.columns = [
      { Name: "ID", Title: "order.order-number", Selectable: true, Sortable: true },
      { Name: "BranchName", Title: "system.store", Selectable: true, Sortable: false },
      { Name: "CreatedDate", Title: "system.created-date", Selectable: true, Sortable: true },
      { Name: "DeliverymanID", Title: "system.deliveryman", Selectable: true, Sortable: true },
      { Name: "TripNumber", Title: "system.trip", Selectable: true, Sortable: true },
      { Name: "Type", Title: "wallet.transaction.type", Selectable: true, Sortable: true },
      { Name: "IsAward", Title: "wallet.transaction.is-award", Selectable: true, Sortable: true },
      { Name: "Amount", Title: "wallet.transaction.amount", Selectable: true, Sortable: true },
      { Name: "Note", Title: "shared.note", Selectable: true, Sortable: false },
      { Name: "Balance", Title: "wallet.transaction.balance", Selectable: true, Sortable: false },
    ];
  }
  initializePage() {
    this.page.isPageLoaded = false;
    forkJoin([
      this._walletTransactionService.getStatusList(),
      this._listService.getDeliverymanList(),
      this._listService.getBranchList()
    ]).subscribe(res => {
      this.typeList = res[0].Data;
      this.deliverymanList = res[1].Data;
      this.branchList = res[2].Data;
    });
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      if (params.DeliverymanID)
        this.searchViewModel.DeliverymanID = +params.DeliverymanID;
      if (params.FromDate && params.ToDate) {
        this.searchViewModel.FromDate = params.FromDate;
        this.searchViewModel.ToDate = params.ToDate;
      }
      if (params.BranchID) {
        this.searchViewModel.BranchID = params.BranchID;
      }
      else {
        this.searchViewModel.FromDate = params.FromDate;
        this.searchViewModel.ToDate = params.ToDate;
      }
      this.search();
    });
  }
  getDeliverymanList(id) {
    this.page.searchForm.controls['DeliverymanID']?.reset()
    this._listService.getDeliverymanList(id ?? 0).subscribe(res => {
      if (res.Success)
        this.deliverymanList = res.Data;
    })
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this._walletTransactionService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as WalletTransactionViewModel[];
      }
      this.fireEventToParent();
      this.page.isSearching = false;
    });
  }
  createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      DeliverymanID: [this.searchViewModel.DeliverymanID],
      IsAward: [this.searchViewModel.IsAward],
      TripNumber: [this.searchViewModel.TripNumber],
      Type: [this.searchViewModel.Type],
      BranchID: [this.searchViewModel.BranchID],
      FromDate: [this.searchViewModel.FromDate ?? this._sharedService.dateService.getFirstDayCurrentMonth()],
      ToDate: [this.searchViewModel.ToDate],
    });
    this.page.isPageLoaded = true;
  }
  showDeleteConfirmation(item: WalletTransactionViewModel) {
    item.IsSelected = true;
    this.modalRef = this._sharedService.modalService.show(this.deleteTemplate, { class: 'modal-sm' });
  }
  showDeleteAllConfirmation() {
    this.selectedItem = null;
    this.modalRef = this._sharedService.modalService.show(this.deleteTemplate, { class: 'modal-sm' });
  }
  remove() {
    this.modalRef.hide();
    this.list = []
    this.items.forEach(i => {
      if (i.IsSelected)
        this.list.push(i.ID)
      this.items.filter(x => x == i)[0].IsDeleting = true;
    })
    this._walletTransactionService.delete(this.list).subscribe(response => {
      this._sharedService.showToastr(response)
      if (response.Success) {
        this.list.forEach(id => {
          let index = this.items.findIndex(x => x.ID == id);
          this.items.splice(index, 1);
        })
        let pageIndex: number = this.page.options.currentPage;
        if (this.items.length == 0) {
          pageIndex = pageIndex > 1 ? --pageIndex : 1;
        }
      }
    },
      error => {
        this.selectedItem.IsDeleting = false;
        this._sharedService.showErrorAlert("حدث خطأ اثناء عملية الحذف");
      },
      () => { }
    );
  }
}
