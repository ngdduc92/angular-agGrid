import {DatePipe} from '@angular/common';
import {Component, EventEmitter, HostListener, Inject, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TableConfigModel} from '../../models/table-config.model';
import {ConfirmationDialogComponent} from '../../shared/confirmation-dialog/confirmation-dialog.component';
import {DATA_MANAGER_MESSAGES, ErrorMessages} from '../data-manager.enum';
import {DataManagerService} from '../data-manager.service';

@Component({
  selector: 'app-base-edit',
  templateUrl: './base-edit.component.html',
  styleUrls: ['./base-edit.component.css'],
  providers: [DatePipe]
})
export class BaseEditComponent implements OnInit {
  @Input() templateRef: TemplateRef<any>;
  @Output() cancelButtonClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  protected wasFormChanged = false;
  public tableConfig = new TableConfigModel;
  public messageEnum = DATA_MANAGER_MESSAGES;
  today = new Date().toDateString();
  minDate = new Date().toDateString();
  maxDate = new Date(9999, 11, 31).toDateString();
  errorMessages: ErrorMessages[];
  isAlertSuccess = false;
  isDisableForm = false;
  onSuccessEvent = new EventEmitter();
  oldEffectiveDate: string;
  canChangeEffectiveDate = false;
  startDateFilter = (d): boolean => {
    return true;
    const day = d.toDate();
    return day >= this.today;
  }

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      public fb: FormBuilder,
      public dialog: MatDialog,
      public dialogRef: MatDialogRef<any>,
      public datePipe: DatePipe,
      public dataManagerService: DataManagerService
  ) {
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.minDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.maxDate = this.datePipe.transform(new Date(this.maxDate), 'yyyy-MM-dd');
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    //this.onCancelDialog();
  }
  ngOnInit() {
    this.tableConfig = this.data.tableConfig;
  }

  public formChanged() {
    this.wasFormChanged = true;
  }

  protected markAsDirty(group: FormGroup) {
    group.markAsDirty();
    for (const i in group.controls) {
      group.controls[i].markAsDirty();
    }
  }

  protected checkDates(group: FormGroup) {
    //if (group.controls.expirationDate.value < group.controls.effectiveDate.value) {
    //  return { notValid: true };
    //}
    return null;
  }

  onCancelDialog(group) {
    if (group.dirty) {
      const dialogConfirmRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: this.messageEnum.cancelFormConfirmMessage,
          buttonText: {
            ok: 'Discard',
            cancel: 'Cancel'
          }
        }
      });
      dialogConfirmRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult === true) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

  getConfirmExpireTodayDialog() {
    const dialogConfirmRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogType: 'warning',
        message: this.messageEnum.expireConfirmMessage,
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });
    return dialogConfirmRef;
  }

  getConfirmRevertDialog() {
    const dialogConfirmRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: this.messageEnum.revertConfirmMessage,
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });
    return dialogConfirmRef;
  }

  public formTitle() {
    if (this.data.editType === 'Update') {
      return this.tableConfig.DisplayName + ' Data Record Detail';
    } else {
      return 'Add a Record';
    }
  }

  addNewData(sendData, editForm) {
    this.isAlertSuccess = false;
    this.dataManagerService.addTableData(this.tableConfig, sendData).subscribe (
        data => {
          this.handlePostDataRespond(data, editForm);
        },
        error => {
          console.log('Error', error);
        }
    );
  }

  expireToday(sendData, editForm) {
    const dialogConfirmRef = this.getConfirmExpireTodayDialog();
    dialogConfirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.isAlertSuccess = false;
        this.dataManagerService.expireTodayData(this.tableConfig, sendData).subscribe (
            data => {
              this.handlePostDataRespond(data, editForm);
            },
            error => {
              console.log('Error', error);
            }
        );
      }
    });
  }

  modifyData(sendData, editForm) {
    if (!this.canChangeEffectiveDate && this.oldEffectiveDate !== this.datePipe.transform(editForm.get('effectiveDate').value, 'yyyy-MM-dd')) {
      this.errorMessages = [{ErrorCode: 0, ErrorDescription: this.messageEnum.pastEffectiveDateError}];
      return;
    }
    this.isAlertSuccess = false;
    this.dataManagerService.updateTableData(this.tableConfig, sendData).subscribe (
        data => {
          this.handlePostDataRespond(data, editForm);
        },
        error => {
          console.log('Error', error);
        }
    );
  }
  
  handlePostDataRespond(data, formGroup: FormGroup) {
    if (data.Error) {
      this.errorMessages = data.Error;
    } else {
      this.errorMessages = null;
      this.setSuccessForm(formGroup);
    }
  }

  setSuccessForm(formGroup: FormGroup) {
    this.isAlertSuccess = true;
    this.wasFormChanged = false;
    formGroup.markAsPristine();
    if (this.data.editType === 'Update' && this.tableConfig.DbTableName !== 'SCO_RATE') {
      this.isDisableForm = true;
      formGroup.disable();
    }    
    this.dialogRef.addPanelClass('overlay-all-container')
    this.onSuccessEvent.emit();
  }

  getDateErrorMessage(field, typeDate ) {
    if (field.hasError('matDatepickerParse')) {
      if (this.isValidDate(field.errors.matDatepickerParse.text)){
        const daysOfMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        const dateStr = field.errors.matDatepickerParse.text;
        const month = dateStr.substr(5,2);
        const day = dateStr.substr(8,2);
        if (month < 1 || month > 12) {
          return this.messageEnum.invalidMonthError;
        } else if (day < 1 || day > daysOfMonth[month - 1]) {
          return this.messageEnum.invalidDayError;
        }
      } else {
        return typeDate === 'effective' ? this.messageEnum.effectiveDateFormatErrAlert : this.messageEnum.expirationDateFormatErrAlert;
      }
    } else if (field.hasError('required')) {
      return this.messageEnum.requiredValue;
    }
    return '';
  }
  getMarkErrorMessage(field) {
    if (field.hasError('required')) {
      return this.messageEnum.requiredValue;
    } else if (field.hasError('pattern')) {
      return this.messageEnum.markTooltipError;
    } else if (field.hasError('minlength')) {
      return this.messageEnum.minLengthError;
    }
  }
  getPoolErrorMessage(field) {
    if (field.hasError('required')) {
      return this.messageEnum.requiredValue;
    } else if (field.hasError('pattern')) {
      return this.messageEnum.splcTooltipError;
    } else if (field.hasError('minlength')) {
      return this.messageEnum.poolNumberError;
    }
  }
  getSPLCErrorMessage(field) {
    if (field.hasError('required')) {
      return this.messageEnum.requiredValue;
    } else if (field.hasError('pattern')) {
      return this.messageEnum.splcTooltipError;
    } else if (field.hasError('minlength')) {
      return this.messageEnum.minLengthError;
    }
  }
  isValidDate(dateString) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    return dateString.match(regEx);
  }
}
