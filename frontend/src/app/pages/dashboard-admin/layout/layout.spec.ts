import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardAdminLayout } from './layout';

describe('DashboardAdminLayout', () => {
  let component: DashboardAdminLayout;
  let fixture: ComponentFixture<DashboardAdminLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAdminLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardAdminLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
