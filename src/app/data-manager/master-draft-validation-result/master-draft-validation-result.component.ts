import {Component, Inject, OnInit} from '@angular/core';
import {DataManagerService} from '../data-manager.service';
import {DATA_MANAGER_MESSAGES, ErrorMessages, WarningMessages} from '../data-manager.enum';
import {TableConfigModel} from '../../models/table-config.model';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmationDialogComponent} from "../../shared/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-master-draft-validation-result',
  templateUrl: './master-draft-validation-result.component.html',
  styleUrls: ['./master-draft-validation-result.component.css']
})
export class MasterDraftValidationResultComponent implements OnInit {
  public messageEnum = DATA_MANAGER_MESSAGES;
  public tableConfig = new TableConfigModel;

  isAlertSuccess: boolean;
  hasValidationLoaded = false;
  isRefresh = true;
  operation = 'validate';
  mainResult = '';
  errorText = '';
  warningText = '';
  errorMessages: ErrorMessages[];
  warningMessages: WarningMessages[];
  
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
          private dialog: MatDialog,
          private dialogRef: MatDialogRef<MasterDraftValidationResultComponent>,
          private dataManagerService: DataManagerService
  ) {}

  ngOnInit() {
    const sendData = {
      'Data': [{}]
    };
    this.tableConfig = this.data.tableConfig;
    this.dataManagerService.massValidate(this.tableConfig, sendData).subscribe((data) => {
      this.handleMassValidateRespond(data);
    });
  }
  onCancel() {
    this.dialogRef.close(false);
  }

  onCommitChangesClick() {
    const dialogConfirmRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogType: 'warning',
        title: 'Really Commit?',
        message: 'This will commit all changes to the Master table.  This action cannot be undone.  Are you sure you wish to do this?',
        buttonText: {
          ok: 'Yes',
          cancel: 'Cancel'
        }
      }
    });
    dialogConfirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.isRefresh = true;
        this.operation = 'commit';
        const sendData = {
          'Data': [{}]
        };
        this.dataManagerService.commitChanges(this.tableConfig, sendData).subscribe((data) => {
          this.handleMassValidateRespond(data);
          this.isAlertSuccess = true;
        });
      }
    });
  }

  handleMassValidateRespond(data) {
    this.hasValidationLoaded = true;
    this.isRefresh = false;
    const errorArray = [];
    const warningArray = [];
    let numResults = 0;
    if (data && data.RecordContainer) {
      data.RecordContainer.forEach(recordContainer => {
        if ('Errors' in recordContainer && recordContainer.Errors != null) {
          recordContainer.Errors.Error.forEach(error => {
            error.ErrorDescription = recordContainer.Record.Id + ': ' + error.ErrorDescription;
            errorArray.push(error);
          });
        }
        if ('Warnings' in recordContainer && recordContainer.Warnings != null) {
          recordContainer.Warnings.Warning.forEach(warning => {
            warning.WarningDescription = recordContainer.Record.Id + ': ' + warning.WarningDescription;
            warningArray.push(warning);
          });
        }
        numResults++;
      });
    }
    this.mainResult = numResults + ' record' + (numResults === 1 ? ' has' : 's have' ) + ' been modified.';
    this.errorText = (errorArray.length > 0 ? errorArray.length : 'No') + ' validation error' +
        (errorArray.length === 1 ? ' was found:' : 's were found.') +
        (this.operation === 'commit' ? '  Records with errors were not committed to the Master Table.' : '');
    this.warningText = (warningArray.length > 0 ? warningArray.length : 'No') + ' validation warning' +
        (warningArray.length === 1 ? ' was found:' : 's were found.') +
        (this.operation === 'validate' ? '  Records with warnings will not be committed to the Master Table.' : '');
    this.errorMessages = errorArray as ErrorMessages[];
    this.warningMessages = warningArray as WarningMessages[];
  }
}
