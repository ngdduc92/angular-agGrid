import { NgModule } from '@angular/core';
import { ReportsComponent } from './reports.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ROUTES } from './reports.routes';

@NgModule({
  bootstrap: [ReportsComponent],
  declarations: [ReportsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES)
  ],
})
export class ReportsModule { }

