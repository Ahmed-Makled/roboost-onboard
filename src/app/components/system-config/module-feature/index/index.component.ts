import { Component, OnInit } from '@angular/core';
import { ModuleFeatureService } from '../module-feature.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { forkJoin } from 'rxjs';
import { ModuleFeatureViewModel, ModuleFeatureSearchViewModel } from '../view-models/module-feature.model';
import { ModuleFeatureCreateViewModel } from '../view-models/module-feature-create.model';
import { ListService } from 'src/app/service/list.service';
import { UserFeatureViewModel } from 'src/app/components/logged-user/view-model/logged-user.model';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: [
  ]
})
export class IndexComponent implements OnInit {

  page: CRUDIndexPage = new CRUDIndexPage();
  searchViewModel: ModuleFeatureSearchViewModel = new ModuleFeatureSearchViewModel();
  moduleList: SelectItem[] = []
  featureList: UserFeatureViewModel[] = []
  model: ModuleFeatureCreateViewModel = new ModuleFeatureCreateViewModel()

  constructor(
    private _roleFeatureService: ModuleFeatureService,
    private _sharedService: SharedService,
    private _listService: ListService,
  ) {
  }

  ngOnInit() {
    this.initializePage();
    this.page.columns = [
      { Name: "", Title: "system-config.feature.id", Selectable: false, Sortable: false },
      { Name: "", Title: "system-config.feature.name", Selectable: false, Sortable: false },
      { Name: "", Title: "system-config.module-name", Selectable: false, Sortable: false },
      { Name: "", Title: "system-config.action", Selectable: false, Sortable: false },
    ];
  }

  initializePage() {
    forkJoin([
      this._listService.getModuleList(),
      this._listService.getFeatureList()
    ]).subscribe(res => {
      this.moduleList = res[0].Data
      this.featureList = res[1].Data
      this.searchViewModel.ModuleID = this.moduleList[0].ID
      this.createSearchForm() 
    });
  }

  getModuleName(id:number):string{
    return this.moduleList.find(i=>i.ID == id).Name
  }

  createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      ModuleID: [this.searchViewModel.ModuleID],
    });
    this.page.isPageLoaded = true;
    this.page.isSearching = false;
  }

  save(id:number) {
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.model.ModuleID = this.searchViewModel.ModuleID
    this.model.FeatureID = id
    this.page.isSaving = true;
    this._roleFeatureService.save(this.model).subscribe((res) => {
      this.page.isSaving = false;
      this.featureList.find(i=>i.ID == id).ModuleID = this.searchViewModel.ModuleID
      this._sharedService.showToastr(res)
    },(error) => {
      this.page.isSaving = false;
    });
  }
}
