import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardAdminInicio } from './inicio';

describe('DashboardAdminInicio', () => {
  let component: DashboardAdminInicio;
  let fixture: ComponentFixture<DashboardAdminInicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAdminInicio],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardAdminInicio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
