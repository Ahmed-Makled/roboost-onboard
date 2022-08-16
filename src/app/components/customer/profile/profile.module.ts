import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { BranchesComponent } from './_partial/branches/index/index.component';
import { PersonalInfoComponent } from './_partial/personal-info/index/index.component';
import { OrdersComponent } from './_partial/orders/index/index.component';
import { OrdersPerformanceComponent } from './_partial/orders-performance/index/index.component';

export const routes: Routes = [
  { path: ':id', component: ProfileComponent },

]

@NgModule({
  declarations: [PersonalInfoComponent,BranchesComponent,OrdersComponent
    ,OrdersPerformanceComponent,ProfileComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), SharedModule
  ]
})
export class ProfileModule { }
