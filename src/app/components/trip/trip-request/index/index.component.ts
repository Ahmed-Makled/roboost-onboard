import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TripIngoredExpiredRequestService } from '../trip-ignored-request.service';
import { TripRequestViewModel } from '../view-models/trip-request.model';
import { TripRequestSearchViewModel } from '../view-models/trip-request-search.model';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/trip/request'
  items: TripRequestViewModel[] = [];
  statusList: SelectItem[] = [];
  deliverymanList: SelectItem[] = [];
  branchList: SelectItem[] = [];
  selectedItem: TripRequestViewModel = new TripRequestViewModel();
  modalRef: BsModalRef;
  searchViewModel: TripRequestSearchViewModel = new TripRequestSearchViewModel();
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  constructor(
    public _sharedService: SharedService,
    private _listService: ListService,
    private _activatedRoute: ActivatedRoute,
    private _TripIngoredExpiredRequestService: TripIngoredExpiredRequestService,
  ) {
    super(_sharedService);
  }
  ngOnInit() {
    this.initializePage();
  }
  initializePage() {
    this.page.columns = [
      { Name: "ID", Title: "shared.id", Selectable: true, Sortable: true },
      { Name: "BranchName", Title: "system.store", Selectable: true, Sortable: false },
      { Name: "TripNumber", Title: "order.trip-number", Selectable: true, Sortable: false },
      { Name: "DeliverymanID", Title: "system.deliveryman", Selectable: true, Sortable: true },
      { Name: "Status", Title: "shared.status", Selectable: true, Sortable: true },
      { Name: "CreatedDate", Title: "system.created-date", Selectable: true, Sortable: true },
      { Name: "SentTime", Title: "deliveryman.trip-request.sent-time", Selectable: true, Sortable: true },
      { Name: "DeliveredTime", Title: "deliveryman.trip-request.deliverd-time", Selectable: true, Sortable: true },
      { Name: "ReadTime", Title: "deliveryman.trip-request.read-time", Selectable: true, Sortable: true },
    ];
    this.createSearchForm();
    forkJoin([
      this._TripIngoredExpiredRequestService.getStatusList(),
      this._listService.getDeliverymanList(),
      this._listService.getBranchList()
    ]).subscribe(res => {
      this.statusList = res[0].Data;
      this.deliverymanList = res[1].Data;
      this.branchList = res[2].Data;
    });
    this._activatedRoute.queryParams.subscribe(params => this.subscribeFilteration(params));
  }
  getDeliverymanList() {
    this.page.searchForm.controls['DeliverymanID']?.reset()
    this._listService.getDeliverymanList().subscribe(res => {
      if (res.Success) { this.deliverymanList = res.Data }
    })
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this._TripIngoredExpiredRequestService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as TripRequestViewModel[];
      }
      this.fireEventToParent()
    });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      ID: [this.searchViewModel.ID],
      TripNumber: [this.searchViewModel.TripNumber],
      DeliverymanID: [this.searchViewModel.DeliverymanID],
      Status: [this.searchViewModel.Status],
      FromDate: [this.searchViewModel.FromDate, ],
      ToDate: [this.searchViewModel.ToDate, ],
      branchID: [this.searchViewModel.branchID]
    });
    this.page.isPageLoaded = true;
  }
}
