import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ROUTES } from './admin.routes';

@NgModule({
  bootstrap: [AdminComponent],
  declarations: [AdminComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class AdminModule { }
