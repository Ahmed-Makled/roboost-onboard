import { Component, OnInit } from '@angular/core';
import { AvailabilityRequestViewModel } from '../view-models/availability-request.model';
import { AvailabilityRequestSearchViewModel } from '../view-models/availability-request-search.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AvailabilityRequestService } from '../availability-request.service';
import * as moment from 'moment';
import { SharedService } from 'src/app/service/shared.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { ListService } from 'src/app/service/list.service';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: []
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/agent/shift/availability'
  modalRef: BsModalRef;
  items: AvailabilityRequestViewModel[] = [];
  selectedItem: AvailabilityRequestViewModel = new AvailabilityRequestViewModel();
  searchViewModel: AvailabilityRequestSearchViewModel = new AvailabilityRequestSearchViewModel();
  statusList: SelectItem[] = [];
  deliverymanList: SelectItem[] = [];
  branchList: SelectItem[] = [];
  constructor(
    private _pageService: AvailabilityRequestService,
    public _sharedService: SharedService,
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
      { Name: "ID", Title: "shared.id", Selectable: true, Sortable: true },
      { Name: "BranchID", Title: "system.store", Selectable: true, Sortable: false },
      { Name: "DeliverymanID ", Title: "system.deliveryman", Selectable: true, Sortable: false },
      { Name: "Status", Title: "shared.status", Selectable: true, Sortable: true },
      { Name: "SentTime", Title: "deliveryman.availability-request.send-date", Selectable: true, Sortable: true },
      { Name: "DeliveredTime", Title: "deliveryman.availability-request.delivered-date", Selectable: true, Sortable: true },
    ];
    this.createSearchForm();
    forkJoin([
      this._listService.getAvailabilityRequestStatusList(),
      this._listService.getDeliverymanList(),
      this._listService.getBranchList()
    ]).subscribe(res => {
      this.statusList = res[0].Data;
      this.deliverymanList = res[1].Data;
      this.branchList = res[2].Data
    });
    this._activatedRoute.queryParams.subscribe(params => {
      this.subscribeFilteration(params)
    });
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._pageService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as AvailabilityRequestViewModel[];
      }
      this.fireEventToParent()
    });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      ID: [this.searchViewModel.ID],
      DeliverymanID: [this.searchViewModel.DeliverymanID],
      BranchID: [this.searchViewModel.BranchID],
      Status: [this.searchViewModel.Status],
      FromDate: [this.searchViewModel.FromDate],
      ToDate: [this.searchViewModel.ToDate]
    });
    this.page.isPageLoaded = true;
  }
}
