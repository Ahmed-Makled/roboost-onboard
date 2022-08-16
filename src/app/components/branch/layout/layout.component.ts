import { Component, OnInit } from '@angular/core';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { PageEnum } from 'src/app/enum/page.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { LoggedUserService } from '../../logged-user/logged-user.service';
import { ModuleEnum, UserFeatureViewModel } from '../../logged-user/view-model/logged-user.model';
import { AbstractSecondLayout } from '../../shared/utils/layout.utils';
@Component({
  selector: 'app-index',
  templateUrl: './layout.component.html',
})
export class StoreLayoutComponent extends AbstractSecondLayout  implements OnInit  {
  page: CRUDIndexPage = new CRUDIndexPage();
  moduleID: ModuleEnum[] = [ModuleEnum.STORE]
  pageID: PageEnum = PageEnum.Stores
  tabTotalItems?: number;
  constructor(
    public _sharedService: SharedService,
    public _userService: LoggedUserService,
  ) {
    super(_sharedService ,_userService)
  }
  ngOnInit(): void {
    this.getUserModuleFeature()
    this.subscribeToChildEvent()
  }


  canShowActionCreate(): boolean {
    return this.getCurrentChild().ID == PageEnum.Stores_Home || this.getCurrentChild().ID == PageEnum.Stores_Hubs_Areas
  }
  canShowReport() {
    return     (this.getCurrentChild().ID == PageEnum.Stores_Delivery_Time ) 
  }
}
