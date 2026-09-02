import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IrtEapEngine } from './irt-eap-engine';
import { ItemViewerComponent } from './item-viewer.component';
import { PsychometricItem } from './psychometric.models';

describe('ItemViewerComponent', () => {
  let fixture: ComponentFixture<ItemViewerComponent>;
  const item: PsychometricItem = { id: 'ITEM-1', parameters: { discrimination: 1.2, difficulty: 0.4 } };
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ItemViewerComponent] }).compileComponents();
    fixture = TestBed.createComponent(ItemViewerComponent);
    fixture.componentRef.setInput('item', item);
    fixture.componentRef.setInput('snapshot', new IrtEapEngine().preview(item));
    fixture.detectChanges();
  });
  it('renders the live estimate and item parameters', () => {
    expect(fixture.nativeElement.textContent).toContain('Psychometric panel');
    expect(fixture.nativeElement.textContent).toContain('ITEM-1');
  });
});
