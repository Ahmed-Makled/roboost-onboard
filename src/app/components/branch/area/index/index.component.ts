import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
import { BranchAreaService } from '../branch-area.service';
import { BranchAreaSearchViewModel } from '../view-models/branch-area-search.model';
import { BranchAreaViewModel } from '../view-models/branc-area.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  modalRef: BsModalRef;
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/store/area';
  orderBy = "Name"
  items: BranchAreaViewModel[] = [];
  selectedItem: BranchAreaViewModel = new BranchAreaViewModel();
  branchList: SelectItem[] = [];
  searchViewModel: BranchAreaSearchViewModel = new BranchAreaSearchViewModel();
  @ViewChild('createAreaTemplate', { static: false }) createAreaTemplate: any;
  constructor(
    private _activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _listService: ListService,
    private _branchAreaService: BranchAreaService,
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
      { Name: "Name", Title: "shared.name", Selectable: true, Sortable: true },
      { Name: "Branches", Title: "store.stores-count", Selectable: true, Sortable: false },
    ];
    this.createSearchForm();
    this._listService.getBranchList().subscribe(res => {
      this.branchList = res.Data;
      this.page.isPageLoaded = true;
    });
    this._activatedRoute.queryParams.subscribe((params) => { this.subscribeFilteration(params) });
  }
  createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      Name: [this.searchViewModel.Name],
      branchID: [this.searchViewModel.branchID],
    });
    this.page.isPageLoaded = true;
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this._branchAreaService.get(this.searchViewModel).subscribe((response) => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.options.totalItems = response.Data.length
        this.items = response.Data as BranchAreaViewModel[];
      }
      this.fireEventToParent()
    });
  }
  @ViewChild('confirmdeleteTemplate', { static: false }) confirmdeleteTemplate: any;
  showDeleteConfirmation(item: BranchAreaViewModel) {
    this.selectedItem = item
    this.modalRef = this._sharedService.modalService.show(this.confirmdeleteTemplate, { class: 'modal-sm' });
  }
  remove() {
    this._branchAreaService.remove(this.selectedItem.ID).subscribe(res => {
      if (res.Success) { this.items.splice(this.items.indexOf(this.selectedItem), 1) }
    })
  }
}
