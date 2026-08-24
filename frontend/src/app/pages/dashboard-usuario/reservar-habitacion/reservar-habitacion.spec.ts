import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservarHabitacion } from './reservar-habitacion';

describe('ReservarHabitacion', () => {
  let component: ReservarHabitacion;
  let fixture: ComponentFixture<ReservarHabitacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservarHabitacion],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservarHabitacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
