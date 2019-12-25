import { RailincUserService } from '@railinc/rl-common-ui-lib';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-mark',
  templateUrl: './no-mark.component.html',
  styleUrls: ['./no-mark.component.css']
})
export class NoMarkComponent implements OnInit {

  constructor(private userService: RailincUserService) { }

  ngOnInit() {
  }

  public openMarkSelectionModal() {
    this.userService.onNoMarkSelectedError.next();
  }

}
