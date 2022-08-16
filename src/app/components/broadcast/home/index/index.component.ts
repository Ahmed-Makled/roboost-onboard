import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { BroadcastService } from '../../broadcat.service';
import {
  BroadcastSearchViewModel,
  BroadcastViewModel,
} from '../view-models/broadcast-model';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  searchViewModel: BroadcastSearchViewModel = new BroadcastSearchViewModel();
  selectedItem: BroadcastViewModel;
  items: BroadcastViewModel[] = [];
  modalRef: BsModalRef;
  showPushNotificationFlag: boolean = false;
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  pageRoute = '/broadcast/home'
  constructor(
    private broadcastService: BroadcastService,
    public _sharedService: SharedService,
    private _activatedRoute: ActivatedRoute
  ) {
    super(_sharedService);
  }
  ngOnInit() {
    this.initializePage();
  }
  initializePage() {
    this.page.columns = [
      { Name: "Headline", Title: "broadcast.headline", Selectable: true, Sortable: false },
      { Name: "Date", Title: "shared.date", Selectable: true, Sortable: false },
      { Name: "Sent", Title: "broadcast.sent", Selectable: true, Sortable: false },
      { Name: "Recieved", Title: "broadcast.received", Selectable: true, Sortable: false },
      { Name: "Viewed", Title: "broadcast.viewed", Selectable: true, Sortable: false },
      { Name: "Status", Title: "shared.status", Selectable: true, Sortable: false },
      { Name: "Actions", Title: "system.actions", Selectable: true, Sortable: false },
    ];
    this.createSearchForm()
    this._activatedRoute.queryParams.subscribe((params) => {
      this.subscribeFilteration(params)
  });
  }
  search() {
    this.page.isSearching = true;
    this.items=[];
    this.broadcastService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage)
      .subscribe((response) => {
        if (response.Success) {
          this.page.isSearching = false;
          this.page.isAllSelected = false;
          this.page.options.totalItems = response.Data.Records;
          this.page.options.totalPages = response.Data.Pages;
          this.page.options.itemsPerPage = response.Data.PageSize;
          this.items = response.Data.Items as BroadcastViewModel[];
          this.page.isPageLoaded = true
        }
      });
  }
  updateActive(code: string) {
    this.broadcastService.update(code).subscribe((response) => {
      this._sharedService.showToastr(response);
      if (response.Success) {
        this.items.forEach((i) => {
          if (i.Code === code) {
            i.IsActive = !i.IsActive;
          }
        });
      }
    });
  }
  showDeleteConfirmation(selectedItem: BroadcastViewModel, event: any) {
    event.stopPropagation();
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.deleteTemplate, { class: 'modal-sm', });
  }
  remove() {
    this.modalRef.hide();
    this.broadcastService.remove(this.selectedItem.Code).subscribe((response) => {
      this._sharedService.showToastr(response);
      if (response.Success) {
        this.items.splice(this.items.findIndex((i) => i.Code == this.selectedItem.Code), 1);
      }
    });
  }
  showPushNotification() {
    this.showPushNotificationFlag = true;
    setTimeout(() => {
      this.showPushNotificationFlag = false;
    }, 100);
  }
}
