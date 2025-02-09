import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QnaFormComponent } from './qna-form.component';

describe('QnaFormComponent', () => {
  let component: QnaFormComponent;
  let fixture: ComponentFixture<QnaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QnaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QnaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
