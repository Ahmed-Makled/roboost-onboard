import { ControlType } from "src/app/enum/control-type.enum";
import { FeatureEnum } from "src/app/enum/feature.enum"
import { PageEnum } from "src/app/enum/page.enum";
import { ColumnViewModel } from "src/app/model/shared/column-view-model";
import { CRUDIndexPage } from "src/app/model/shared/crud-index.model";
import { SharedService } from "src/app/service/shared.service"
export class CrudIndexBaseUtils {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute: string
  orderBy: string = 'ID'
  featureEnum = FeatureEnum
  pageEnum = PageEnum
  canSendToParent: boolean = true
  controlType = ControlType
  constructor(
    public _sharedService: SharedService
  ) { }
  //#region abstract method
  search() {
    console.error("Method search not implemented.");
  }
  getReport() {
    console.error("Method getReport not implemented.");
  }
  //#endregion method
  subscribeFilteration(params) {
    this._sharedService.getFilterationFromURL(params, this.page.searchForm);
    this.search();
  }
  hasFeature(value: FeatureEnum) {
    return SharedService.featureList.some(i => i == value)
  }
  hasPage(value: PageEnum): boolean {
    return SharedService.pageList.some(i => i.ID == value)
  }
  isSingleStore() {
    return this._sharedService._storageService.getISSingleStore()
  }
  fireEventToParent() {
    if (this.canSendToParent) this._sharedService.fireEvent(false, this.page.options.totalItems);
  }
  subscribeToParentEvent() {
    this._sharedService.parentChildEvent.subscribe((res: any) => { if (res.fromParent && this.canSendToParent) this.getReport() });
  }
  //#region search
  createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({});
}
  onSearchClicked() {
    this.page.options.currentPage = 1;
    this.page.orderBy = this.orderBy;
    this.page.isAscending = false;
    this._sharedService.saveFilteration({ pageRoute: this.pageRoute, searchForm: this.page.searchForm, });
  }
  onSortClicked(column: ColumnViewModel) {
    if (column.Sortable) {
      if (column.Name === this.page.orderBy) this.page.isAscending = !this.page.isAscending;
      else this.page.isAscending = false;
      this.page.orderBy = column.Name;
      this.page.options.currentPage = 1;
      this._sharedService.saveFilteration({ pageRoute: this.pageRoute, searchForm: this.page.searchForm, });
    }
  }
  resetForm() {
    this.page.searchForm.reset()
    if (this.page.searchForm.controls['FromDate']) this.page.searchForm.controls['FromDate'].setValue(this._sharedService.dateService.getFirstDayCurrentMonth())
    if (this.page.searchForm.controls['ToDate']) this.page.searchForm.controls['ToDate'].setValue(new Date())
    this.onSearchClicked()
  }
  //#endregion search
  //#region Table
  isColumnAscending(column: string): boolean {
    return (column != this.page.orderBy) ? null : (this.page.isAscending ? true : false);
  }
  onChangePageSize() {
    this.onSearchClicked();
  }
  getNextPrevData(pageIndex) {
    this.page.options.currentPage = pageIndex;
    this.search();
  }
  confingPagination(response) {
    this.page.options.totalItems = response.Data.Records;
    this.page.options.totalPages = response.Data.Pages;
    this.page.options.itemsPerPage = response.Data.PageSize;
  }
  //#endregion table
}
