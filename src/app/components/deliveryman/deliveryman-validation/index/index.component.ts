import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone';
import { ActivatedRoute } from '@angular/router';
import { DeliverymanValidationViewModel } from '../view-models/deliveryman-validation.model';
import { DeliverymanValidationSearchViewModel } from '../view-models/deliveryman-validation-search.model';
import { DeliverymanValidationService } from '../deliveryman-validation.service';
import { ValidateViewModel } from '../view-models/validate.model';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { ColumnViewModel } from 'src/app/model/shared/column-view-model';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ListService } from 'src/app/service/list.service';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit, OnDestroy {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/accounting/wallet/validation'
  items: DeliverymanValidationViewModel[] = [];
  validateItems: ValidateViewModel[] = [];
  deliveryMenList: SelectItem[] = [];
  totalUnPaidAmount: number;
  totalPaidAmount: number;
  selectedItem: DeliverymanValidationViewModel = new DeliverymanValidationViewModel();
  modalRef: BsModalRef;
  searchViewModel: DeliverymanValidationSearchViewModel = new DeliverymanValidationSearchViewModel();
  searchDetailsViewModel: DeliverymanValidationSearchViewModel = new DeliverymanValidationSearchViewModel();
  TotalAmount: number;
  TotalUnPaidAmount: number;
  storeList: SelectItem[] = []
  agentList: SelectItem[] = []
  @ViewChild('validateTemplate', { static: false }) validateTemplate: any;
  @ViewChild('addToQueueTemplate', { static: false }) addToQueueTemplate: any;
  @ViewChild('forceLogOutTemplate', { static: false }) forceLogOutTemplate: any;
  Selected: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _deliverymanValidationService: DeliverymanValidationService,
    private _listService: ListService
  ) {
    super(_sharedService);
  }
  ngOnDestroy(): void {
    this.canSendToParent = false
  }
  ngOnInit() {
    this.page.columns = [
      { Name: 'DeliverymanID', Title: 'deliveryman.deliveryman-validation.deliveryman-name', Selectable: true, Sortable: true, },
      { Name: 'FromDate', Title: 'shared.from-date', Selectable: true, Sortable: true, },
      { Name: 'ToDate', Title: 'shared.to-date', Selectable: true, Sortable: true, },
      { Name: 'TotalOrders', Title: 'deliveryman.deliveryman-validation.total-orders', Selectable: true, Sortable: false, },
      { Name: 'TotalUnPaidAmount', Title: 'deliveryman.unpaid-amount', Selectable: true, Sortable: true, },
      { Name: 'TotalPaidAmount', Title: 'deliveryman.paid-amount', Selectable: true, Sortable: true, },
      { Name: 'TotalAmount', Title: 'deliveryman.total-amount', Selectable: true, Sortable: true, },
    ];
    this.initializePage();
  }
  initializePage() {
    forkJoin([
      this._listService.getDeliverymanList(),
      this._listService.getBranchList()
    ]).subscribe(res => {
      this.agentList = res[0].Data;
      this.storeList = res[1].Data;
    });
    this.createSearchForm()
    this.activatedRoute.queryParams.subscribe((params) => { this.subscribeFilteration(params) });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      BranchID: [this.searchViewModel.BranchID],
      DeliverymanID: [this.searchViewModel.DeliverymanID],
      ToDate: [this.searchViewModel.ToDate],
      FromDate: [this.searchViewModel.FromDate],
    });
    this.page.isPageLoaded = true
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    if (this.page.orderBy == 'ID') this.page.orderBy = 'BranchName';
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this._deliverymanValidationService.get(this.searchViewModel).subscribe((response) => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.items = response.Data.WalletTransactions as DeliverymanValidationViewModel[];
        this.page.options.totalItems = this.items.length
        this.totalUnPaidAmount = response.Data.TotalUnPaidAmounts;
        this.items.forEach((element) => {
          element.FromDate = moment(element.FromDate).format('YYYY-MM-DD');
          element.ToDate = moment(element.ToDate).format('YYYY-MM-DD');
          element.Selected = false;
          this.TotalAmount += element.TotalAmount;
        });
        this.totalPaidAmount = this.TotalAmount - this.totalUnPaidAmount;
        this.fireEventToParent();
      }
    });
  }
  getDeliverymanList(id) {
    this.page.searchForm.controls['DeliverymanID']?.reset()
    this._listService.getDeliverymanList(id ?? 0).subscribe(res => {
      if (res.Success) this.agentList = res.Data
    })
  }
  validate() {
    this.validateItems = this.items.filter((i) => i.Selected).map(x => {
      return {
        DeliverymanID: x.DeliverymanID,
        ToDate: moment(x.ToDate).format('YYYY-MM-DD'),
        FromDate: moment(x.FromDate).format('YYYY-MM-DD'),
      }
    })
    this._deliverymanValidationService.post(this.validateItems).subscribe((response) => {
      this._sharedService.showToastr(response);
      if (response.Success) {
        this.items.filter((i) => i.Selected == true).forEach((element) => {
          element.TotalPaidAmount += element.TotalUnPaidAmount;
          element.TotalUnPaidAmount = 0;
          this.totalPaidAmount += this.totalUnPaidAmount;
          this.TotalUnPaidAmount = 0;
        });
        this.items.forEach((element) => {
          element.Selected = false;
        });
        this.Selected = false;
      }
    });
  }
  changeDeliverymanDate(oldItem: DeliverymanValidationViewModel, index) {
    this.searchDetailsViewModel.FromDate = moment(oldItem.FromDate).format('YYYY-MM-DD');
    this.searchDetailsViewModel.ToDate = moment(oldItem.ToDate).format('YYYY-MM-DD');
    var fromTime = new Date(this.searchDetailsViewModel.FromDate).getTime();
    var toTime = new Date(this.searchDetailsViewModel.ToDate).getTime();
    var nowTime = new Date(moment(new Date()).format('YYYY-MM-DD')).getTime();
    if (fromTime < toTime && toTime <= nowTime) {
      this.searchDetailsViewModel.DeliverymanID = oldItem.DeliverymanID;
      this._deliverymanValidationService.get(this.searchDetailsViewModel).subscribe((response) => {
        if (response.Success) {
          var newItem = response.Data.WalletTransactions as DeliverymanValidationViewModel[];
          if (newItem.length != 0) {
            this.items[index] = newItem[0];
            this.items[index].Selected = oldItem.Selected;
            this.TotalAmount -= oldItem.TotalAmount;
            this.TotalAmount += newItem[0].TotalAmount;
            this.totalPaidAmount -= oldItem.TotalPaidAmount;
            this.totalPaidAmount += newItem[0].TotalPaidAmount;
            this.totalUnPaidAmount -= oldItem.TotalUnPaidAmount;
            this.totalUnPaidAmount += newItem[0].TotalUnPaidAmount;
          } else
            this._sharedService.showErrorAlert('There is no data For this deliveryman in this time');
        }
      });
    } else if (fromTime >= toTime && toTime > nowTime) {
      this._sharedService.showErrorAlert(
        `To Date Must Be less Than ${moment(new Date()).format('YYYY-MM-DD')} & From Date Must Be less Than To Date`
      );
    } else if (toTime > nowTime) {
      this._sharedService.showErrorAlert(
        `To Date Must Be less Than ${moment(new Date()).format('YYYY-MM-DD')}`
      );
    } else {
      this._sharedService.showErrorAlert('From Date Must Be less Than To Date');
    }
  }
  showValidateConfirmation() {
    this.TotalUnPaidAmount = this._sharedService.getSumValues(this.items.filter((i) => i.Selected).map(x => x.TotalUnPaidAmount))
    this.modalRef = this._sharedService.modalService.show(this.validateTemplate, { class: 'modal-sm' });
  }
  isAllSelected(): boolean {
    return this.items.every(i => i.Selected)
  }
}
