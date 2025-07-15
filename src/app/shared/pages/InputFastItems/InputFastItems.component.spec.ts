/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InputFastItemsComponent } from './InputFastItems.component';

describe('InputFastItemsComponent', () => {
  let component: InputFastItemsComponent;
  let fixture: ComponentFixture<InputFastItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputFastItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFastItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
