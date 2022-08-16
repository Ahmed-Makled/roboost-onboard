import { Component, OnDestroy, OnInit } from '@angular/core';
import { RolePageService } from '../role-page.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { forkJoin } from 'rxjs';
import { RolePageViewModel, RolePageSearchViewModel } from '../view-models/role-page.model';
import { RolePageCreateViewModel } from '../view-models/role-page-create.model';
import { ListService } from 'src/app/service/list.service';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: [
  ]
})
export class IndexComponent implements OnInit, OnDestroy {

  page: CRUDIndexPage = new CRUDIndexPage();
  pageList: SelectItem[] = [];
  searchViewModel: RolePageSearchViewModel = new RolePageSearchViewModel();
  roleList: SelectItem[] = []
  companyList: SelectItem[] = []
  model: RolePageCreateViewModel = new RolePageCreateViewModel()

  constructor(
    private _rolePageService: RolePageService,
    private _sharedService: SharedService,
    private _listService: ListService,
  ) {
  }
  ngOnDestroy(): void {
    this.canSendToParent = false
  }

  ngOnInit() {
    this.page.columns = [
      { Name: "PageName", Title: "shared.id", Selectable: false, Sortable: false },
      { Name: "PageName", Title: "system-config.page-name", Selectable: false, Sortable: false },
    ];
    this.initializePage();
    this.subscribeToParentEvent()
  }

  initializePage() {
    forkJoin([
      this._listService.getRoleList(),
      this._rolePageService.get(),
      this._listService.getCompanyList(),
    ]).subscribe(res => {
      this.roleList = res[0].Data
      this.pageList = res[1].Data
      this.companyList = res[2].Data
      this.searchViewModel.RoleID = this.roleList[0].ID
      this.searchViewModel.ParentID = this.pageList[0].ID
      this.createSearchForm()
      this.getPageByRoleID(this.searchViewModel.RoleID)
    });
  }

  createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      RoleID: [this.searchViewModel.RoleID],
      ParentID: [this.searchViewModel.ParentID],
    });
    this.page.isPageLoaded = true;
  }

  getPageByRoleID(roleID: number) {
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this._rolePageService.getEditableByID(roleID).subscribe((response) => {
      this.pageList.forEach(element => {
        element.Selected = (response.Data as number[]).some(x => x == element.ID)
      });
    });
  }

  onChangeModule() {
    Object.assign(this.searchViewModel, this.page.searchForm.value);

  }

  getPageList() {
    return this.pageList//.filter(x => x.ParentID == this.searchViewModel.ParentID)
  }

  getCurrentSeletcedPage() {
    return this.getPageList().filter(i => i.Selected).map(i => i.ID)
  }

  save() {
    Object.assign(this.model, { RoleID: this.searchViewModel.RoleID, PageIDs: this.getCurrentSeletcedPage() })
    this.page.isSaving = true;
    this._rolePageService.save(this.model).subscribe((res) => {
      this.page.isSaving = false;
      this.fireEventToParent()
      this._sharedService.showToastr(res)
      if (!res.Success) {
        this.getPageByRoleID(this.searchViewModel.RoleID)
      }
    }, (error) => {
      this.page.isSaving = false;
    });
  }

  isAllSelected(): boolean {
    return this.getPageList().every(i => i.Selected)
  }
  onSelectAllClicked() {
    let selected = this.isAllSelected()
    this.getPageList().forEach(element => {
      element.Selected = !selected
    });
  }

  canSendToParent: boolean = true
  subscribeToParentEvent() {
    this._sharedService.parentChildEvent.subscribe((res: any) => {
      if (res.fromParent && this.canSendToParent) this.save()
    });
  }
  fireEventToParent() {
    if (this.canSendToParent)
      this._sharedService.fireEvent(false, this.page.options.totalItems);
  }
}
