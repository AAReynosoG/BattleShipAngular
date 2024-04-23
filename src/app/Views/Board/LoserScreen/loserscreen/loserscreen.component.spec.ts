import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoserscreenComponent } from './loserscreen.component';

describe('LoserscreenComponent', () => {
  let component: LoserscreenComponent;
  let fixture: ComponentFixture<LoserscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoserscreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoserscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
