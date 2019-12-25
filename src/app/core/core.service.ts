import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { RailincUserService } from '@railinc/rl-common-ui-lib';

@Injectable({
  providedIn: 'root'
})
export class AppLoadService {
  constructor(private userService: RailincUserService) {}

  loadUserProfile(): Promise<any> {
    //TODO: replace with app's endpoint
    this.userService.setSSOEndpoint("/sco90-service/users/current");
    this.userService.setChiliEndpoint("/sco90-service/chili/s/apps.json");

    const promise = this.userService.getSSOUser().toPromise();

    return promise;
  }

  getUserMarks(user) {
    const marks = [];
    user['permissions'].filter(item => {
      if (item.roleId.startsWith('SCO90')) {
        if (item.entities.length) {
          item.entities.map(entity => marks.push(entity.entity));
        }
      }
    });

    return Array.from(new Set(marks));
  }

  getRolesBasedOnMark(permissions, selectedMark?: string) {
    const roleArray = [];

    permissions
      .filter(_perm => (_perm.roleId.startsWith('SCO90') ? _perm : null))
      .forEach(_role => {
        const roleMarks =
          _role.entities && _role.entities.length ? _role.entities : [];

        // add to rolleArray if role does not require a mark
        if (roleMarks.length === 0) {
          roleArray.push({ role: _role.roleId });
        }

        roleMarks.forEach(_mark => {
          const hasMark: boolean = _mark.entity === selectedMark;
          if (hasMark) {
            roleArray.push({ role: _role.roleId });
          }
        });
      });

    return roleArray;
  }
}
