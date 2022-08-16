import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { ListService } from 'src/app/service/list.service';
import { SharedService } from 'src/app/service/shared.service';
import { ShippingService } from '../shipping.service';
import { ShippingAddressSearchViewModel } from '../view-models/shipping-search.model';
import { ShippingAddressViewModel } from '../view-models/shipping.model';
@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
})
export class ShippingAddressComponent extends CrudIndexBaseUtils implements OnInit, OnDestroy {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/customer/shipping-address'
  items: ShippingAddressViewModel[] = [];
  statusList: SelectItem[] = [];
  deliverymanList: SelectItem[] = [];
  branchList: SelectItem[] = []
  selectedItem: ShippingAddressViewModel = new ShippingAddressViewModel();
  modalRef: BsModalRef;
  searchViewModel: ShippingAddressSearchViewModel = new ShippingAddressSearchViewModel();
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _cshippingService: ShippingService,
    public _sharedService: SharedService,
    private _listService: ListService
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
      { Name: "ID", Title: "shared.id", Selectable: true, Sortable: true },
      { Name: "BranchName", Title: "system.store", Selectable: false, Sortable: false, IsHidden: this.isSingleStore() },
      { Name: "CustomerName", Title: "system.customer-name", Selectable: true, Sortable: false },
      { Name: "CustomerNumber", Title: "system.customer-num", Selectable: true, Sortable: false },
      { Name: "CustomerMobile", Title: "system.customer-mobile", Selectable: true, Sortable: false },
      { Name: "Address", Title: "shared.address", Selectable: true, Sortable: false },
      { Name: "Longitude", Title: "system.longitude", Selectable: true, Sortable: true },
      { Name: "Latitude", Title: "system.latitude", Selectable: true, Sortable: true },
      { Name: "HasGoogleLocation", Title: "order.has-google-location", Selectable: true, Sortable: false },
      { Name: "Distance", Title: "system.distance", Selectable: true, Sortable: false },
      { Name: "OrdersCount", Title: "system.orders-count", Selectable: true, Sortable: false },
      { Name: "IsActive", Title: "order.is-active", Selectable: true, Sortable: true },
    ];
    this.createSearchForm();
    this._listService.getBranchList().subscribe(res => {
      this.branchList = res.Data;
    });
    this._activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      if (params.number) this.searchViewModel.CustomerNumber = params.number;
      this.search();
    });
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this._cshippingService.getShippingAdress(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as ShippingAddressViewModel[];
      } this.fireEventToParent()
    }, () => { this.page.isSearching = false });
  }
  createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      ID: [this.searchViewModel.ID],
      CustomerNumber: [this.searchViewModel.CustomerNumber],
      mobile: [this.searchViewModel.mobile],
      address: [this.searchViewModel.address],
      BranchID: [this.searchViewModel.BranchID],
    });
    this.page.isPageLoaded = true
  }
}
