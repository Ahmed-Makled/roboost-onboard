import { Component, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone';
import { CustomerSearchViewModel } from '../view-models/customer-search.model';
import { CustomerViewModel } from '../view-models/customer.model';
import { ActivatedRoute } from '@angular/router';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { CustomerHomeService } from '../customer-home.service';
import { ListService } from 'src/app/service/list.service';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit, OnDestroy {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/customer/home'
  items: CustomerViewModel[] = [];
  selectedItem: CustomerViewModel = new CustomerViewModel();
  modalRef: BsModalRef;
  searchViewModel: CustomerSearchViewModel = new CustomerSearchViewModel();
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  advancedSearch: boolean = false;
  storeList: SelectItem[] = [];
  constructor(
    public _sharedService: SharedService,
    private _customerService: CustomerHomeService,
    private _listService: ListService,
    private activatedRoute: ActivatedRoute,
  ) {
    super(_sharedService);
  }
  ngOnDestroy(): void {
    this.canSendToParent = false
  }
  ngOnInit() {
    this.initializePage()
  }
  initializePage() {
    this.page.columns = [
      { Name: "Name", Title: "shared.name", Selectable: true, Sortable: true },
      { Name: "CallCenter", Title: "system.call-center", Selectable: false, Sortable: false, IsHidden: !this.hasPage(this.pageEnum.Customers_Call_Center) },
      { Name: "BranchName", Title: "system.store-name", Selectable: false, Sortable: false },
      { Name: "Mobile", Title: "shared.mobile", Selectable: true, Sortable: true },
      { Name: "Number", Title: "shared.serial-number", Selectable: false, Sortable: false },
      { Name: "CreatedDate", Title: "system.create-date", Selectable: true, Sortable: true },
      { Name: "OrdersCount", Title: "system.orders-count", Selectable: true, Sortable: true },
      { Name: "ShippingAddresses", Title: "customer.shipping-address", Selectable: true, Sortable: true },
      { Name: "IsTopPriority", Title: "item.is-top-priority", Selectable: true, Sortable: false, IsHidden: !this.hasFeature(this.featureEnum.Customer_UpdatePriority) },
      { Name: "IsTransite", Title: "item.is-transite", Selectable: true, Sortable: false, IsHidden: !this.hasFeature(this.featureEnum.Customer_IsTransite) },
    ];
    this.createSearchForm();
    this._listService.getBranchList().subscribe(res => this.storeList = res.Data);
    this.activatedRoute.queryParams.subscribe(params => {
      this.subscribeFilteration(params)
    });
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._customerService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as CustomerViewModel[];
      }
      this.fireEventToParent()
    });
    this.page.isSearching = false;
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      Number: [this.searchViewModel.Number],
      Mobile: [this.searchViewModel.Mobile],
      Name: [this.searchViewModel.Name],
      BranchID: [this.searchViewModel.BranchID],
      FromDate: [this.searchViewModel.FromDate],
      ToDate: [this.searchViewModel.ToDate]
    });
    this.page.isPageLoaded = true;
  }
  changeIsTopPriority(item: CustomerViewModel) {
    this._customerService.changeIsTopPriority({ ID: item.ID, IsTopPriority: !item.IsTopPriority }).subscribe(res => {
      this._sharedService.showToastr(res)
      if (res.Success) item.IsTopPriority = !item.IsTopPriority
    })
  }
  changeIsIsTransite(item: CustomerViewModel) {
    this._customerService.changeTransite({ ID: item.ID, IsTransite: !item.IsTransite }).subscribe(res => {
      this._sharedService.showToastr(res)
      if (res.Success) item.IsTransite = !item.IsTransite
    })
  }
  showDeleteConfirmation(selectedItem: CustomerViewModel) {
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
