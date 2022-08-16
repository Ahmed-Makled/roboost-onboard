import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';
import { FristLayoutComponent } from '../components/system-config/layout/frist-layout/frist-layout.component';
import { SystemSecondLayoutComponent } from '../components/system-config/layout/second-layout/layout.component';
import { AuthGuardService } from '../guards/auth-guard.service ';
import { PageEnum } from '../enum/page.enum';

export const routes: Routes = [
  {
    path: '',
    component: FristLayoutComponent,
    children: [
      {
        path: '',
        component: SystemSecondLayoutComponent,

        children: [
          // {
          //   path: '', redirectTo: 'page', pathMatch: 'full'
          // },
          {
            path: 'page',
            children: [
              // {
              //   path: '', redirectTo: 'home', pathMatch: 'full'
              // },
              {
                path: 'home',
                loadChildren: () => import('../components/system-config/pages/page.module').then(m => m.PagesRoleModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.System_Page_Home] }
              },
              {
                path: 'role',
                loadChildren: () => import('../components/system-config/role-page/role-page.module').then(m => m.RolePageModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.System_Page_Role] }
              },
              {
                path: 'company',
                loadChildren: () => import('../components/system-config/company-page/company-page.module').then(m => m.CompanyPageModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.System_Page_Company] }
              },
            ],
            canActivate: [AuthGuardService], data: { pageList: [PageEnum.System_Page] }
          },
          {
            path: 'feature',
            children: [
              // {
              //   path: '', redirectTo: 'module', pathMatch: 'full'
              // },
              {
                path: 'module',
                loadChildren: () => import('../components/system-config/module-feature/module-feature.module').then(m => m.ModuleFeatureModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.System_Feature_Module] }
              },
              {
                path: 'role',
                loadChildren: () => import('../components/system-config/role-feature/role-feature.module').then(m => m.RoleFeatureModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.System_Feature_Role] }
              },
              {
                path: 'company',
                loadChildren: () => import('../components/system-config/company-feature/company-feature.module').then(m => m.CompanyFeatureModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.System_Feature_Company] }
              },
            ],
            canActivate: [AuthGuardService], data: { pageList: [PageEnum.System_Feature] }
          },

        ]
      },
    ],
  },
]

@NgModule({
  declarations: [FristLayoutComponent, SystemSecondLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), SharedModule
  ],
})

export class SystemConfigRoutingModule { }
