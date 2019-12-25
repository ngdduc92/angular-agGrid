import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SharedModule } from './shared/shared.module';
import { BlockUIModule } from 'ng-block-ui';
import { BlockUIHttpModule } from 'ng-block-ui/http';
import { NoMarkModule } from './no-mark/no-mark.module';
import {
  RailincCoreModule,
  RailincErrorHandlerService,
  RailincUserService,
  PermissionService,
  RAILINC_GUARDS,
  RAILINC_INTERCEPTOR_PROVIDERS
} from '@railinc/rl-common-ui-lib';
import {
  UserMarkSelectionModalModule,
  UserMarkSelectionModalComponent
} from '@railinc/rl-modals-lib';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AppCoreModule } from './core/core.module';

// Root Level Routes
import { ROUTES } from './app.routes';

// App is our top level component
import { AppComponent } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { NoContentComponent } from './no-content';

import {HttpClientModule, HttpRequest} from '@angular/common/http';
import { AppLoadService } from './core/core.service';

import '../styles/index.scss';
import { DatePipe } from '@angular/common';

export function initApp(
  appLoadService: AppLoadService,
  userService: RailincUserService
) {
  return () => {
    return appLoadService.loadUserProfile().then(user => {
      const marksList = appLoadService.getUserMarks(user);
      userService.setMarkList(marksList);

      const perms = user['permissions'];
      const roles = appLoadService.getRolesBasedOnMark(
        perms,
        userService.SELECTED_MARK
      );

      const roleArray = roles.map(r => r.role);
      // permissionService.loadPermissions(roleArray);
    });
  };
}

export function filterHttpRequest(req: HttpRequest<any>): boolean {
  const markRequests = [
    'manage/masterDrafts/refreshData',
    'manage/masterDrafts/massUpdate',
    'manage/masterDrafts/massValidate',
    'manage/masterDrafts/commitChanges',
  ]
  let isSkipRequest = false
  markRequests.forEach(markRequest => {
    if (req.url.indexOf(markRequest) > -1) { isSkipRequest = true; }
  })
  return isSkipRequest;
}

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    NoContentComponent,
    AlertDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RailincCoreModule.forRoot({ appId: 'sco90' }),
    BlockUIModule.forRoot(),
    BlockUIHttpModule.forRoot({
      blockAllRequestsInProgress: true,
      requestFilters: [filterHttpRequest]
    }),
    ToastrModule.forRoot(),
    SharedModule,
    RouterModule.forRoot(ROUTES, {
      useHash: true
    }),
    UserMarkSelectionModalModule,
    NoMarkModule,
    AppCoreModule
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    AppState,
    ...RAILINC_GUARDS,
    ToastrService,
    PermissionService,
    RailincErrorHandlerService,
    ...RAILINC_INTERCEPTOR_PROVIDERS,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AppLoadService, RailincUserService],
      multi: true
    },
    DatePipe
  ],
  entryComponents: [UserMarkSelectionModalComponent, AlertDialogComponent]
})
export class AppModule {
  constructor() {}
}
