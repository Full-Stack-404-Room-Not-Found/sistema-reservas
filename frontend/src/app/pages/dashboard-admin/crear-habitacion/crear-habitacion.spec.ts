import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearHabitacion } from './crear-habitacion';

describe('CrearHabitacion', () => {
  let component: CrearHabitacion;
  let fixture: ComponentFixture<CrearHabitacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearHabitacion],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearHabitacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
