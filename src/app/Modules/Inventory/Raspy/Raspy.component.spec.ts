/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RaspyComponent } from './Raspy.component';

describe('RaspyComponent', () => {
  let component: RaspyComponent;
  let fixture: ComponentFixture<RaspyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaspyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaspyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
