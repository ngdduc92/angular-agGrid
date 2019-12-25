import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { AppAlert } from "./alert.model";

const CLEAR_CHANNEL = "clear";

@Injectable({ providedIn: "root" })
export class AlertService {
  private subjects: any = {};

  constructor() {
    this.addChannel("main");
  }

  success(message: string, channel: string = "main") {
    this.addAlert(message, "success", channel);
  }

  info(message: string, channel: string = "main") {
    this.addAlert(message, "info", channel);
  }

  error(message: string, channel: string = "main") {
    this.addAlert(message, "error", channel);
  }

  warning(message: string, channel: string = "main") {
    this.addAlert(message, "warning", channel);
  }

  getMessage(channel: string = "main"): Observable<AppAlert> {
    return this.subjects[channel].subject.asObservable();
  }

  addChannel(channel: string) {
    if (!this.subjects[channel]) {
      this.subjects[channel] = {
        subject: new Subject<AppAlert>()
      };
    }
  }

  clearChannel(channel: string) {
    this.subjects[channel].subject.next({ type: CLEAR_CHANNEL });
  }

  private addAlert(message: string, type: string, channel: string = "main") {
    this.subjects[channel].subject.next({ type: type, text: message });
  }
}
