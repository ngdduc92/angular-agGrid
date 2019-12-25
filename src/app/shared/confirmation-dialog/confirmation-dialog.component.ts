import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: 'confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent implements OnInit {
  title = 'Confirmation'
  message = 'Are you sure?';
  confirmButtonText = 'Yes';
  cancelButtonText = 'Cancel';
  dialogType = 'confirm';
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<ConfirmationDialogComponent>) {
    if (data) {
      this.dialogType = data.dialogType || this.dialogType;
      this.title = data.title || this.title;
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  ngOnInit() {
  }

  getConfirmClass() {
    if (this.dialogType == 'confirm') {
      return 'primary'
    } else if (this.dialogType == 'warning') {
      return 'warn';
    } else if (this.dialogType == 'accent') {
      return 'accent';
    }
  }
  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }
}
