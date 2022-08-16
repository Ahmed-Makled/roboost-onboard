import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryPenalizeComponent } from './index/index.component';

export const routes: Routes = [
  {path:'',component:DeliveryPenalizeComponent},
 
]
@NgModule({
  imports: [
    CommonModule,RouterModule.forChild(routes),SharedModule
  ],
  declarations: [DeliveryPenalizeComponent]

})
export class DeliverymanPenalizeModule { }
