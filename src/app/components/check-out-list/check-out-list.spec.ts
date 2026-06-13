import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOutList } from './check-out-list';

describe('CheckOutList', () => {
  let component: CheckOutList;
  let fixture: ComponentFixture<CheckOutList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckOutList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckOutList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
