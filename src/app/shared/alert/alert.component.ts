import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from './alert.service';
import { AppAlert } from './alert.model';

const CLEAR_CHANNEL = 'clear';

@Component({
  selector: 'alert-container',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy, OnChanges {
  private subscription: Subscription;
  messages: any[] = [];

  @Input() channel: string = "main";
  @Input() allowDismiss: boolean = false;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.addChannel(this.channel);
    this.subscribeToChannel();
  }

  subscribeToChannel() {
    this.subscription = this.alertService
      .getMessage(this.channel)
      .subscribe((message: AppAlert) => {
        if (message.type === CLEAR_CHANNEL) {
          this.messages = [];
          return;
        }
        this.messages.push(message);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscribeToChannel();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  dismissAlert(index: number) {
    this.messages.splice(index, 1);
  }
}
