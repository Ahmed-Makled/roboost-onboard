import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { ScheduledOrderSearchViewModel } from '../view-models/shceduled-order-search.model';
import { ScheduledOrderViewModel } from '../view-models/shceduled-order.model';
import { ScheduledOrderService } from '../scheduled-order.service';
import { ActivatedRoute } from '@angular/router';
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
  pageRoute = '/task/scheduled'
  items: ScheduledOrderViewModel[] = [];
  branchList: SelectItem[] = [];
  selectedItem: ScheduledOrderViewModel = new ScheduledOrderViewModel();
  modalRef: BsModalRef;
  searchViewModel: ScheduledOrderSearchViewModel = new ScheduledOrderSearchViewModel();
  @ViewChild('unScheduledTemplate', { static: false }) unScheduledTemplate: any;
  constructor(
    public _sharedService: SharedService,
    private _listService: ListService,
    private _pageService: ScheduledOrderService,
    private _activatedRoute: ActivatedRoute
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
    this.page.isPageLoaded = false;
    this.page.columns = [
      { Name: "OrderNumber", Title: "order.order-number", Selectable: true, Sortable: true },
      { Name: "BranchID", Title: "system.store-name", Selectable: false, Sortable: false },
      { Name: "CreatedDate", Title: "shared.date", Selectable: false, Sortable: false },
      { Name: "ScheduledTime", Title: "order.scheduled.scheduled-time", Selectable: false, Sortable: false },
    ];
    this._listService.getBranchList().subscribe(res => { this.branchList = res.Data; });
    this.createSearchForm();
    this._activatedRoute.queryParams.subscribe(params => { this.subscribeFilteration(params) });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      OrderNumber: [this.searchViewModel.OrderNumber],
      BranchID: [this.searchViewModel.BranchID],
      FromDate: [this.searchViewModel.FromDate],
      ToDate: [this.searchViewModel.ToDate]
    });
    this.page.isPageLoaded = true;
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
        this.items = response.Data.Items as ScheduledOrderViewModel[];
        this.items.forEach(x => x.IsSelected = false);
      }
      this.fireEventToParent()
    }, () => { this.page.isSearching = false });
  }
  showunScheduleTemplate(selectedItem: ScheduledOrderViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.unScheduledTemplate, { class: 'modal-sm', });
  }
  // TODO: check params
  unschedule() {
    this._pageService.unschedule(this.selectedItem.ID).subscribe(res => {
      this._sharedService.showToastr(res);
      if (res.Success) {
        this.items.splice(this.items.findIndex(i => i.ID == this.selectedItem.ID), 1)
        this.modalRef.hide();
      }
    })
  }
}
