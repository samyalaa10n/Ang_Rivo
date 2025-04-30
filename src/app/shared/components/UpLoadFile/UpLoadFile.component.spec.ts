/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UpLoadFileComponent } from './UpLoadFile.component';

describe('UpLoadFileComponent', () => {
  let component: UpLoadFileComponent;
  let fixture: ComponentFixture<UpLoadFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpLoadFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpLoadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
