import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoggedUserService } from 'src/app/components/logged-user/logged-user.service';
import { ModuleEnum, UserFeatureViewModel, UserPagesViewModel } from 'src/app/components/logged-user/view-model/logged-user.model';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { PageEnum } from 'src/app/enum/page.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
@Component({
  selector: 'app-index',
  templateUrl: './layout.component.html',
})
export class SystemSecondLayoutComponent implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageParentID: PageEnum = PageEnum.Accounts
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
    return this.getCurrentChild().ID == PageEnum.Accounting_Wallet_Transaction&&this.isSingleStore()&& this.hasFeature(FeatureEnum.Agent_WalletTransactionPost)
  }
  canShowReport() {
    return (this.getCurrentChild().ID == PageEnum.Accounting_Wallet_Store && SharedService.featureList.some(i => i == FeatureEnum.Agent_GetMonthlyWalletTransactionReport))
  }
  canShowValidate(){
   return this.getCurrentChild().ID == PageEnum.Accounting_Wallet_Agent && this.hasFeature(FeatureEnum.Agent_SettlementRequestPost)
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
  hasFeature(value: FeatureEnum) {
    return SharedService.featureList.some(i => i == value)
  }
  isSingleStore(){
    return this._sharedService._storageService.getISSingleStore()
  }


  

}
