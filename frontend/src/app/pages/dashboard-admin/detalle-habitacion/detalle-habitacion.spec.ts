import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleHabitacion } from './detalle-habitacion';

describe('DetalleHabitacion', () => {
  let component: DetalleHabitacion;
  let fixture: ComponentFixture<DetalleHabitacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleHabitacion],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleHabitacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
