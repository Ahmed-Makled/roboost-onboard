import { Component, OnInit } from '@angular/core';
import { CompanyFeatureService } from '../company-feature.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { forkJoin } from 'rxjs';
import { CompanyFeatureSearchViewModel, CompanyFeatureViewModel } from '../view-models/company-feature.model';
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
  searchViewModel: CompanyFeatureSearchViewModel = new CompanyFeatureSearchViewModel();
  companyList: SelectItem[] = []
  moduleList: SelectItem[] = []
  featureList: UserFeatureViewModel[] = [];

  constructor(
    private _companyFeatureService: CompanyFeatureService,
    private _sharedService: SharedService,
    private _listService: ListService,
  ) {
  }

  ngOnInit() {
    this.initializePage();
    this.page.columns = [
      { Name: "", Title: "Feature Name", Selectable: false, Sortable: false },
      { Name: "FeatureName", Title: "Feature Name", Selectable: false, Sortable: false },
    ];
  }

  initializePage() {
    forkJoin([
      this._listService.getCompanyList(),
      this._listService.getModuleList(),
      this._listService.getFeatureList(),
    ]).subscribe(res => {
      this.companyList = res[0].Data
      this.moduleList = res[1].Data
      this.featureList = res[2].Data
      this.searchViewModel.CompanyID = this.companyList[0].ID
      this.searchViewModel.ModuleID = this.moduleList[0].ID
      this.createSearchForm()
      this.getFeatureByCompanyID(this.searchViewModel.CompanyID)
    });


  }
  createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      CompanyID: [this.searchViewModel.CompanyID],
      ModuleID: [this.searchViewModel.ModuleID],
    });
    this.page.isPageLoaded = true;
  }

  getFeatureByCompanyID(id: number) {
    this.page.isSearching = true;
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this._companyFeatureService.getEditableByID(id).subscribe((response) => {
      this.featureList.forEach(element => {
        element.Selected = (response.Data as CompanyFeatureViewModel[]).map(i=>i.ID).some(x => x == element.ID)
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
    this.page.isSaving = true;
    this._companyFeatureService.save({ CompanyID: this.searchViewModel.CompanyID, Features: this.getSelectedFeature() }).subscribe((res) => {
      this.page.isSaving = false;
      this._sharedService.showToastr(res)
    }, (error) => {
      this.page.isSaving = false;
    });
  }

  isAllSelected():boolean{
    return this.getFeatureList().every(i=>i.Selected)
  }
  onSelectAllClicked(){
    let selected = this.isAllSelected()
    this.getFeatureList().forEach(element => {
      element.Selected = !selected
    });
  }
}
