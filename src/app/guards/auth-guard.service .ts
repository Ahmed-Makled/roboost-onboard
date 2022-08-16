import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { PageEnum } from '../enum/page.enum';
import { SharedService } from '../service/shared.service';
import { TokenService } from '../service/token.service';

@Injectable()

export class AuthGuardService implements CanActivate {
  constructor(public _tokenService: TokenService, public _sharedService: SharedService,) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    let pageList:PageEnum[] = route.data["pageList"]
    if (!this._tokenService.isAuthenticated()) {
      this._sharedService.router.navigate(['/login']);
      return false;
    }
    // if (pageList && !this._sharedService._storageService.getUserPages().some(i=>pageList.some(x=>x == i))) {
    //   this._sharedService.router.navigate(['/not-authorized']);
    //   return false;
    // }
    
    return true;
  }
}