import { MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MENU_OPTIONS } from './menu-options.enum';
import { Router } from '@angular/router';

import { HttpEvent } from '@angular/common/http';
import { UserMarkSelectionModalComponent } from '@railinc/rl-modals-lib';
import {
  IRailincSSOUser,
  AccountSearchTypes,
  RailincUserService,
  NoAccountSelectedModalComponent,
  PermissionService,
  UnauthorizedAccountModalComponent,
  AccountListErrorModalComponent,
  LoginErrorComponent,
  SessionTimeoutModalComponent,
  IRailincUserRole,
  RailincErrorHandlerService,
  RailincSessionTimeoutService
} from '@railinc/rl-common-ui-lib';

@Component({
  selector: 'app',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  user: IRailincSSOUser;
  applicationName = 'SCO90';
  applicationList: any[];
  accountList: string[];
  menuOptions: any[] = MENU_OPTIONS;
  showTopmenu = true;
  showSidenav = false;
  sidenavPosition = 'start';
  sidenavMode = 'side';
  isSidenavExpanded = false;
  showAccountList = false;
  accountListType: AccountSearchTypes = AccountSearchTypes.TYPEAHEAD;
  showMarkSelection = true;
  timeoutModalOpen = false;

  constructor(
    private userService: RailincUserService,
    private toastrService: ToastrService,
    private permissionService: PermissionService,
    private errorService: RailincErrorHandlerService,
    private timeoutService: RailincSessionTimeoutService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    setTimeout(() => {
      // Handler Application Errors
      this.errorService.onServiceError.subscribe(errorMessages => {
        this.toastrService.error(
          errorMessages.map(error => error.message).join('<br/>')
        );
      });

      // Handle Session Timeout
      this.timeoutService.onSessionTimeout.subscribe(response => {
        if (!this.timeoutModalOpen) this.showTimeoutModal(response);
      });

      // Handle no mark selected
      this.userService.onNoMarkSelectedError.subscribe(blockedURL => {
        this.router.navigate(['/no-mark']);

        this.showUserMarkSelectionModal(blockedURL);
      });

      this.userService.onMarkClick.subscribe(t => {
        this.showUserMarkSelectionModal();
      });

      this.user = this.userService.SSO_USER;

      var selectedMark = this.userService.SELECTED_MARK;
      if (selectedMark && selectedMark.length) {
        this.setRolesBasedOnMark(selectedMark);
      }

      this.userService
        .getApplications()
        .catch(error => {
          this.showAppListToast();
          return Observable.throw([]);
        })
        .subscribe(applicationList => {
          this.applicationList = applicationList;
        });

      this.userService.onLoginFailure.debounceTime(250).subscribe(failure => {
        this.showSSOUserError();
      });

      this.permissionService.onUnauthorizedRoute
        .debounceTime(250)
        .subscribe(error => {
          this.showUnauthorizedRouteModal();
        });

      if (this.showAccountList) {
        this.userService
          .getAccountList()
          .catch(e => {
            this.showAccountListError();
            return Observable.throw([]);
          })
          .subscribe(accountList => {
            this.accountList = accountList;
          });

        this.userService.onAccountChage.debounceTime(250).subscribe(account => {
          this.toastrService.info(
            'New Account Selected: ' + this.userService.SELECTED_ACCOUNT
          );
        });

        this.userService.onNoAccountSelected
          .debounceTime(10)
          .subscribe(error => {
            this.showNoAccountSelectedModal();
          });
      }
    }, 0);
  }

  handleExpandedSidenav($event) {
    this.isSidenavExpanded = $event;
  }

  handleSelectSidenavItem($event) {
    this.menuOptions = $event;
  }

  private showTimeoutModal(response: HttpEvent<any>) {
    this.timeoutModalOpen = true;
    let matDialogRef = this.dialog.open(SessionTimeoutModalComponent);

    setTimeout(t => {
      matDialogRef = this.dialog.open(SessionTimeoutModalComponent);
    }, 500);

    matDialogRef.afterClosed().subscribe(data => {
      this.timeoutModalOpen = false;

      if (response['url']) {
        response['url'] = response['url'].replace(
          /(.*)&TARGET.*/,
          '$1&TARGET=-SM-' + encodeURIComponent(window.location.href)
        );
      }

      window.location.href = response['url'] || '/zuul/fcc/railinc.fcc';
    });
  }

  private showUnauthorizedRouteModal() {
    const matDialogRef = this.dialog.open(UnauthorizedAccountModalComponent);
    matDialogRef.afterClosed().subscribe(result => {
      // Handle unauthorized
    });
  }

  private showNoAccountSelectedModal() {
    const matDialogRef = this.dialog.open(NoAccountSelectedModalComponent);
    matDialogRef.afterClosed().subscribe(result => {
      // Handle exit error modal click
    });
  }

  private showAccountListError() {
    const matDialogRef = this.dialog.open(AccountListErrorModalComponent);
    matDialogRef.afterClosed().subscribe(result => {
      // Handle exit error modal click
    });
  }

  private showSSOUserError() {
    const matDialogRef = this.dialog.open(LoginErrorComponent);
    matDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  private showAppListToast() {
    this.toastrService.error('Unable to load User Applications');
  }

  private showUserMarkSelectionModal(blockedUrl?: string) {
    const markList = this.userService.getMarkList();

    const dialogRef = this.dialog.open(UserMarkSelectionModalComponent, {
      disableClose: true,
      width: '350px',
      data: { userMarks: markList }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      const selectedMark = result;

      if (selectedMark && selectedMark.length) {
        this.setRolesBasedOnMark(selectedMark);

        this.userService.setSelectedMark(selectedMark);

        this.router.navigate([`/home`]);

        this.userService.onMarkChanged.next();
        this.toastrService.info('Mark has been changed to: ' + selectedMark);
      }
    });
  }

  private setRolesBasedOnMark(selectedMark?: string) {
    const roleArray = [];

    this.user['permissions'].forEach(_role => {
      const roleMarks =
        _role.entities && _role.entities.length ? _role.entities : [];
      
      let hasRoleMark = roleMarks.find( roleMark => roleMark['entity'] === selectedMark );
      const hasCompany: boolean = hasRoleMark || !_role.entities.length;

      if (hasCompany) roleArray.push({ role: _role.roleId });
    });

    this.permissionService.setRoleArray(roleArray);
  }
}
