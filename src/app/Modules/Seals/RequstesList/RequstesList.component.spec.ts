/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RequstesListComponent } from './RequstesList.component';

describe('RequstesListComponent', () => {
  let component: RequstesListComponent;
  let fixture: ComponentFixture<RequstesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequstesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequstesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
