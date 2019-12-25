import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MENU_OPTIONS } from '../../menu-options.enum';

@Component({
    selector: 'sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SideNavComponent implements OnInit {
    @Input() isSidenavExpanded: boolean;
    @Output() onSelectSidenavItem: EventEmitter<any> = new EventEmitter();
    constructor() { }

    ngOnInit() {
    }

    selectMenu(sport) {
        let menuOptions = [];
        if (sport === 'home') {
            menuOptions = MENU_OPTIONS;
        } else {
            menuOptions =  [
                { label: sport, link: `/${sport.toLowerCase()}` },
                { label: 'Score', link: 'http://espn.com', target: '_blank' }
            ];
        }

        this.onSelectSidenavItem.emit(menuOptions);
    }
}
