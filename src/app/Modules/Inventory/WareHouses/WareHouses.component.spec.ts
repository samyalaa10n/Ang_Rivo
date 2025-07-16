/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WareHousesComponent } from './WareHouses.component';

describe('WareHousesComponent', () => {
  let component: WareHousesComponent;
  let fixture: ComponentFixture<WareHousesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WareHousesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WareHousesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
