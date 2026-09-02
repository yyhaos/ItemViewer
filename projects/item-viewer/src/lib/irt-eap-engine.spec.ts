import { IrtEapEngine } from './irt-eap-engine';
import { PsychometricItem } from './psychometric.models';

describe('IrtEapEngine', () => {
  const item: PsychometricItem = { id: 'test', parameters: { discrimination: 1.2, difficulty: 0 } };
  it('starts with a standard-normal EAP estimate', () => {
    const estimate = new IrtEapEngine().estimate;
    expect(estimate.theta).toBeCloseTo(0, 3);
    expect(estimate.standardError).toBeCloseTo(1, 2);
  });
  it('moves theta up after a correct response and down after an incorrect response', () => {
    const correct = new IrtEapEngine().respond(item, true).estimate.theta;
    const incorrect = new IrtEapEngine().respond(item, false).estimate.theta;
    expect(correct).toBeGreaterThan(0);
    expect(incorrect).toBeLessThan(0);
  });
  it('normalizes preview distributions', () => {
    const preview = new IrtEapEngine().preview(item);
    const area = preview.posteriorIfCorrect.reduce((sum, point) => sum + point.density * 0.05, 0);
    expect(area).toBeCloseTo(1, 6);
  });
});
