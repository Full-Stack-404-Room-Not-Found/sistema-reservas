import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HabitacionesDisponibles } from './habitaciones-disponibles';

describe('HabitacionesDisponibles', () => {
  let component: HabitacionesDisponibles;
  let fixture: ComponentFixture<HabitacionesDisponibles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitacionesDisponibles],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitacionesDisponibles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
