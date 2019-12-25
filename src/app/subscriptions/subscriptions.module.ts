import { NgModule } from '@angular/core';
import { SubscriptionsComponent } from './subscriptions.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ROUTES } from './subscriptions.routes';

@NgModule({
  bootstrap: [SubscriptionsComponent],
  declarations: [SubscriptionsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES)
  ],
})
export class SubscriptionsModule { }

