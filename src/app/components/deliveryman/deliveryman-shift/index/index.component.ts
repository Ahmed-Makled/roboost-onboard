import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DeliverymanShiftViewModel } from '../view-models/deliveryman-shift.model';
import { DeliverymanShiftSearchViewModel } from '../view-models/deliveryman-shift-search.model';
import { DeliverymanShiftService } from '../deliveryman-shift.service';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class DeliveryShiftComponent extends CrudIndexBaseUtils implements OnInit, OnDestroy {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/agent/shift/working-hours'
  items: DeliverymanShiftViewModel[] = [];
  deliverymanList: SelectItem[] = [];
  branchList: SelectItem[] = [];
  selectedItem: DeliverymanShiftViewModel = new DeliverymanShiftViewModel();
  modalRef: BsModalRef;
  searchViewModel: DeliverymanShiftSearchViewModel = new DeliverymanShiftSearchViewModel();
  constructor(
    private activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _listService: ListService,
    private _deliverymanShiftService: DeliverymanShiftService,
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
      { Name: "BranchName", Title: "system.store", Selectable: false, Sortable: true },
      { Name: "DeliverymanID", Title: "system.deliveryman-name", Selectable: true, Sortable: true },
      { Name: "StartDate", Title: "deliveryman.start-date", Selectable: true, Sortable: false },
      { Name: "CloseDate", Title: "deliveryman.close-date", Selectable: true, Sortable: false },
      { Name: "Duration", Title: "system.duration", Selectable: false, Sortable: false },
      { Name: "HourPrice", Title: "deliveryman.dm-shift.hour-price", Selectable: false, Sortable: true },
      { Name: "Duration", Title: "deliveryman.total-amount", Selectable: false, Sortable: false },
    ];
    this.subscribeToParentEvent()
    this.createSearchForm();
    forkJoin([
      this._listService.getDeliverymanList(),
      this._listService.getBranchList()
    ]).subscribe(res => {
      this.deliverymanList = res[0].Data
      this.branchList = res[1].Data
    });
    this.activatedRoute.queryParams.subscribe(params => { this.subscribeFilteration(params) });
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this._deliverymanShiftService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as DeliverymanShiftViewModel[];
        this.items.forEach(x => x.IsSelected = false);
      }
      this.fireEventToParent()
    }, () => { this.page.isSearching = false });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      DeliverymanID: [this.searchViewModel.DeliverymanID],
      BranchID: [this.searchViewModel.BranchID],
      ToDate: [this.searchViewModel.ToDate],
      FromDate: [this.searchViewModel.FromDate],
    });
    this.page.isPageLoaded = true;
  }
  getDeliverymanList(id) {
    this.page.searchForm.controls['DeliverymanID']?.reset()
    this._listService.getDeliverymanList(id ?? 0).subscribe(res => {
      if (res.Success) this.deliverymanList = res.Data
    })
  }
  getReport() {
    this.page.isSearching = true;
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._deliverymanShiftService.getReport(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      this.fireEventToParent()
      this._sharedService.downloadFile(response, "Deliverymen Shift Report ")
    }, () => this.page.isSearching = false);
  }
}
