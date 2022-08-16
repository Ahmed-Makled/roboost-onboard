import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { AlertService } from 'src/app/service/alert.service';
import { ListService } from 'src/app/service/list.service';
import { SharedService } from 'src/app/service/shared.service';
import { CustomerReviewService } from '../customer-review.service';
import { CustomerReviewSearchViewModel } from '../view-models/customer-review-search.model';
import { CustomerReviewViewModel } from '../view-models/customer-review.model';
@Component({
  selector: 'app-customer-review',
  templateUrl: './customer-review.component.html',
})
export class CustomerReviewComponent extends CrudIndexBaseUtils implements OnInit, OnDestroy {
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  modalRef: BsModalRef;
  rowSize: number = 10;
  showNotification: boolean = false;
  popupOption = { type: false, text: 'this process was successful' }
  page: CRUDIndexPage = new CRUDIndexPage();
  orderBy = "Date";
  pageRoute = '/customer/review'
  items: CustomerReviewViewModel[] = [];
  searchViewModel: CustomerReviewSearchViewModel = new CustomerReviewSearchViewModel();
  selectedItem: CustomerReviewViewModel = new CustomerReviewViewModel();
  branchList: SelectItem[] = [];
  deliverymanList: SelectItem[] = [];
  advancedSearch: boolean
  ratingList: SelectItem[] = [
    { ID: 1, Name: "1", Selected: false, Url: "" },
    { ID: 2, Name: "2", Selected: false, Url: "" },
    { ID: 3, Name: "3", Selected: false, Url: "" },
    { ID: 4, Name: "4", Selected: false, Url: "" },
    { ID: 5, Name: "5", Selected: false, Url: "" }]
  feedbackList: SelectItem[] = [{ ID: 1, Name: "Select All", Selected: false, Url: "" }, { ID: 1, Name: "yes", Selected: true, Url: "" }, { ID: 1, Name: "No", Selected: false, Url: "" }]
  deliverymenList: SelectItem[] = []
  constructor(private alertService: AlertService,
    public _sharedService: SharedService,
    private _customerReviewService: CustomerReviewService,
    private _listService: ListService,
    private _activatedRoute: ActivatedRoute,
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
      { Name: "OrederNumber", Title: "order.order-number", Selectable: false, Sortable: false, },
      { Name: "BranchName", Title: "system.store", Selectable: false, Sortable: false, IsHidden: this.isSingleStore() },
      { Name: "CustomerName", Title: "customer.customer", Selectable: false, Sortable: false },
      { Name: "DeliverymanRating", Title: "customer.customer-review.dm-rating", Selectable: true, Sortable: true },
      { Name: "DeliverymanName", Title: "system.deliveryman", Selectable: false, Sortable: false },
      { Name: "ServiceRating", Title: "customer.customer-review.service-rating", Selectable: true, Sortable: true },
      { Name: "CreatedDate", Title: "shared.date", Selectable: true, Sortable: true },
      { Name: "deliveryman", Title: "customer.customer-review.feedback", Selectable: false, Sortable: true },
    ];
    this.createSearchForm();
    forkJoin([
      this._listService.getBranchList(),
      this._listService.getDeliverymanList(),
    ]).subscribe(res => {
      this.branchList = res[0].Data
      this.deliverymenList = res[1].Data
    });
    this._activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm, {
        isAscending: this.page.isAscending, orderBy: this.page.orderBy,
        pageSize: this.page.options.itemsPerPage, currentPage: this.page.options.currentPage
      }, false)
      this.search();
    });
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._customerReviewService.getCustomerReview(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as CustomerReviewViewModel[];
        this.items.forEach(x => x.IsSelected = false);
      } this.fireEventToParent()
    }, () => { this.page.isSearching = false });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      branchID: [this.searchViewModel.branchID],
      deliverymanID: [this.searchViewModel.deliverymanID],
      deliverymanRating: [this.searchViewModel.deliverymanRating],
      hasFeedback: [this.searchViewModel.hasFeedback],
      orderNumber: [this.searchViewModel.orderNumber],
      serviceRating: [this.searchViewModel.serviceRating],
      FromDate: [this.searchViewModel.FromDate],
      ToDate: [this.searchViewModel.ToDate]
    });
    this.page.isPageLoaded = true;
  }
  getDeliverymanList(id) {
    this.page.searchForm.controls['deliverymanID']?.reset()
    this._listService.getDeliverymanList(id ?? 0).subscribe(res => {
      if (res.Success) this.deliverymenList = res.Data
    })
  }
  showDeleteConfirmation(selectedItem: CustomerReviewViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.deleteTemplate, { class: 'modal-sm' });
  }
  showDeleteAllConfirmation() {
    this.selectedItem = null;
    this.modalRef = this._sharedService.modalService.show(this.deleteTemplate, { class: 'modal-sm' });
  }
  selectAll() {
    this.page.isAllSelected = !this.page.isAllSelected;
    this.items.forEach(item => { item.IsSelected = this.page.isAllSelected });
  }
}
