import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import * as moment from 'moment';
import { PagesService } from '../page.service';
import { PageSearchViewModel } from '../view-models/page-search.model';
import { PageViewModel } from '../view-models/page.model';
import { PageCreateViewModel } from '../view-models/page-create.model';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  items: PageViewModel[] = [];
  advancedSearch: boolean = false;
  selectedItem: PageViewModel = new PageViewModel();
  modalRef: BsModalRef;
  searchViewModel: PageSearchViewModel = new PageSearchViewModel();
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  constructor(
    public _sharedService: SharedService,
    private _pageService: PagesService,
  ) {
    super(_sharedService);
  }
  ngOnInit() {
    this.initializePage();
  }
  initializePage() {
    this.page.isPageLoaded = false;
    this.page.columns = [
      { Name: "", Title: "shared.id", Selectable: false, Sortable: false },
      { Name: "", Title: "shared.name", Selectable: false, Sortable: false },
      { Name: "", Title: "system-config.parent-id", Selectable: false, Sortable: false },
      { Name: "", Title: "system-config.display-order", Selectable: false, Sortable: false },
      { Name: "", Title: "system-config.active", Selectable: false, Sortable: false },
      { Name: "", Title: "system-config.url", Selectable: false, Sortable: false },
    ];
    this.createSearchForm();
    this.search()
  }
  createSearchForm() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
    this.page.searchForm = this._sharedService.formBuilder.group({
      ID: [this.searchViewModel.ID],
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
        this.items = response.Data.Items as PageViewModel[];
      }
    });
  }
  showDeleteConfirmation(selectedItem: PageViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.deleteTemplate, { class: 'modal-sm', });
  }
  remove(selectedItem: PageViewModel) {
    this.selectedItem = selectedItem;
    this._pageService.remove(this.selectedItem.ID).subscribe(res => {
      this._sharedService.showToastr(res);
      if (res.Success) {
        this.items.splice(this.items.findIndex(i => i.ID == this.selectedItem.ID), 1)
      }
    })
  }
  addChildPage() {
    let index = 0
    setInterval(() => {
      if (this.addChild[index]) {
        this._pageService.postOrUpdate(this.addChild[index], false).subscribe(response => {
        })
      }
      index++
    }
      , 1000);
  }
  addChild: PageCreateViewModel[] = []
}
