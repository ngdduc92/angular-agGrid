import { Component, OnInit } from '@angular/core';
import {
  IRailincSSOUser,
  RailincUserService,
} from '@railinc/rl-common-ui-lib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: IRailincSSOUser;

  constructor(
    private userService: RailincUserService
  ) { }

  ngOnInit() {
    this.user = this.userService.SSO_USER;
  }

}
