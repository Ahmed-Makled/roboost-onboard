import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { OrderByBranchComponent } from './by-branch.component';

export const routes: Routes = [
  { path: '', component: OrderByBranchComponent },

]

@NgModule({
  declarations: [
    OrderByBranchComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), SharedModule
  ],
})

export class OrderPerformanceStoreModule { }
