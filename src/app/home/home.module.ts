import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ROUTES } from './home.routes';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class HomeModule { }
