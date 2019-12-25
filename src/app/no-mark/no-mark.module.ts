import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoMarkComponent } from './no-mark.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NoMarkComponent],
  exports : [NoMarkComponent]
})
export class NoMarkModule { }
