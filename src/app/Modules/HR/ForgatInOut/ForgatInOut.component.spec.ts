/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ForgatInOutComponent } from './ForgatInOut.component';

describe('ForgatInOutComponent', () => {
  let component: ForgatInOutComponent;
  let fixture: ComponentFixture<ForgatInOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgatInOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgatInOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
