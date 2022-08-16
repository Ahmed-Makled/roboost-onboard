import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { FeatureEnum } from '../enum/feature.enum';
import { SharedService } from '../service/shared.service';
import { TokenService } from '../service/token.service';

@Injectable()

export class FeatureGuardService implements CanActivate {
  constructor(public _tokenService: TokenService, public _sharedService: SharedService,) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    let featureList:FeatureEnum[] = route.data["featureList"]
    let homeRoute = route.data["homeRoute"]
    if (featureList && SharedService.featureList.some(i=>featureList.some(x=>x == i))) {
      this._sharedService.router.navigate([homeRoute]);
      return false;
    }
    return true;
  }
}