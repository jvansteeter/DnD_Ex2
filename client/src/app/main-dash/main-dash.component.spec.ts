
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDashComponent } from './main-dash.component';
import { expect } from '@angular/core/testing/src/testing_internal';

describe('MainDashComponent', () => {
  let component: MainDashComponent;
  let fixture: ComponentFixture<MainDashComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MainDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
