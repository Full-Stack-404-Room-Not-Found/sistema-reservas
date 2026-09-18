import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardUsuarioInicio } from './inicio';

describe('DashboardUsuarioInicio', () => {
  let component: DashboardUsuarioInicio;
  let fixture: ComponentFixture<DashboardUsuarioInicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardUsuarioInicio],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardUsuarioInicio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
