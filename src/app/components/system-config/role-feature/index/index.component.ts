import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoleFeatureService } from '../role-feature.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { forkJoin } from 'rxjs';
import { RoleFeatureSearchViewModel } from '../view-models/role-feature.model';
import { RoleFeatureCreateViewModel } from '../view-models/role-feature-create.model';
import { ListService } from 'src/app/service/list.service';
import { UserFeatureViewModel } from 'src/app/components/logged-user/view-model/logged-user.model';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: [
  ]
})
export class IndexComponent implements OnInit,OnDestroy {

  page: CRUDIndexPage = new CRUDIndexPage();
  searchViewModel: RoleFeatureSearchViewModel = new RoleFeatureSearchViewModel();
  roleList: SelectItem[] = []
  moduleList: SelectItem[] = []
  featureList: UserFeatureViewModel[] = [];
  model: RoleFeatureCreateViewModel = new RoleFeatureCreateViewModel()

  constructor(
    private _roleFeatureService: RoleFeatureService,
    private _sharedService: SharedService,
    private _listService: ListService,
  ) {
  }
  ngOnDestroy(): void {
    this.canSendToParent = false
  }
  ngOnInit() {
    this.page.columns = [
      { Name: "", Title: "system-config.feature.id", Selectable: false, Sortable: false },
      { Name: "", Title:"system-config.feature.name", Selectable: false, Sortable: false },
    ];
    this.subscribeToParentEvent();
    this.initializePage();
  }

  initializePage() {
    forkJoin([
      this._listService.getRoleList(),
      this._listService.getModuleList(),
      this._listService.getCompanyFeatureList(),
    ]).subscribe(res => {
      this.roleList = res[0].Data
      this.moduleList = res[1].Data
      this.featureList = res[2].Data
      this.searchViewModel.RoleID = this.roleList[0].ID
      this.searchViewModel.ModuleID = this.moduleList[0].ID
      this.createSearchForm()
      this.getFeatureByRoleID(this.searchViewModel.RoleID)
    });
  }

  createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      RoleID: [this.searchViewModel.RoleID],
      ModuleID: [this.searchViewModel.ModuleID],
    });
    this.page.isPageLoaded = true;
  }

  getFeatureByRoleID(roleID: number) {
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.page.isSearching = true;
    this._roleFeatureService.getEditableByID(roleID).subscribe((response) => {
      this.featureList.forEach(element => {
        element.Selected = (response.Data as number[]).some(x => x == element.ID)
      });
      this.page.isSearching = false;
    });
  }

  onChangeModule() {
    Object.assign(this.searchViewModel, this.page.searchForm.value);
  }

  getFeatureList() {
    return this.featureList.filter(x => x.ModuleID == this.searchViewModel.ModuleID)
  }

  getCurrentSeletcedFeature() {
    return this.getFeatureList().filter(i => i.Selected).map(i => i.ID)
  }

  getSelectedFeature() {
    return this.featureList.filter(i => i.Selected).map(i => i.ID)
  }

  save() {
    Object.assign(this.model, { RoleID: this.searchViewModel.RoleID, FeatureIDs: this.getSelectedFeature() })
    this.page.isSaving = true;
    this._roleFeatureService.save(this.model).subscribe((res) => {
      this.page.isSaving = false;
      this._sharedService.showToastr(res)
      this.fireEventToParent()
    }, (error) => {
      this.page.isSaving = false;
    });
  }

  isAllSelected(): boolean {
    return this.getFeatureList().every(i => i.Selected)
  }
  onSelectAllClicked() {
    let selected = this.isAllSelected()
    this.getFeatureList().forEach(element => {
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
