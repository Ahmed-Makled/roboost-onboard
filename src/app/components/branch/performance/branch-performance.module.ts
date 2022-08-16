import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceComponent } from './index/performance.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';



export const routes: Routes = [
  {path: '', component: PerformanceComponent},
]


@NgModule({
  declarations: [
    PerformanceComponent
  ],
  imports: [
    CommonModule,RouterModule.forChild(routes), SharedModule
  ]
})
export class BranchPerformanceModule { }
