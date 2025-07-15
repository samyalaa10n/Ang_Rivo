/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RequstesComponent } from './Requstes.component';

describe('RequstesComponent', () => {
  let component: RequstesComponent;
  let fixture: ComponentFixture<RequstesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequstesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequstesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
