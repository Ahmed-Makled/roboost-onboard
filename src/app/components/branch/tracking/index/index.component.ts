import { Component, OnInit, ViewChild } from '@angular/core';
import { BranchTrackingViewModel } from '../view-models/branch-tracking.model'
import { BranchTrackingService } from '../branch-tracking.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { FormGroup } from '@angular/forms';
import { ColumnViewModel } from 'src/app/model/shared/column-view-model';
import { ActivatedRoute } from '@angular/router';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { GroupingTypeEnum } from 'src/app/components/dispatch/page/view-models/filter.model';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: [
  ]
})
export class IndexComponent extends CrudIndexBaseUtils implements  OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  items: BranchTrackingViewModel[] = [];
  branchesHasProblems: number = 0
  orderBy = "ID";
  pageRoute= '/store/tracking'

  constructor(
    public _sharedService: SharedService,
    private _pageService: BranchTrackingService,
    private _activatedRoute: ActivatedRoute) {
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
      { Name: "NameEnglish", Title: "shared.name", Selectable: true, Sortable: true },
      { Name: "PendingOrders", Title: "system.pending", Selectable: true, Sortable: true },
      { Name: "PausedOrders", Title: "system.paused", Selectable: true, Sortable: false },
      { Name: "LastDeliveredOrder", Title: "system.last-delivered", Selectable: true, Sortable: true },
      { Name: "TotalDeliveryMen", Title: "system.total-on-shift", Selectable: true, Sortable: true },
      { Name: "AvailableDeliveryMen", Title: "system.available", Selectable: true, Sortable: true },
      { Name: "BreakDeliveryMen", Title: "system.break", Selectable: true, Sortable: true },
      { Name: "OnDutyDeliveryMen", Title: "system.on-duty", Selectable: true, Sortable: true },
    ];
    this.page.orderBy = "PendingOrders"
    this.createSearchForm()
    this._activatedRoute.queryParams.subscribe(params => {
        this.subscribeFilteration(params)
    });
  }

  createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({});
    this.page.isPageLoaded = true;
  }
  search() {
    this.page.isSearching = true;
    this.branchesHasProblems = 0
    this.items = [];
    this._pageService.get(this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as BranchTrackingViewModel[];
        this.items.forEach(element => {
          element.LastDeliveredOrderDuration = element.LastDeliveredOrderDuration / 60
          if (element.LastDeliveredOrderDuration >= 5 || (element.AvailableDeliveryMen == 0 && element.OnDutyDeliveryMen == 0)) {
            this.branchesHasProblems += 1
          }
        });
      }
      this.fireEventToParent()

    });
  }

  

 
  isControlNotValidAndTouched(controlName: string, form: FormGroup) {
    let control = form.controls[controlName];
    return control.invalid && control.touched;
  }
  isControlValidAndDirty(controlName: string, form: FormGroup) {
    let control = form.controls[controlName];
    return control.valid && control.dirty;
  }
  isControlNotValidAndDirty(controlName: string, form: FormGroup) {
    let control = form.controls[controlName];
    return !control.valid && control.dirty;
  }
  isControlHasError(controlName: string, error: string, form: FormGroup) {
    return form.controls[controlName].hasError(error);
  }
  disabledSubmit(form: FormGroup) {
    return this.page.isSaving || !form.valid //|| this.item.ContactPersons.length == 0;
  }
  getFilterByStoreValue() {
    return GroupingTypeEnum.STORE;
  }

 
 
}
