import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SubcriptionsService } from './subcriptions.service';
import { ToastrService } from 'ngx-toastr';
import { HTTP_ERROR_MESSAGES } from '@railinc/rl-common-ui-lib';

import {messages} from 'src/app/shared/messages';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  mqFormControl = new FormControl();
  emailFormControl = new FormControl();

  message = '';
  hasAlertMessage = false;
  isAlertSuccess = true;
  formIsDirty = false;

  constructor(
    private subcriptionsService: SubcriptionsService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.subcriptionsService.getSubscriptions().subscribe((subcriptions: any) => {
      if (subcriptions) {
        subcriptions.forEach(subcription => {
          switch(subcription.DeliveryMedium)
					{
						case "MQ":
                this.mqFormControl.setValue(true);
						    break;
						case "EMAIL":
                this.emailFormControl.setValue(true);
						    break;
						default: break;
					}
        });
      }
    },
    (err: any)  => {
      if (err.status === 0) {
        this.toastrService.error(HTTP_ERROR_MESSAGES.default);
      }
    });
  }

  saveSubscriptions () {
    let mq = this.mqFormControl.value;
    let email = this.emailFormControl.value;

    let mqDelivery = 'N';
    let emailDelivery = 'N';
    if (mq) {
      mqDelivery = 'Y';
    }
    if (email) {
      emailDelivery = 'Y';
    }

    let formData = 'MqDelivery='+mqDelivery+'&EmailDelivery='+emailDelivery;

    this.hasAlertMessage = false;
    this.subcriptionsService.updateSubscriptions(formData).subscribe(
      (data: any) => {
      },
      (err: any)  => {
        if (err.status === 0) {
          this.toastrService.error(HTTP_ERROR_MESSAGES.default);
        }
      }
    );
  }

  showAlertMessage (message: string, isAlertSuccess: boolean) {
    this.hasAlertMessage = true;
    this.message = message;
    this.isAlertSuccess = isAlertSuccess;
  }
}
  