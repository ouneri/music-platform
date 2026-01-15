import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mainbar } from './mainbar';

describe('Mainbar', () => {
  let component: Mainbar;
  let fixture: ComponentFixture<Mainbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mainbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mainbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
