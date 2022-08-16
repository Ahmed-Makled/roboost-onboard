import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'create', component: CreateComponent },
  { path: 'edit/:id', component: CreateComponent },
  {
    path: 'performance',
    loadChildren: () => import('../area-performance/branch-area-performance.module').then(m => m.BranchAreaPerformanceModule),
  },
]
@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), SharedModule,
  ],
  declarations: [IndexComponent, CreateComponent]
})
export class BranchAreaModule { }
