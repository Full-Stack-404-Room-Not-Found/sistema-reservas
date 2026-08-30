import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuUsuario } from './menu-usuario';

describe('MenuUsuario', () => {
  let component: MenuUsuario;
  let fixture: ComponentFixture<MenuUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
