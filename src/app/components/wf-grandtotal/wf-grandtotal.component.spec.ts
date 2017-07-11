import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WfGrandtotalComponent } from './wf-grandtotal.component';

describe('WfGrandtotalComponent', () => {
  let component: WfGrandtotalComponent;
  let fixture: ComponentFixture<WfGrandtotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WfGrandtotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfGrandtotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
