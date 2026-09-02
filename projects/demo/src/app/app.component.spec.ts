import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents(); });
  it('creates the interactive assessment demo', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain('See the estimate move');
  });
});
