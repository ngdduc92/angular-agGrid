import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'alert-dialog',
  templateUrl: './alert-dialog.component.html'
})

export class AlertDialogComponent implements OnInit {
  title = this.data.title;
  message = this.data.message;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data
  ) {}

  ngOnInit() {
  }
}