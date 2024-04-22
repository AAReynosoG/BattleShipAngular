import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderTypeOneComponent } from './loader-type-one.component';

describe('LoaderTypeOneComponent', () => {
  let component: LoaderTypeOneComponent;
  let fixture: ComponentFixture<LoaderTypeOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderTypeOneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoaderTypeOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
