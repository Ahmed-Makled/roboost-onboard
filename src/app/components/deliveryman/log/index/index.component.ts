import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DeliverymanLogService } from '../deliveryman-log.service';
import { DeliverymanLogViewModel } from '../view-models/deliveryman-log.model';
import { DeliverymanLogSearchViewModel } from '../view-models/deliveryman-log-search.model';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  // styleUrls: ['./index.component.css']
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/agent/log'
  items: DeliverymanLogViewModel[] = [];
  actionList: SelectItem[] = [];
  deliverymanList: SelectItem[] = [];
  selectedItem: DeliverymanLogViewModel = new DeliverymanLogViewModel();
  modalRef: BsModalRef;
  searchViewModel: DeliverymanLogSearchViewModel = new DeliverymanLogSearchViewModel();
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  constructor(
    private _activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _deliverymanLogService: DeliverymanLogService,
    private _listService: ListService,
  ) {
    super(_sharedService);
  }
  ngOnInit() {
    this.initializePage();
    this.page.columns = [
      { Name: "ID", Title: "shared.id", Selectable: true, Sortable: true },
      { Name: "DeliverymanID", Title: "system.deliveryman", Selectable: true, Sortable: true },
      { Name: "Action", Title: 'deliveryman.dm-log.action', Selectable: true, Sortable: true },
      { Name: "ItemID", Title: "deliveryman.dm-log.item-id", Selectable: true, Sortable: true },
      { Name: "Latitude", Title: "system.latitude", Selectable: true, Sortable: true },
      { Name: "Longitude", Title: "system.longitude", Selectable: true, Sortable: true },
      { Name: "CreatedDate", Title: "system.created-date", Selectable: true, Sortable: true },
    ];
  }
  initializePage() {
    this.createSearchForm();
    forkJoin([
      this._listService.getDeliverymanList(),
      this._deliverymanLogService.getStatusList()
    ]).subscribe(res => {
      this.deliverymanList = res[0].Data;
      this.actionList = res[1].Data;
    }
    );
    this._activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      this.searchViewModel.DeliverymanID = params.DeliverymanID
      this.search();
    });
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this._deliverymanLogService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as DeliverymanLogViewModel[];
      }
    });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      ID: [this.searchViewModel.ID],
      DeliverymanID: [this.searchViewModel.DeliverymanID],
      Action: [this.searchViewModel.Action],
      FromDate: [this.searchViewModel.FromDate, [Validators.required]],
      ToDate: [this.searchViewModel.ToDate, [Validators.required]],
    });
  }
}
