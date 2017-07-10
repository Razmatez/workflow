import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WfWeeklyComponent } from './wf-weekly.component';

describe('WfWeeklyComponent', () => {
  let component: WfWeeklyComponent;
  let fixture: ComponentFixture<WfWeeklyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WfWeeklyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
