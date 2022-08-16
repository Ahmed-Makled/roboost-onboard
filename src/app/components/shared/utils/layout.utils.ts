import { Component } from '@angular/core';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { PageEnum } from 'src/app/enum/page.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { LoggedUserService } from '../../logged-user/logged-user.service';
import { ModuleEnum, UserFeatureViewModel, UserPagesViewModel } from '../../logged-user/view-model/logged-user.model';

@Component({ template: '' })

export class AbstractSecondLayout {
  page: CRUDIndexPage = new CRUDIndexPage();
  moduleID: ModuleEnum[] = [0]
  pageID: PageEnum = 0
  tabTotalItems?: number;
  searchViewModel: any;
  constructor(
    public _sharedService: SharedService,
    public _userService: LoggedUserService,
  ) { }

  getUserModuleFeature() {
    this._userService.getUserModuleFeature(this.moduleID).subscribe((res) => {
      if (res.Success) {
        SharedService.featureList = (res.Data as UserFeatureViewModel[]).map(i => i.ID)
      }
      this.page.isPageLoaded = true
    })
  }
  onTabClick(item: UserPagesViewModel) {
    if (this.getCurrentChild().ID != item.ID) {
      this.page.isSearching = true
      this.tabTotalItems = null
    }
    this._sharedService.router.navigate([item.Url]);
  }
  getPage() {
    return this._sharedService.getPageByID(this.pageID)
  }
  getCurrentChild(): UserPagesViewModel {
    return this._sharedService.getFirstLayoutCurrentChild(this.pageID)
  }
  getChildList(): UserPagesViewModel[] {
    return this._sharedService.getChildList(this.pageID)
  }
  showLayout(): boolean {
    return this._sharedService.showLastLayout(this.pageID)
  }
  showTabLinks(): boolean {
    return this.getChildList().length > 1
  }

  subscribeToChildEvent() {
    this._sharedService.parentChildEvent.subscribe((res: any) => {
      if (!res.fromParent) {
        this.tabTotalItems = res.data
        this.searchViewModel = res.data.search ? res.data.search : {}
        this.page.isSearching = false
      }
    });
  }
  fireChildEvent() {
    this.page.isSearching = true;
    this._sharedService.fireEvent(true);
  }

  featureEnum = FeatureEnum
  hasFeature(value: FeatureEnum) {
    return SharedService.featureList.some(i => i == value)
  }

}
