import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from '../call-center/index/index.component';
import { PersonalInfoComponent } from './_partial/personal-info/index/index.component';
import { BranchesComponent } from './_partial/branches/index/index.component';
import { OrdersComponent } from './_partial/orders/index/index.component';
import { OrdersPerformanceComponent } from './_partial/orders-performance/index/index.component';


export const routes: Routes = [
  {path:':id',component:IndexComponent},
 
]

@NgModule({
  declarations: [IndexComponent,PersonalInfoComponent,BranchesComponent,OrdersComponent
  ,OrdersPerformanceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),SharedModule
  ],
})
export class CallCenterModule { }
