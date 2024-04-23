import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinnerscreenComponent } from './winnerscreen.component';

describe('WinnerscreenComponent', () => {
  let component: WinnerscreenComponent;
  let fixture: ComponentFixture<WinnerscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WinnerscreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WinnerscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
