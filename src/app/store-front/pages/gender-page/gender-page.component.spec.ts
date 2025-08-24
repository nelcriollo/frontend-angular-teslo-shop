import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderPageComponent } from './gender-page.component';

describe('GenderPageComponent', () => {
  let component: GenderPageComponent;
  let fixture: ComponentFixture<GenderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenderPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
