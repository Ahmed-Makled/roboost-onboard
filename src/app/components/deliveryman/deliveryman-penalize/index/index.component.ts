import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone'; //.format('YYYY-MM-DDTHH:mm:ss')
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DeliverymanPenalizeViewModel } from '../view-models/deliveryman-penalize.model';
import { DeliverymanPenalizeSearchViewModel } from '../view-models/deliveryman-penalize-search.model';
import { DeliverymanPenalizeService } from '../deliveryman-penalize.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { DeliverymanService } from '../../home/deliveryman.service';
import { ListService } from 'src/app/service/list.service';
import { ColumnViewModel } from 'src/app/model/shared/column-view-model';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  // styleUrls: ['./index.component.css']
})
export class DeliveryPenalizeComponent extends CrudIndexBaseUtils implements OnInit, OnDestroy {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/agent/shift/penalized'
  modalRef: BsModalRef;
  items: DeliverymanPenalizeViewModel[] = [];
  selectedItem: DeliverymanPenalizeViewModel = new DeliverymanPenalizeViewModel();
  searchViewModel: DeliverymanPenalizeSearchViewModel = new DeliverymanPenalizeSearchViewModel();
  deliverymanList: SelectItem[] = [];
  branchList: SelectItem[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _listService: ListService,
    private _deliverymanPenalizeService: DeliverymanPenalizeService,
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
      { Name: "StartDate", Title: "deliveryman.start-date", Selectable: true, Sortable: true },
      { Name: "CloseDate", Title: "deliveryman.close-date", Selectable: true, Sortable: true },
      { Name: "Duration", Title: "system.duration", Selectable: false, Sortable: false },
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
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      this.search();
    });
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this._deliverymanPenalizeService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as DeliverymanPenalizeViewModel[];
        this.items.forEach(x => x.IsSelected = false);
      }
      this.fireEventToParent()
    });
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
      if (res.Success) {
        this.deliverymanList = res.Data
      }
    })
  }
  @ViewChild('confirmDeletePnelaizeTemplate', { static: false }) confirmDeletePnelaizeTemplate: any;
  showDeleteConfirmation(selectedItem: DeliverymanPenalizeViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.confirmDeletePnelaizeTemplate, { class: 'modal-sm' });
  }
  remove() {
    this._deliverymanPenalizeService.remove([this.selectedItem.ID]).subscribe(res => {
      this._sharedService.showToastr(res)
      if (res.Success) {
        let index = this.items.findIndex(x => x.ID == this.selectedItem.ID);
        this.items.splice(index, 1);
      }
    })
  }
  @ViewChild('deleteSelectedTemplate', { static: false }) deleteSelectedTemplate: any;
  showDeleteSelectedConfirmation() {
    this.modalRef = this._sharedService.modalService.show(this.deleteSelectedTemplate, { class: 'modal-sm' });
  }
  removeSelected() {
    this._deliverymanPenalizeService.remove(this.items.filter(i => i.IsSelected == true).map(x => x.ID)).subscribe(res => {
      this._sharedService.showToastr(res)
      if (res.Success) {
        this.items.filter(i => i.IsSelected == true).forEach(element => {
          let index = this.items.findIndex(x => x.ID == element.ID);
          this.items.splice(index, 1);
        });
      }
    })
  }
  selectAll() {
    this.page.isAllSelected = !this.page.isAllSelected;
    this.items.forEach(item => {
      item.IsSelected = this.page.isAllSelected
    });
  }
  showRemoveAll(): boolean {
    return this.items.filter(i => i.IsSelected == true).length > 0
  }
  getReport() {
    this.page.isSearching = true;
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._deliverymanPenalizeService.getReport(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      this.fireEventToParent()
      this._sharedService.downloadFile(response, "deliverymen penalize  Report ")
    }, () => this.page.isSearching = false);
  }
 
}
