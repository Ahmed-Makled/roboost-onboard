import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';
import { LiveOperationLayoutComponent } from '../components/live-operation/layout/layout.component';
import { AuthGuardService } from '../guards/auth-guard.service ';
import { PageEnum } from '../enum/page.enum';

export const routes: Routes = [
  {
    path: '', 
    component:LiveOperationLayoutComponent,
    children: [
      {
        path: '', redirectTo: 'live-dashboard', pathMatch: 'full'
      },
      {
        path: 'live-dashboard',
        loadChildren: () => import('../components/live-operation/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Live_Operation_Dashboard] }
      },
    ],
    canActivate: [AuthGuardService], data: { pageList: [PageEnum.Live_Operation] }
  },
]

@NgModule({
  declarations: [LiveOperationLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), SharedModule
  ],
})

export class LiveOperationRoutingModule { }
