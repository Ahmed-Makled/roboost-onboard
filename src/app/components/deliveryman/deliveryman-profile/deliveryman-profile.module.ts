import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { PerformanceComponent } from './_partial/performance/performance.component';
import { RewardsWalletComponent } from './_partial/rewards-wallet/rewards-wallet.component';
import { PersonalInfoComponent } from './_partial/personal-info/personal-info.component';
import { ShiftPerformanceComponent } from './_partial/shift-performance/shift-performance.component';

export const routes: Routes = [
  {path:':id',component:IndexComponent},
]
@NgModule({
  declarations: [IndexComponent , PerformanceComponent , RewardsWalletComponent , ShiftPerformanceComponent,
    PersonalInfoComponent],
  imports: [
    CommonModule,RouterModule.forChild(routes),SharedModule ,
    NgCircleProgressModule.forRoot({
      "outerStrokeWidth": 14,
      "innerStrokeWidth": 14,
      "space":-14,
      "radius": 100,
      "innerStrokeColor": "#EBECF0",
      "titleFontSize": "20",
      "subtitleFontSize": "20",
      "unitsFontSize": "20",
      "titleColor": "#112A4E",
      "subtitleColor": "#112A4E",
      "animationDuration": 600,
      "showSubtitle": true,
      "showUnits": true,
      "responsive": true,
      "animation": true,
    })
    
  ]
})
export class DeliverymanProfileModule { }
