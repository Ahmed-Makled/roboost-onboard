import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedService } from '../../../service/shared.service';
import { UserViewModel } from '../layout/view-model/user.model';
import { LoginService } from '../../login/login.service';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  item: UserViewModel = new UserViewModel()
  openTrip: boolean = false
  mobileView: boolean = window.innerWidth < 500
  @Output() closeOrOpenSideMenu: EventEmitter<boolean> = new EventEmitter();
  @Output() enterLeaveSideMenu: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private sharedService: SharedService,
    private _loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.initializePage()
  }
  initializePage() {
    // this._sidemMenuService.getUserLogin().subscribe((res) => {
    //   if (res.Success)
    //     this.item = res.Data
    // })
  }
  getCurrentRoute(): string {
    return this.sharedService.getCurrentRoute()
  }
  getCurrentMoudleName(): string {
    return "/"+this.sharedService.getCurrentMoudleName()
  }
  getCurrentSubMoudleName(): string {
    return this.getCurrentMoudleName()+"/"+this.sharedService.getCurrenPageName()
  }
  enterORLeaveSideMenu(value) {
    if (!this.mobileView)
      this.enterLeaveSideMenu.emit(value)
  }
  closeSideMenu() {
    this.closeOrOpenSideMenu.emit(false)
  }
  // openCloseTrip() {
  //   this.openTrip = !this.openTrip
  //   console.log(this.openTrip)
  //   this.closeOrOpenSideMenu.emit(this.openTrip)
  // }

  logout() {
    this._loginService.logout().subscribe(res=>{
      this.sharedService.logOut()
    },()=>{
      this.sharedService.logOut()
    })
  }

  getPageList(){
    return SharedService.pageList.filter(i=>i.ParentPageID == null)
  }
  getPageRouteName(id:number):string{
    return SharedService.pageList.some(i=>i.ParentPageID == id)?
    this.getPageRouteName(this.getFirstChild(id).ID):
    SharedService.pageList.find(i=>i.ID == id).Url
  }
  getFirstChild(id:number){
    let order = Math.min(...SharedService.pageList.filter(i=>i.ParentPageID == id).map(i=>i.DisplayOrder))
    return  SharedService.pageList.filter(i=>i.ParentPageID == id).find(i=>i.DisplayOrder == order)
  }
  
  getSubPageList(id:number){
    return SharedService.pageList.filter(i=>i.ParentPageID == id && i.ShowInMenu)
  }
  isLtr():boolean{
    return this.sharedService.isLTR()
  }

}
