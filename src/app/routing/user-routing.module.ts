import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';
import { UserLayoutComponent } from '../components/user/layout/layout.component';

export const routes: Routes = [
  {
    path:'',
    component:UserLayoutComponent,
    children:[
      {
        path:'',
        loadChildren: () => import('../components/user/home/user-home.module').then(m => m.UserHomeModule),
        // canActivate: [AuthGuardService], data: { pageList: [PageEnum.Tasks_Recent] }
      },
      {
        path:'profile',
        loadChildren: () => import('../components/user/profile/user-profile.module').then(m => m.UserProfileModule),
      },
    ],
    
  },
]

@NgModule({
  declarations: [UserLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),SharedModule
  ],
})

export class UserRoutingModule { }
