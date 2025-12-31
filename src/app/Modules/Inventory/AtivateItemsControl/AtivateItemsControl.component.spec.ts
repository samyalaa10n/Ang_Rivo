/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AtivateItemsControlComponent } from './AtivateItemsControl.component';

describe('AtivateItemsControlComponent', () => {
  let component: AtivateItemsControlComponent;
  let fixture: ComponentFixture<AtivateItemsControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtivateItemsControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtivateItemsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
