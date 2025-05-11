/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AttendanceAndDepartureDevicesComponent } from './AttendanceAndDepartureDevices.component';

describe('AttendanceAndDepartureDevicesComponent', () => {
  let component: AttendanceAndDepartureDevicesComponent;
  let fixture: ComponentFixture<AttendanceAndDepartureDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceAndDepartureDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceAndDepartureDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
