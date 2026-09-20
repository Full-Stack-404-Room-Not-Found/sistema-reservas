import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardUsuarioLayout } from './layout';

describe('DashboardUsuarioLayout', () => {
  let component: DashboardUsuarioLayout;
  let fixture: ComponentFixture<DashboardUsuarioLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardUsuarioLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardUsuarioLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
