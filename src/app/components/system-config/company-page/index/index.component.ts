import { Component, OnInit } from '@angular/core';
import { CompanyPageService } from '../company-page.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { forkJoin } from 'rxjs';
import { CompanyPageSearchViewModel } from '../view-models/company-page.model';
import { CompanyPageCreateViewModel } from '../view-models/company-page-create.model';
import { ListService } from 'src/app/service/list.service';
import { PageViewModel } from '../../pages/view-models/page.model';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: [
  ]
})
export class IndexComponent implements OnInit {

  page: CRUDIndexPage = new CRUDIndexPage();
  pageList: SelectItem[] = [];
  searchViewModel: CompanyPageSearchViewModel = new CompanyPageSearchViewModel();
  companyList: SelectItem[] = []
  model: CompanyPageCreateViewModel = new CompanyPageCreateViewModel()

  constructor(
    private _companyPageService: CompanyPageService,
    private _sharedService: SharedService,
    private _listService: ListService,
  ) {
  }
  ngOnDestroy(): void {
    this.canSendToParent = false
  }

  ngOnInit() {
    this.subscribeToParentEvent();
    this.initializePage();
    this.page.columns = [
      { Name: "ID", Title: "shared.id", Selectable: false, Sortable: false },
      { Name: "PageName", Title: "system-config.page-name", Selectable: false, Sortable: false },
    ];
  }

  initializePage() {
    forkJoin([
      this._listService.getCompanyList(),
      this._companyPageService.get(),
    ]).subscribe(res => {
      this.companyList = res[0].Data
      this.pageList = res[1].Data
      this.searchViewModel.CompanyID = this.companyList[0].ID
      this.searchViewModel.ParentID = this.pageList[0].ID
      this.createSearchForm()
      this.getPageByCompanyID(this.searchViewModel.CompanyID)
    });


  }
  createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      CompanyID: [this.searchViewModel.CompanyID],
      ParentID: [this.searchViewModel.ParentID],
    });
    this.page.isPageLoaded = true;
  }

  getPageByCompanyID(id: number) {
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this._companyPageService.getEditableByID(id).subscribe((response) => {
      this.pageList.forEach(element => {
        element.Selected = (response.Data as PageViewModel[]).map(i=>i.ID).some(x => x == element.ID)
      });
    });
  }

  onChangeParent() {
    Object.assign(this.searchViewModel, this.page.searchForm.value);
  }

  getPageList() {
    return this.pageList//.filter(x => x.ParentID == this.searchViewModel.ParentID)
  }

  getCurrentSeletcedPage() {
    return this.getPageList().filter(i => i.Selected).map(i => i.ID)
  }

  save() {
    Object.assign(this.model, { CompanyID: this.searchViewModel.CompanyID, PageIDs: this.getCurrentSeletcedPage() })
    this.page.isSaving = true;
    this._companyPageService.save(this.model).subscribe((res) => {
      this.page.isSaving = false;
      this._sharedService.showToastr(res)
      if (!res.Success) {
        this.getPageByCompanyID(this.searchViewModel.CompanyID)
      this.fireEventToParent()

      }
    }, (error) => {
      this.page.isSaving = false;
    });
  }
  
  isAllSelected():boolean{
    return this.getPageList().every(i=>i.Selected)
  }
  onSelectAllClicked(){
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
