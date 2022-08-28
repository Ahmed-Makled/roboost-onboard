import { EventEmitter, Injectable, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DateService } from './date.service';
import { LogService } from './log.service';
import { TokenService } from './token.service';
import { LocalizationService } from './localization.service';
import { PageOptions } from 'src/app/model/shared/page-options.model';
import { SaveFilterationViewModel } from 'src/app/model/shared/save-filteration.model';
import { ResponseViewModel } from 'src/app/model/shared/response.model';
import { TripStatus } from '../enum/trip-status';
import { ApplicationRole } from '../enum/application-role';
import { environment } from 'src/environments/environment';
import { HotkeysService } from 'angular2-hotkeys';
import * as moment from 'moment';
import { DeliveryStatus } from '../enum/delivery-status';
import { UserPagesViewModel } from '../components/logged-user/view-model/logged-user.model';
import { ScreenSize } from '../enum/screen-size';
import { FeatureEnum } from '../enum/feature.enum';
import { StorageService } from './storage.service';
import { TripRateOption } from '../enum/trip-rate-option';
import { OrderStatus } from '../enum/order-status.enum';
import { OrderRateOption } from '../enum/order-rate-option';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  // action:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  // private subject = new Subject<any>();
  // fireAction(loaded: boolean) {
  //   this.action.next(loaded);
  // }
  // subscribeAction(): Observable<boolean> {
  //   return this.action.asObservable();
  // }
  static featureList: FeatureEnum[] = []
  static pageList: UserPagesViewModel[] = []
  @Output() parentChildEvent = new EventEmitter<{ fromParent: boolean, data: any }>();
  @Output() StartTourEvent = new EventEmitter<number>();

  fireEvent(fromParent: boolean, data?: any) {
    this.parentChildEvent.emit({ fromParent: fromParent, data: data });
  }
  
  fireEventSartTour(number) {
    this.StartTourEvent.emit(number);
  }
  constructor(
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    public modalService: BsModalService,
    public hotkeys: HotkeysService,
    public dateService: DateService,
    public _logService: LogService,
    private tokenService: TokenService,
    private _localizationService: LocalizationService,
    public _storageService: StorageService
  ) { }

  back(){
    history.back()
  }
  hasFeature(value: FeatureEnum) {
    return SharedService.featureList.some(i => i == value)
  }
  isSingleStore() {
    return this._storageService.getISSingleStore()
  }
  isImage(value: string): boolean {
    return !value.includes("uil")
  }
  getCurrentRoute(): string {
    return this.router.url.split("?")[0]
  }
  getRouteList(): string[] {
    return this.getCurrentRoute().split('/').filter(i => i != "")
  }
  getPageList(pageList: UserPagesViewModel[]): UserPagesViewModel[] {
    return pageList.map(i => { return { ...i, IsImage: this.isImage(i.Icon) } })
  }
  getPageByID(id: number) {
    return SharedService.pageList.find(i => i.ID == id)
  }
  getPageDefaultRoute(id: number): string {
    return SharedService.pageList.some(i => i.ParentPageID == id) ? this.getPageDefaultRoute(this.getFirstChild(id).ID) : SharedService.pageList.find(i => i.ID == id).Url
  }
  getFirstChild(id: number) {
    let order = Math.min(...SharedService.pageList.filter(i => i.ParentPageID == id).map(i => i.DisplayOrder))
    return SharedService.pageList.filter(i => i.ParentPageID == id).find(i => i.DisplayOrder == order)
  }
  getChildList(id: number): UserPagesViewModel[] {
    return SharedService.pageList.filter(i => i.ParentPageID == id)
  }
  getFirstLayoutCurrentChild(id: number): UserPagesViewModel {
    let routeList = this.getRouteList()
    return this.getChildList(id).find(i => i.Url == "/" + routeList[0] + "/" + routeList[1]
      && !routeList.includes("create") && !routeList.includes("details") && routeList.every(i => isNaN(+i)))
  }
  getLastLayoutCurrentChild(id: number): UserPagesViewModel {
    return this.getChildList(id).find(i => i.Url == this.getCurrentRoute())
  }

  getThirdLayoutCurrentChild(id: number): UserPagesViewModel {
    let routeList = this.getRouteList()
    return this.getChildList(id).find(i => i.Url == "/" + routeList[0] + "/" + routeList[1] + '/' + routeList[2]
      && !routeList.includes("create") && !routeList.includes("details") && routeList.every(i => isNaN(+i)))
  }
  showFirstLayout(id: number): boolean {
    return this.getChildList(id).some(i => i.ID == this.getFirstLayoutCurrentChild(id)?.ID) && this.getChildList(id).length > 1
  }
  showLastLayout(id: number): boolean {
    return this.getChildList(id).some(i => i.ID == this.getFirstLayoutCurrentChild(id)?.ID)// && this.getChildList(id).length>1 
  }


  isDevMode(): boolean {
    return !environment.production;
  }
  getScreenSize(): ScreenSize {
    let windowSize = window.innerWidth
    if (windowSize >= 1400)
      return ScreenSize.XXL
    else if (windowSize >= 1200 && windowSize < 1400)
      return ScreenSize.XL
    else if (windowSize >= 992 && windowSize < 1200)
      return ScreenSize.LG
    else if (windowSize >= 768 && windowSize < 992)
      return ScreenSize.MD
    else if (windowSize >= 576 && windowSize < 768)
      return ScreenSize.SM
    else
      return ScreenSize.XS
  }
  isMobileView(): boolean {
    return this.getScreenSize() == ScreenSize.XS
  }


  isObjectChanged(a, b): boolean {
    for (let key in a) {
      if (a[key] != b[key]) return true;
    }
  }
  getSumValues(list: any[]): number {
    return list.reduce((acc, cur) => acc + cur, 0);
  }
  getCurrentMoudleName(): string {
    return this.router.url.split('?')[0].split('/')[1];
  }
  getCurrenPageName(): string {
    return this.router.url.split('?')[0].split('/')[2]?.split('?')[0]
  }
  showToastr(response: ResponseViewModel) {
    if (response.Success) {
      this.toastr.success('', response.Message, {
        toastClass: 'successToastClass',
      });
    } else {
      this.toastr.error('', response.Message, {
        toastClass: 'errorToastClass',
      });
    }
  }
  showErrorAlert(message: string) {
    this.toastr.error('', message, {
      toastClass: 'errorToastClass',
    });
  }
  showSuccessAlert(message: string) {
    this.toastr.success('', message, {
      toastClass: 'successToastClass',
    });
  }
  logOut() {
    this.tokenService.clearUserData();
    this._storageService.removeUserPages();
    this._storageService.removeISSingleStore();
    this._storageService.removeApi();
    this.router.navigate(['/login']);
  }
  isLTR(): boolean {
    return this._localizationService.getLanguage() != 'ar';
  }
  playErrorAudio() {
    let audio = new Audio();
    audio.src = './assets/sounds/Error-sound.mp3';
    audio.load();
    audio.play();
  }
  
  getFilterationFromURL(params: any, searchForm: FormGroup, pageSort?: PageOptions, takeToDateValue: boolean = false) {
    if (Object.keys(params).length > 0) {
      for (let key in params) {
        if (key == 'orderBy' || key == 'isAscending') {
          if (pageSort) {
            pageSort.orderBy = params['orderBy'];
            pageSort.isAscending = params['isAscending'];
          }
        }
        else if (key == 'ToDate' || key == 'FromDate' || key == 'Date') {
          searchForm.get(key).setValue(new Date(params[key]));
        }
        else if (key == 'currentPage') {
          pageSort.currentPage = +params['currentPage'];
        }
        else if (key == 'pageSize') {
          pageSort.pageSize = +params['pageSize'];
        }
        else if (!isNaN(params[key]) && searchForm.get(key) != null && (!params[key].startsWith('0') || params[key] == 0)) {
          searchForm.get(key).setValue(+params[key]);
        }
        else if (searchForm.get(key)) {
          searchForm.get(key).setValue(params[key]);
        }
      }
    }
    else {
      for (let key in searchForm.controls) {
        let value = searchForm.get(key).value;
        if (key == 'ToDate') {
          if (takeToDateValue) searchForm.get(key).setValue(value);
          else searchForm.get(key).setValue(new Date());
        }
        else if (key == 'FromDate') searchForm.get(key).setValue(value);
        else if (key == 'Date') searchForm.get(key).setValue(new Date());
        else searchForm.get(key).setValue(null);
      }
    }
  }
  saveFilteration(model: SaveFilterationViewModel) {
    var params = {};
    if (model.searchForm) {
      for (let key in model.searchForm.controls) {
        let value = model.searchForm.get(key).value;
        if (value != null && value != "") {
          if (key == 'ToDate' || key == 'FromDate' || key == 'Date')
            params[key] = moment(value).format('YYYY-MM-DD');
          else params[key] = value;
        }
      }
    }
    params['orderBy'] = model.orderBy;
    params['isAscending'] = model.isAscending;
    // params['pageSize'] = model.pageSize,
    // params['currentPage'] = model.currentPage,
    params['key'] = (Math.random() * 1000).toString();
    this.router.navigate([model.pageRoute], { queryParams: params });
  }
  saveFilterationNgModel(pageRoute: string, searchForm: any[] = []) {
    var params = {};
    searchForm.forEach((element) => {
      if (element.key == 'ToDate' || element.key == 'FromDate')
        params[element.key] = moment(element.value).format('YYYY-MM-DD');
      else params[element.key] = element.value;
    });
    params['key'] = (Math.random() * 1000).toString();
    this.router.navigate([pageRoute], { queryParams: params });
    this.router.navigate([pageRoute], { queryParams: params });
  }
  getFilterationURLNgModel(params: any, searchForm: any[] = []) {
    for (let key in params) {
      if (key == 'ToDate' || key == 'FromDate')
        searchForm.find((i) => i.key == key).value = new Date(params[key]);
      else if (!isNaN(params[key])) {
        searchForm.find((i) => i.key == key).value = +params[key];
      }
      // else if(!params[key]){
      //   // console.log(key,params[key]);
      //   searchForm.find(i => i.key == key).value = null
      // }
      else searchForm.find((i) => i.key == key).value = params[key];
    }
  }
  getTripAnotationByStatus(tripStatus: TripStatus): any {
    let anotation: { title; content };
    switch (tripStatus) {
      // case TripStatus.READY:
      //   anotation = { title: "Ready", content: "The trip has been created and ready to dispatch." }
      //   break;
      // case TripStatus.REQUEST_IGNORED:
      //   anotation = { title: "Ignored", content: "Deliveryman did not accept the order in the given time." }
      //   break;
      // case TripStatus.REQUEST_EXPIRED:
      //   anotation = { title: "Expired", content: "Order did not reach the deliveryman’s phone due to bad internet connection, or expired mobile internet bundle." }
      //   break;
      case TripStatus.COMPLETED:
        anotation = {
          title: 'Completed',
          content:
            'All orders have been delivered and the deliveryman has finished his trip.',
        };
        break;
      case TripStatus.DELIVERED:
        anotation = {
          title: 'Delivered',
          content:
            'All orders have been delivered, but the deliverymen has yet to finish the trip and scan the QR code. ',
        };
        break;
    }
    return anotation;
  }
  getDomainName(): string {
    return window.location.href.split('://')[1].split('/')[0]
  }
  sortBy = (function () {
    var toString = Object.prototype.toString,
      // default parser function
      parse = function (x) { return x; },
      // gets the item to be sorted
      getItem = function (x) {
        var isObject = x != null && typeof x === "object";
        var isProp = isObject && this.prop in x;
        return this.parser(isProp ? x[this.prop] : x);
      };
    return function sortby(array, prop) {
      if (!(array instanceof Array && array.length)) return [];
      if (toString.call(prop) !== "[object Object]") prop = {};
      if (typeof prop.parser !== "function") prop.parser = parse;
      prop.desc = !!prop.desc ? -1 : 1;
      return array.sort(function (a, b) {
        a = getItem.call(prop, a);
        b = getItem.call(prop, b);
        return prop.desc * (a < b ? -1 : +(a > b));
      });
    };
  }());
  downloadFile(data: any, fileName: string) {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    anchor.download = fileName + ' ' + new Date().toLocaleDateString() + ' .xls';
    anchor.href = url;
    anchor.click();
  }
  
}

export function bound(target: Object, propKey: string | symbol) {
  var originalMethod = (target as any)[propKey] as Function;
  // Ensure the above type-assertion is valid at runtime.
  if (typeof originalMethod !== "function") throw new TypeError("@bound can only be used on methods.");
  if (typeof target === "function") {
    // Static method, bind to class (if target is of type "function", the method decorator was used on a static method).
    return {
      value: function () {
        return originalMethod.apply(target, arguments);
      }
    };
  } else if (typeof target === "object") {
    // Instance method, bind to instance on first invocation (as that is the only way to access an instance from a decorator).
    return {
      get: function () {
        // Create bound override on object instance. This will hide the original method on the prototype, and instead yield a bound version from the
        // instance itself. The original method will no longer be accessible. Inside a getter, 'this' will refer to the instance.
        var instance = this;
        Object.defineProperty(instance, propKey.toString(), {
          value: function () {
            // This is effectively a lightweight bind() that skips many (here unnecessary) checks found in native implementations.
            return originalMethod.apply(instance, arguments);
          }
        });
        // The first invocation (per instance) will return the bound method from here. Subsequent calls will never reach this point, due to the way
        // JavaScript runtimes look up properties on objects; the bound method, defined on the instance, will effectively hide it.
        return instance[propKey];
      }
    } as PropertyDescriptor;
  }
}
