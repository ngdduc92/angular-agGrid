import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoMarkComponent } from './no-mark.component';

describe('NoMarkComponent', () => {
  let component: NoMarkComponent;
  let fixture: ComponentFixture<NoMarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoMarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
