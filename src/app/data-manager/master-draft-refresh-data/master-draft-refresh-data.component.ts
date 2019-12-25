import {Component, OnInit, Inject, EventEmitter} from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import {FormBuilder} from '@angular/forms';
import {DATA_MANAGER_MESSAGES, ErrorMessages} from '../data-manager.enum';
import {DataManagerService} from '../data-manager.service';
import {TableConfigModel} from '../../models/table-config.model';
@Component({
  selector: 'app-master-draft-refresh-data',
  templateUrl: './master-draft-refresh-data.component.html',
  styleUrls: ['./master-draft-refresh-data.component.css']
})
export class MasterDraftRefreshDataComponent implements OnInit {
  public messageEnum = DATA_MANAGER_MESSAGES;
  public tableConfig = new TableConfigModel;
  errorMessages: ErrorMessages;
  isAlertSuccess: boolean;
  isAlertFailure: boolean;
  isRefresh: boolean;
  onSuccessEvent = new EventEmitter();
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<MasterDraftRefreshDataComponent>,
              private dataManagerService: DataManagerService) {
  }

  ngOnInit() {
      this.tableConfig = this.data.tableConfig;
  }

  onConfirmClick(): void {
    const sendData = {
        'Data': [{}]
    };
    this.isRefresh = true;
    this.dataManagerService.refreshAllData(this.tableConfig, sendData).subscribe (
        data => {
            if (data === 'success') {
                this.isAlertSuccess = true;
                this.onSuccessEvent.emit();
            } else if (data === 'failure') {
                this.isAlertFailure = true;
            }
            this.isRefresh = false;
        },
        error => {
          console.log('Error', error);
        }
    );
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }
}

