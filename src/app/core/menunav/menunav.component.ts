import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'menunav',
  templateUrl: './menunav.component.html',
  styleUrls: ['./menunav.component.scss']
})
export class MenuNavComponent implements OnInit {
  @Input() menuOptions;

  constructor() { }

  ngOnInit() {
  }
  
  closeMenu(e, rla) {
    if (!e) return;
    if (e === 'click') {
      setTimeout(() => { rla.isActive = true; }, 100);
    }
  }
}
