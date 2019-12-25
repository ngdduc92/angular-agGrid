import { Routes } from '@angular/router';
import { NoContentComponent } from './no-content';
import { NoMarkComponent } from './no-mark/no-mark.component';
import { LoggedInGuard, MarkSelectedGuard, RoleCheckGuard } from '@railinc/rl-common-ui-lib';
import { roles } from 'src/app/shared/roles';

export const ROUTES: Routes = [
  {
    path: 'home',
    loadChildren: "./home#HomeModule",
    canActivate: [LoggedInGuard, MarkSelectedGuard]
  },
  {
    path: 'data-manager',
    loadChildren: "./data-manager#DataManagerModule",
    canActivate: [LoggedInGuard, MarkSelectedGuard, RoleCheckGuard],
    data: {
      roles: [
        roles.SCO90USR,
        roles.SCO90ROUSR,
        roles.SCO90CSCUSR,
        roles.SCO90APPADM,
        roles.SCO90COMPADM
      ]
    }
  },
  {
    path: 'reports',
    loadChildren: "./reports#ReportsModule",
    canActivate: [LoggedInGuard, MarkSelectedGuard, RoleCheckGuard],
    data: {
      roles: [
        roles.SCO90USR,
        roles.SCO90ROUSR,
        roles.SCO90CSCUSR,
        roles.SCO90APPADM,
        roles.SCO90COMPADM
      ]
    }
  },
  {
    path: 'admin',
    loadChildren: "./admin#AdminModule",
    canActivate: [LoggedInGuard, MarkSelectedGuard, RoleCheckGuard],
    data: {
      roles: [
        roles.SCO90APPADM
      ]
    }
  },
  {
    path: 'subscriptions',
    loadChildren: "./subscriptions#SubscriptionsModule",
    canActivate: [LoggedInGuard, MarkSelectedGuard, RoleCheckGuard],
    data: {
      roles: [
        roles.SCO90COMPADM
      ]
    }
  },
  {
    path: 'user-guide',
    loadChildren: "./user-guide#UserGuideModule",
    canActivate: [LoggedInGuard, MarkSelectedGuard]
  },
  { 
    path: 'no-mark',
    component: NoMarkComponent,
    canActivate: [LoggedInGuard]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: NoContentComponent }
];
