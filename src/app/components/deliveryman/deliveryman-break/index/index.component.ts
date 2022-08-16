import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { DeliverymanBreakViewModel } from '../view-models/deliveryman-break.model';
import { DeliverymanBreakSearchViewModel } from '../view-models/deliveryman-break-search.model';
import { DeliverymanBreakService } from '../deliveryman-break.service';
import { ListService } from 'src/app/service/list.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute } from '@angular/router';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  // styleUrls: ['./index.component.css']
})
export class DeliveryBreakComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/agent/shift/break'
  modalRef: BsModalRef;
  items: DeliverymanBreakViewModel[] = [];
  selectedItem: DeliverymanBreakViewModel = new DeliverymanBreakViewModel();
  searchViewModel: DeliverymanBreakSearchViewModel = new DeliverymanBreakSearchViewModel();
  deliverymanList: SelectItem[] = [];
  @ViewChild('archiveTemplate', { static: false }) deleteTemplate: any;
  @ViewChild('addToQueueTemplate', { static: false }) addToQueueTemplate: any;
  @ViewChild('forceLogOutTemplate', { static: false }) forceLogOutTemplate: any;
  constructor(
    public _sharedService: SharedService,
    private _pageService: DeliverymanBreakService,
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
      { Name: "DeliverymanID", Title: "system.deliveryman", Selectable: true, Sortable: true },
      { Name: "StartDate", Title: "deliveryman.start-date", Selectable: true, Sortable: true },
      { Name: "CloseDate", Title: "deliveryman.close-date", Selectable: true, Sortable: true },
      { Name: "Duration", Title: "system.duration", Selectable: true, Sortable: false },
    ];
    this.createSearchForm();
    this._listService.getDeliverymanList().subscribe(res => { this.deliverymanList = res.Data; });
    this._activatedRoute.queryParams.subscribe(params => { this.subscribeFilteration(params) });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      DeliverymanID: [this.searchViewModel.DeliverymanID],
      ID: [this.searchViewModel.ID],
      ToDate: [this.searchViewModel.ToDate],
      FromDate: [this.searchViewModel.FromDate],
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
        this.items = response.Data.Items as DeliverymanBreakViewModel[];
      }
      this.fireEventToParent()
    }, () => this.page.isSearching = false);
  }
}
