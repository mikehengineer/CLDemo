import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigmacComponent } from './bigmac.component';

describe('BigmacComponent', () => {
  let component: BigmacComponent;
  let fixture: ComponentFixture<BigmacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BigmacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BigmacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
