import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment-timezone';
import { WalletDaysViewModel } from '../view-models/wallet-days.model';
import { WalletDaysSearchViewModel } from '../view-models/wallet-days-search.model';
import { WalletDaysService } from '../wallet-days.service';
import { WalletDaylySammaryViewModel } from '../view-models/wallet-daily-sammary.models';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';
import { ColumnViewModel } from 'src/app/model/shared/column-view-model';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  // styleUrls: ['./index.component.css']
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  items: WalletDaysViewModel[] = [];
  itemsSammary: WalletDaylySammaryViewModel = new WalletDaylySammaryViewModel();
  deliveryMenList: SelectItem[] = [];
  selectedItem: WalletDaysViewModel = new WalletDaysViewModel();
  modalRef: BsModalRef;
  fromDate: string = ""
  toDate: string = ""
  searchViewModel: WalletDaysSearchViewModel = new WalletDaysSearchViewModel();
  pageRoute = `/accounting/wallet/agent/${this.searchViewModel.DeliverymanID}`
  @ViewChild('archiveTemplate', { static: false }) deleteTemplate: any;
  @ViewChild('addToQueueTemplate', { static: false }) addToQueueTemplate: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _WalletDaysService: WalletDaysService,
    private router: Router
  ) {
    super(_sharedService);
  }
  ngOnInit() {
    this.page.orderBy = "Date";
    this.initializePage();
  }
  initializePage() {
    this.page.isPageLoaded = false;
    this.page.columns = [
      { Name: "Date", Title: "shared.date", Selectable: true, Sortable: true },
      { Name: "ShiftHours", Title: "wallet.wallet-days.shift-hours", Selectable: true, Sortable: true },
      { Name: "ShiftBonus", Title: "wallet.wallet-days.shift-bonus", Selectable: true, Sortable: true },
      { Name: "TripBonus", Title: "wallet.wallet-days.bonus", Selectable: true, Sortable: false },
      { Name: "Detuction", Title: "wallet.wallet-days.detuction", Selectable: true, Sortable: false },
      { Name: "TotalAmount", Title: "deliveryman.total-amount", Selectable: true, Sortable: false },
    ];
    this.createSearchForm();
    this.searchViewModel.DeliverymanID = +this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      if (params.fromDate && params.toDate) {
        this.searchViewModel.FromDate = new Date(params.fromDate)// moment(params.fromDate).format('YYYY-MM-DD');
        this.searchViewModel.ToDate = new Date(params.toDate) //moment(params.toDate).format('YYYY-MM-DD');
      }
      else {
        this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
        this.searchViewModel.ToDate = new Date();
      }
      this.search()
    });
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this._WalletDaysService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as WalletDaysViewModel[];
      }
      this.page.isSearching = false;
    });
    this._WalletDaysService.getSammary(this.searchViewModel).subscribe((response: any) => {
      this.page.isSearching = false;
      if (response) {
        this.page.isAllSelected = false;
        this.itemsSammary = response.Data as WalletDaylySammaryViewModel;
      }
    });
  }
  createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      ToDate: [this.searchViewModel.ToDate],
      FromDate: [this.searchViewModel.FromDate]
    });
    this.page.isPageLoaded = true;
  }
  isDateSet(): boolean {
    var fromDate = this.page.searchForm.get('FromDate').value
    var toDate = this.page.searchForm.get('ToDate').value
    if (fromDate != '' && fromDate != null && toDate != '' && toDate != null)
      return true
    else
      return false
  }
  showArchiveConfirmation(selectedItem: WalletDaysViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.deleteTemplate, { class: 'modal-sm' });
  }
  navigateToDetails(item: WalletDaysViewModel) {
    let toDate = moment(item.Date).format('YYYY-MM-DD');
    let fromDate = moment(item.Date).format('YYYY-MM-DD');
    if (toDate != 'Invalid date' && fromDate != 'Invalid date') {
      this.router.navigate([`/accounting/wallet/transaction/`], { queryParams: { DeliverymanID: this.itemsSammary.DeliverymanID, FromDate: fromDate, ToDate: toDate } });
    }
    else
      this.router.navigate([`/accountingwallet/transaction`], { queryParams: { DeliverymanID: this.itemsSammary.DeliverymanID } });
  }
}
