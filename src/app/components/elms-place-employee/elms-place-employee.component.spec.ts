import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElmsPlaceEmployeeComponent } from './elms-place-employee.component';

describe('ElmsPlaceEmployeeComponent', () => {
  let component: ElmsPlaceEmployeeComponent;
  let fixture: ComponentFixture<ElmsPlaceEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElmsPlaceEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElmsPlaceEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
