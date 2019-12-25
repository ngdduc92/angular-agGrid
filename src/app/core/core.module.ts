import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MenuNavComponent } from './menunav/menunav.component';
import { SideNavComponent } from './sidenav/sidenav.component';
import { RailincCommonModule } from '@railinc/rl-common-ui-lib';

@NgModule({
  declarations: [
    MenuNavComponent,
    SideNavComponent
  ],
  imports: [
    SharedModule,
    RailincCommonModule
  ],
  exports : [
    MenuNavComponent,
    SideNavComponent
  ]
})
export class AppCoreModule { }
