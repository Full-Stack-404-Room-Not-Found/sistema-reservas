import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmacionReserva } from './confirmacion-reserva';

describe('ConfirmacionReserva', () => {
  let component: ConfirmacionReserva;
  let fixture: ComponentFixture<ConfirmacionReserva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacionReserva],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmacionReserva);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
