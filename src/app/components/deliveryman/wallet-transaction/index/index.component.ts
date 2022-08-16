import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletViewModel } from '../view-models/wallet.model';
import { WalletSearchViewModel } from '../view-models/wallet-search.model';
import { WalletService } from '../wallet.service';
import { WalletCreateViewModel } from '../view-models/wallet-create.model';
import { Validators } from '@angular/forms';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { ListService } from 'src/app/service/list.service';
import { OrderStatus } from 'src/app/enum/order-status.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  // styleUrls: ['./index.component.css']
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit, OnDestroy {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageCreate: CRUDCreatePage = new CRUDCreatePage();
  pageRoute = '/accounting/wallet/agent'

  //currentPage:PageEnum=PageEnum.Governrate;
  items: WalletViewModel[] = [];
  typeList: SelectItem[] = [];
  deliverymanList: SelectItem[] = [];
  trips: SelectItem[] = [];
  branchList: SelectItem[] = [];
  awardsList: SelectItem[] = [
    { 'Selected': true, 'Name': 'Bonous' },
    { 'Selected': false, 'Name': 'Deduction' }
  ]
  selectedItem: WalletViewModel = new WalletViewModel();
  walletcreateViewModel: WalletCreateViewModel = new WalletCreateViewModel();
  modalRef: BsModalRef;
  searchViewModel: WalletSearchViewModel = new WalletSearchViewModel();
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  @ViewChild('addToWalletTemplate', { static: false }) addToWalletTemplate: any;
  constructor(
    private _activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _walletService: WalletService,
    private _listService: ListService,
    private router: Router
  ) {
    super(_sharedService
    );
  }
  ngOnDestroy(): void {
    this.canSendToParent = false
  }
  ngOnInit() {
    this.initializePage();
  }
  IsOrderDeleverd(Orderstatus: OrderStatus) {
    return Orderstatus == OrderStatus.DELIVERED;
  }
  IsOrderOnTrip(Orderstatus: OrderStatus) {
    return Orderstatus == OrderStatus.ADDED_TO_TRIP;
  }
  initializePage() {
    this.page.isPageLoaded = false;
    this.page.columns = [
      {
        Name: 'BranchName',
        Title: 'system.store',
        Selectable: true,
        Sortable: true,
      },
      {
        Name: 'DeliverymanID',
        Title: 'system.deliveryman',
        Selectable: true,
        Sortable: true,
      },
      {
        Name: 'EnrollID',
        Title: 'system.enrollid',
        Selectable: true,
        Sortable: true,
      },
      {
        Name: 'TotalAmount',
        Title: 'deliveryman.total-amount',
        Selectable: true,
        Sortable: true,
      },
      {
        Name: 'TotalPaidAmount',
        Title: 'deliveryman.paid-amount',
        Selectable: true,
        Sortable: true,
      },
      {
        Name: 'TotalUnPaidAmount',
        Title: 'deliveryman.unpaid-amount',
        Selectable: true,
        Sortable: true,
      },
    ];
    this.subscribeToParentEvent()
    this.createSearchForm();
    forkJoin([
      this._listService.getDeliverymanList(),
      this._listService.getBranchList(),
    ]).subscribe((res) => {
      this.deliverymanList = res[0].Data;
      this.branchList = res[1].Data;
      this.page.isPageLoaded = true;
    });
    this._activatedRoute.queryParams.subscribe(params => {
        this.subscribeFilteration(params)
    });
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    if (this.page.orderBy == 'ID') this.page.orderBy = 'BranchName';
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this._walletService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.items = response.Data as WalletViewModel[];
        this.page.options.totalItems = this.items.length
        this.fireEventToParent()
      }
      this.fireEventToParent()
    }, () => { this.page.isSearching = false });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth()
    this.searchViewModel.ToDate = new Date()
    this.page.searchForm = this._sharedService.formBuilder.group({
      DeliverymanID: [this.searchViewModel.DeliverymanID],
      ToDate: [this.searchViewModel.ToDate],
      FromDate: [this.searchViewModel.FromDate],
      BranchID: [this.searchViewModel.BranchID],
    });
  }


  showDeleteConfirmation(selectedItem: WalletViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.deleteTemplate, {
      class: 'modal-sm',
    });
  }
  showDeleteAllConfirmation() {
    this.selectedItem = null;
    this.modalRef = this._sharedService.modalService.show(this.deleteTemplate, {
      class: 'modal-sm',
    });
  }
  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
  getDeliverymanList(id) {
    this.page.searchForm.controls['DeliverymanID']?.reset()
    this._listService.getDeliverymanList(id).subscribe((res) => {
      if (res.Success) {
        this.deliverymanList = res.Data;
      }
    });
  }
  navigateToValidate() {
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    let toDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    let fromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    if (toDate != 'Invalid date' && fromDate != 'Invalid date') {
      if (new Date(fromDate).getTime() <= new Date(toDate).getTime()) {
        this._sharedService.saveFilteration({
          pageRoute: '/accounting/wallet/validation',
          searchForm: this.page.searchForm,
          isAscending: this.page.isAscending,
          orderBy: this.page.orderBy,
        });
      } else {
        this._sharedService.showErrorAlert('From Date Must Be less Than To Date');
      }
    }
  }
  navigateToDetails(item: WalletViewModel) {
    let toDate = moment(item.ToDate).format('YYYY-MM-DD');
    let fromDate = moment(item.FromDate).format('YYYY-MM-DD');
    if (toDate != 'Invalid date' && fromDate != 'Invalid date') {
      this.router.navigate([`/accounting/wallet/agent/${item.DeliverymanID}`], {
        queryParams: { FromDate: fromDate, ToDate: toDate },
      });
    } else
      this.router.navigate([`/accounting/wallet/agent/${item.DeliverymanID}`],);
  }
  isDateSet(): boolean {
    var fromDate = this.page.searchForm.get('FromDate').value;
    var toDate = this.page.searchForm.get('ToDate').value;
    if (fromDate != '' && fromDate != null && toDate != '' && toDate != null)
      return true;
  }
  showAddToWalletTemplate(selectedItem: WalletViewModel) {
    this.selectedItem = selectedItem;
    this.createCreateForm();
    this.modalRef = this._sharedService.modalService.show(this.addToWalletTemplate, { class: 'modal-sm' });
  }
  post() {
    this.pageCreate.isSaving = true;
    Object.assign(this.walletcreateViewModel, this.pageCreate.form.value);
    this._walletService
      .postOrUpdate(this.walletcreateViewModel)
      .subscribe((res) => {
        this._sharedService.showToastr(res);
        this.pageCreate.isSaving = false;
        this.walletcreateViewModel = new WalletCreateViewModel();
      });
  }
  createCreateForm() {
    this.pageCreate.form = this._sharedService.formBuilder.group({
      DeliverymanID: [this.selectedItem.DeliverymanID],
      IsAward: [this.walletcreateViewModel.IsAward, [Validators.required]],
      Note: [this.walletcreateViewModel.Note],
      Amount: [
        this.walletcreateViewModel.Amount,
        [Validators.required, Validators.min(0)],
      ],
    });
  }
  disabledSubmit() {
    return (this.pageCreate.isSaving || this.pageCreate.isUploading || !this.pageCreate.form.valid);
  }

  subscribeToParentEvent() {
    this._sharedService.parentChildEvent.subscribe((res: any) => {
      if (res.fromParent) this.navigateToValidate()
    });
  }

}
