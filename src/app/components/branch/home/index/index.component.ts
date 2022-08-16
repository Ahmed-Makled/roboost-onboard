import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';
import { BranchHomeViewModel, StoreCopyViewModel } from '../view-models/branch-home.model';
import { BranchHomeSearchViewModel } from '../view-models/branch-home-search.model';
import * as moment from 'moment';
import { BranchHomeService } from '../branch-home.service';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { FormControl, Validators } from '@angular/forms';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  pageCreate: CRUDCreatePage = new CRUDCreatePage();
  items: BranchHomeViewModel[] = [];
  advancedSearch: boolean = false;
  selectedItem: BranchHomeViewModel = new BranchHomeViewModel();
  storeCopy: StoreCopyViewModel = new StoreCopyViewModel();
  modalRef: BsModalRef;
  searchViewModel: BranchHomeSearchViewModel = new BranchHomeSearchViewModel();
  apiKeyFlag: boolean = false
  pageRoute = '/store/home'
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  @ViewChild('copyTemplate', { static: false }) copyTemplate: any;
  @ViewChild('APIKeyTemplate', { static: false }) APIKeyTemplate: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _pageService: BranchHomeService,
    public _sharedService: SharedService,
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
      { Name: "Code", Title: "shared.code", Selectable: true, Sortable: true },
      { Name: "NameArabic", Title: "system.name-ar", Selectable: true, Sortable: true },
      // { Name: "DeliverymenCount", Title: "store.deliveryman-count", Selectable: true, Sortable: true },
      { Name: "LastOrder", Title: "store.last-order", Selectable: true, Sortable: true },
    ];
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.subscribeFilteration(params)
    });
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      NameArabic: [this.searchViewModel.NameArabic],
      NameEnglish: [this.searchViewModel.NameEnglish],
      FromDate: [this.searchViewModel.FromDate],
      ToDate: [this.searchViewModel.ToDate],
    });
    this.page.isPageLoaded = true;
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.searchViewModel.FromDate = moment(this.searchViewModel.FromDate).format('YYYY-MM-DD');
    this.searchViewModel.ToDate = moment(this.searchViewModel.ToDate).format('YYYY-MM-DD');
    this._pageService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as BranchHomeViewModel[];
      }
      this.fireEventToParent()
    });
  }
  showDeleteConfirmation(selectedItem: BranchHomeViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.deleteTemplate, { class: 'modal-sm', });
  }
  remove() {
    this._pageService.remove(this.selectedItem.ID).subscribe(res => {
      this._sharedService.showToastr(res);
      if (res.Success) {
        this.items.splice(this.items.findIndex(i => i.ID == this.selectedItem.ID), 1)
        this.modalRef.hide();
      }
    })
  }
  showCopyTemplate(selectedItem: BranchHomeViewModel) {
    if (this.pageCreate.form?.controls['APIKey']) {
      this.apiKeyFlag = false;
      this.pageCreate.form.removeControl('APIKey')
    }
    this.storeCopy = new StoreCopyViewModel();
    this.storeCopy.CopyBranchID = selectedItem.ID;
    this.createCopyForm();
    this.modalRef = this._sharedService.modalService.show(this.copyTemplate, { class: 'modal-500' });
  }
  createCopyForm() {
    this.pageCreate.form = this._sharedService.formBuilder.group({
      NameArabic: [this.storeCopy.NameArabic, [Validators.required]],
      NameEnglish: [this.storeCopy.NameEnglish, [Validators.required]],
      StoreCode: [this.storeCopy.StoreCode, []],
    });
  }
  toggelAddApiKey() {
    this.apiKeyFlag = !this.apiKeyFlag
    if (this.apiKeyFlag)
      this.pageCreate.form.addControl('APIKey', new FormControl(this.generateAPIKey(), [Validators.required, Validators.minLength(64), Validators.maxLength(64)]))
    else {
      this.storeCopy.APIKey = null
      this.pageCreate.form.removeControl('APIKey')
    }
  }
  copy() {
    this.pageCreate.isSaving = true;
    Object.assign(this.storeCopy, this.pageCreate.form.value)
    this._pageService.copy(this.storeCopy).subscribe(res => {
      this._sharedService.showToastr(res);
      this.pageCreate.isSaving = false;
      if (res.Success) {
        this.search();
        this.modalRef.hide();
      }
    }
    )
  }
  showAPIKeyTemplate(item: BranchHomeViewModel) {
    this.selectedItem = item;
    this.modalRef = this._sharedService.modalService.show(
      this.APIKeyTemplate,
      { class: 'modal-440 ' }
    );
  }
  copyAPI() {
    this.modalRef.hide();
    this._sharedService.showSuccessAlert('API Key copied to clipboard !');
  }
  getColor(date: Date): string {
    var now = new Date().getTime()
    var hours = (now - new Date(date).getTime()) / (1000 * 60 * 60)
    if (hours > 1)
      return "#FF0000"
    else
      return "#008000"
  }
  generateAPIKey() {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 64; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  disabledSubmit() {
    return (this.pageCreate.isSaving || !this.pageCreate.form.valid);
  }
}
