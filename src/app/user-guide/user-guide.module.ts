import { NgModule } from '@angular/core';
import { UserGuideComponent } from './user-guide.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ROUTES } from './user-guide.routes';

@NgModule({
  bootstrap: [UserGuideComponent],
  declarations: [UserGuideComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES)
  ],
})
export class UserGuideModule { }

