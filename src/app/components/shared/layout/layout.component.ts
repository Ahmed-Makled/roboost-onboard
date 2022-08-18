import { Component, OnInit } from '@angular/core';
import { LocalizationService } from 'src/app/service/localization.service';
import { SharedService } from '../../../service/shared.service';
import { LayoutService } from './layout.service';
import { VendorNameViewModel } from './view-model/vendor-name.model';
import { CRUDIndexPage } from './../../../model/shared/crud-index.model';
import { UserViewModel } from './view-model/user.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { forkJoin } from 'rxjs';
import { LoggedUserService } from '../../logged-user/logged-user.service';
import { LanguageTypeEnum, UserPagesViewModel } from '../../logged-user/view-model/logged-user.model';
import { PageEnum } from 'src/app/enum/page.enum';
import { environment } from 'src/environments/environment';
import { CSSFilesService } from 'src/app/service/cssFiles.service';
export class TourList{
  SearchByList: SelectItem[] = [
    { ID: FilterTourStepEnum.General, Name: "General", Selected: false },
    { ID: FilterTourStepEnum.TripCardInfo,Name: "Trip Card Info", Selected: false },
    { ID: FilterTourStepEnum.TripActions,Name: "Trip Actions", Selected: false },
    { ID: FilterTourStepEnum.TripTaskActions,Name: "Trip Task Action ", Selected: false },
   
  ];
  SearchValue:FilterTourStepEnum = FilterTourStepEnum.General;

}
export enum FilterTourStepEnum {
  General = 1,
  TripCardInfo =3,
  TripActions =4,
  TripTaskActions =5,
 
}
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage()
  item: VendorNameViewModel = new VendorNameViewModel()
  user: UserViewModel = new UserViewModel()
  closeSideMenu: boolean //= window.innerWidth <787
  enterSideMenu: boolean;
  todayDate: any = new Date()
  languageList: SelectItem[] = [
    { ID: LanguageTypeEnum.EN, Name: "English", Url: 'en', Selected: false },
    { ID: LanguageTypeEnum.AR, Name: "العربية", Url: 'ar', Selected: false }
  ]
  language: SelectItem = new SelectItem()

  moduleList: UserPagesViewModel[] = []
  tourList:TourList =  new TourList()


  constructor(
    private sharedService: SharedService,
    private _localizationService: LocalizationService,
    private _layoutService: LayoutService,
    private _userService: LoggedUserService,
    private _CSSFilesService:CSSFilesService
  ) { }

  ngOnInit(): void {
    // this._localizationService.setLanguage('en')
    if(environment.allowDynamicApi && !this.sharedService._storageService.hasApi()){
      this.sharedService.logOut()
    } 
    this.initializePage()
  }
  getUserPages() {
    this._userService.getUserPages().subscribe(res => {
      if (res.Success) {
        SharedService.pageList = this.sharedService.getPageList(res.Data)
        this.page.isPageLoaded = true
      }
    })
  }

  initializePage() {
    if (this._localizationService.getCurrentLanguage() != this._localizationService.getLanguage()) {
      window.location.reload();
      return;
    }
    this.getUserPages()
    forkJoin([
      this._layoutService.getMainInfo(),
    ]).subscribe((res) => {
      this.user = res[0].Data
      this.page.isPageLoaded = true
    }, (err) => {
      if (err == 401) {
        // this.sharedService.router.navigateByUrl("/login"),
        this.sharedService.logOut()
      }
    })
    if (this._localizationService.getLanguage() == 'ar') {
      this.language = this.languageList[1]
    }
    else {
      this.language = this.languageList[0]
    }
    this._CSSFilesService.changeStyle(this.language.Url )
  }


  closeOrOpenSideMenu(value) {
    this.closeSideMenu = value
  }
  enterLeaveSideMenu(value) {
    this.enterSideMenu = value
  }

  getCurrentModule(): string {
    return this.sharedService.getCurrentMoudleName()
  }



  changeLanguage(index) {
    let oldLang: LanguageTypeEnum = this._localizationService.getLanguage() == "ar" ? LanguageTypeEnum.AR : LanguageTypeEnum.EN
    if (oldLang == this.languageList[index].ID) return;
    this.language = this.languageList[index]
    this._localizationService.setLanguage(this.language.Url);
    this.updateUserLanguage(this.language.ID)
  }
  updateUserLanguage(lang: LanguageTypeEnum) {
    this._userService.updateLanguage(lang).subscribe(res => {
      window.location.reload()
    }, (err) => window.location.reload())
  }

  showPushNotificationFlag: boolean = false;

  showPushNotification() {
    this.showPushNotificationFlag = true
    setTimeout(() => {
      this.showPushNotificationFlag = false
    }, 100);
  }
  pageEnum = PageEnum
  hasPage(page: PageEnum) {
    return SharedService.pageList.some(i => i.ID == page)
  }

  startTour(){
    this.sharedService.fireEventSartTour(this.getSelectedTourStep().ID)
  }
  getSelectedTourStep() {
    return this.tourList.SearchByList.find(i => i.ID == this.tourList.SearchValue)
  }
}
