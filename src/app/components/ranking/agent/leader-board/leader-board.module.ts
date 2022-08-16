import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { DeliverymenRankingComponent } from './deliverymen-ranking/deliverymen-ranking.component';

export const routes: Routes = [
  {path:'',component:DeliverymenRankingComponent},

]
@NgModule({
  imports: [
    CommonModule,RouterModule.forChild(routes),SharedModule
  ],
  declarations: [DeliverymenRankingComponent]
})
export class LeaderBoardModule { }
