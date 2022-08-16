import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderViewModel } from '../view-models/order.model';
import { OrderSearchViewModel } from '../view-models/order-search.model';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { OrderStatus } from 'src/app/enum/order-status.enum';
import { ListService } from 'src/app/service/list.service';
import { OrderUncomplateService } from '../uncomplate.service';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
import { StatusUtilsService } from 'src/app/service/status.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  // styleUrls: ['./index.component.css']
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/task/uncompleted'
  modalRef: BsModalRef;
  items: OrderViewModel[] = [];
  selectedItem: OrderViewModel = new OrderViewModel();
  searchViewModel: OrderSearchViewModel = new OrderSearchViewModel();
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  tripRateList: SelectItem[] = [];
  statusList: SelectItem[] = [];
  performanceList: SelectItem[] = [];
  serviceList: SelectItem[] = [];
  deliverymanList: SelectItem[] = [];
  trips: SelectItem[] = [];
  branchList: SelectItem[] = [];
  canCreateRandomOrder: boolean = false;
  advancedSearch: boolean = false;
  isArchive: boolean = false
  constructor(
    private _pageService: OrderUncomplateService,
    private _activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _listService: ListService,
    private _statusUtilsService : StatusUtilsService
  ) {
    super(_sharedService);
  }
  ngOnDestroy(): void {
    this.canSendToParent = false
  }
  ngOnInit() {
    this.page.columns = [
      { Name: "OrderNumber", Title: "order.order-number", Selectable: true, Sortable: true },
      { Name: "DeliverymanName", Title: "system.deliveryman", Selectable: true, Sortable: false },
      { Name: "BranchName", Title: "system.store", Selectable: true, Sortable: true },
      { Name: "TripID", Title: "order.trip-number", Selectable: true, Sortable: true },
      { Name: "Rate", Title: "system.performance", Selectable: true, Sortable: true },
      { Name: "DeliveryTime", Title: "order.total-delivery-time", Selectable: true, Sortable: false },
      { Name: "CustomerName", Title: "system.customer-name", Selectable: true, Sortable: true },
      { Name: "CreatedDate", Title: "system.created-date", Selectable: true, Sortable: true },
      { Name: "CustomerMobile", Title: "system.customer-mobile", Selectable: true, Sortable: true },
      { Name: "Address", Title: "shared.address", Selectable: true, Sortable: true },
      { Name: "Distance", Title: "system.distance", Selectable: true, Sortable: true },
      { Name: "Status", Title: "shared.status", Selectable: true, Sortable: true },
      { Name: "DeliveryTime", Title: "order.delivery-time", Selectable: true, Sortable: true },
    ];
    this.subscribeToParentEvent();
    this.initializePage();
  }
  initializePage() {
    this.page.isPageLoaded = false;
    forkJoin([
      this._listService.getOrderStatusList(),
      this._listService.getOrderPerformanceList(),
      this._listService.getBranchList(),
      this._listService.getDeliverymanList(),
      this._listService.getServiceList(),
      this._listService.getTripRateList()
    ]).subscribe(res => {
      this.statusList = res[0].Data;
      this.performanceList = res[1].Data;
      this.branchList = res[2].Data;
      this.deliverymanList = res[3].Data;
      this.serviceList = res[4].Data;
      this.tripRateList = res[5].Data
    });
    this.createSearchForm();
    this._activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      if (params.deliverymanID) this.searchViewModel.DeliverymanID = params.deliverymanID;
      if (params.branchID) this.searchViewModel.branchID = params.branchID;
      if (params.number) this.searchViewModel.CustomerNumber = params.number;
      if (params.tripNumber) this.searchViewModel.TripNumber = params.tripNumber;
      if (params.orderNumber) this.searchViewModel.OrderNumber = params.orderNumber;
      this.search();
    });
    this._sharedService.parentChildEvent.subscribe((res: any) => {
      if (res.isReuest) this.getReport()
    });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      ID: [this.searchViewModel.ID],
      TripNumber: [this.searchViewModel.TripNumber],
      OrderNumber: [this.searchViewModel.OrderNumber],
      CustomerName: [this.searchViewModel.CustomerName],
      CustomerMobile: [this.searchViewModel.CustomerMobile],
      CustomerNumber: [this.searchViewModel.CustomerNumber],
      Status: [this.searchViewModel.Status],
      Performance: [this.searchViewModel.Performance],
      FromDate: [this.searchViewModel.FromDate],
      ToDate: [this.searchViewModel.ToDate],
      branchID: [this.searchViewModel.branchID],
      DeliverymanID: [this.searchViewModel.DeliverymanID],
      IsFastOrder: [this.searchViewModel.IsFastOrder],
      EnrollID: [this.searchViewModel.EnrollID],
      ServiceID: [this.searchViewModel.ServiceID],
      TripRate: [this.searchViewModel.TripRate],
      IsTransite: [this.searchViewModel.IsTransite],
    });
    this.page.isPageLoaded = true;
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this._pageService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as OrderViewModel[];
        this.getColors();
      }
      this.page.isSearching = false;
      this.fireEventToParent()
    });
  }
  getReport() {
    this.page.isSearching = true;
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this._pageService.getReport(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      this.fireEventToParent()
      this._sharedService.downloadFile(response, "Orders  Report")
      if (!response) this.page.isSearching = false
    });
  }
  getDeliverymanList(id) {
    this.page.searchForm.controls['DeliverymanID']?.reset()
    this._listService.getDeliverymanList(id ?? 0).subscribe(res => {
      if (res.Success) { this.deliverymanList = res.Data }
    })
  }
  getColors() {
    this.items.forEach(element => {
      element.StatusColor = this._statusUtilsService.getTaskRateColors(element.Rate)
    });
  }
  IsOrderDeleverd(Orderstatus: OrderStatus) {
    return Orderstatus == OrderStatus.DELIVERED;
  }
  IsOrderOnTrip(Orderstatus: OrderStatus) {
    return Orderstatus == OrderStatus.ADDED_TO_TRIP;
  }
}
