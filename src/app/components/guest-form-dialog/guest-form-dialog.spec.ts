import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestFormDialog } from './guest-form-dialog';

describe('GuestFormDialog', () => {
  let component: GuestFormDialog;
  let fixture: ComponentFixture<GuestFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestFormDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
