import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryShiftComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {path:'',component:DeliveryShiftComponent},
 
]
@NgModule({
  imports: [
    CommonModule,RouterModule.forChild(routes),SharedModule
  ],
  declarations: [DeliveryShiftComponent]

})
export class DeliverymanShiftModule { }
