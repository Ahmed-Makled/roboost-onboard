import { Component, OnInit } from '@angular/core';
import { UserPagesViewModel } from 'src/app/components/logged-user/view-model/logged-user.model';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { PageEnum } from 'src/app/enum/page.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
@Component({
  selector: 'app-index',
  templateUrl: './layout.component.html',
})
export class AgentSecondLayoutComponent implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageParentID: PageEnum = PageEnum.Agent_Delivery
  tabTotalItems?: number;
  constructor(
    private _sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.subscribeToChildEvent()
  }

  onTabClick(item: UserPagesViewModel) {
    if (this.getCurrentChild().ID != item.ID) {
      this.page.isSearching = true
      this.tabTotalItems = null
    }
    this._sharedService.router.navigate([item.Url]);
  }
  
  getParentPage() {
    return this._sharedService.getPageByID(this.pageParentID)
  }
  getPage() {
    return this._sharedService.getFirstLayoutCurrentChild(this.pageParentID)
  }
  getChildList(): UserPagesViewModel[] {
    return this._sharedService.getChildList(this.getPage().ID)
  }
  getCurrentChild():UserPagesViewModel {
    return this._sharedService.getLastLayoutCurrentChild(this.getPage().ID)
  }
  showTabLinks() {
    return this.getChildList().length>0
  }
  showLayout() {
    return  this.getPage() != undefined
  }


  canShowActionCreate() {
    return this.getPage().ID == PageEnum.Agent_profiles
  }
  canShowReport() {
    return (this.getCurrentChild()?.ID == PageEnum.Agent_Shifts_Working_Hours && SharedService.featureList.some(i => i == FeatureEnum.Agent_DeliverymanShiftGetReport)) ||
      (this.getCurrentChild()?.ID == PageEnum.Agent_Shifts_Penalized && SharedService.featureList.some(i => i == FeatureEnum.Agent_DeliverymanPenalizeGetReport))
  }
  subscribeToChildEvent() {
    this._sharedService.parentChildEvent.subscribe((res: any) => {
      if (!res.fromParent) {
        this.tabTotalItems = res.data
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
