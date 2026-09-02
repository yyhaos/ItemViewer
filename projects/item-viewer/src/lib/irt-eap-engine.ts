import { AbilityEstimate, DistributionPoint, PsychometricItem, PsychometricSnapshot } from './psychometric.models';

const MIN_THETA = -10;
const MAX_THETA = 10;
const GRID_STEP = 0.05;
const LOGISTIC_SCALE = 1.0;

export class IrtEapEngine {
  private readonly grid = Array.from(
    { length: Math.round((MAX_THETA - MIN_THETA) / GRID_STEP) + 1 },
    (_, index) => MIN_THETA + index * GRID_STEP,
  );
  private posterior = this.standardNormal();

  get estimate(): AbilityEstimate { return this.estimateDistribution(this.posterior); }

  preview(item: PsychometricItem): PsychometricSnapshot {
    const prior = this.clone(this.posterior);
    const posteriorIfCorrect = this.posteriorFor(prior, item, true);
    const posteriorIfIncorrect = this.posteriorFor(prior, item, false);
    const estimate = this.estimateDistribution(prior);
    return {
      prior, posteriorIfCorrect, posteriorIfIncorrect, actualPosterior: null, estimate,
      probabilityCorrect: this.probabilityAt(item, estimate.theta),
      information: this.informationCurve(item),
    };
  }

  respond(item: PsychometricItem, correct: boolean): PsychometricSnapshot {
    const snapshot = this.preview(item);
    this.posterior = correct ? snapshot.posteriorIfCorrect : snapshot.posteriorIfIncorrect;
    return { ...snapshot, actualPosterior: this.clone(this.posterior), estimate: this.estimateDistribution(this.posterior) };
  }

  setEstimate(theta: number, standardError: number): void {
    const safeTheta = Math.max(MIN_THETA, Math.min(MAX_THETA, theta));
    const safeStandardError = Math.max(0.001, standardError);
    const logDensities = this.grid.map(
      point => -0.5 * ((point - safeTheta) / safeStandardError) ** 2,
    );
    const maximum = Math.max(...logDensities);
    this.posterior = this.normalize(
      this.grid.map((point, index) => ({
        theta: point,
        density: Math.exp(logDensities[index] - maximum),
      })),
    );
  }

  reset(): void { this.posterior = this.standardNormal(); }

  probabilityAt(item: PsychometricItem, theta: number): number {
    const { discrimination: a, difficulty: b } = item.parameters;
    return 1 / (1 + Math.exp(-LOGISTIC_SCALE * a * (theta - b)));
  }

  private standardNormal(): DistributionPoint[] {
    return this.normalize(this.grid.map(theta => ({ theta, density: Math.exp(-0.5 * theta * theta) })));
  }

  private posteriorFor(prior: DistributionPoint[], item: PsychometricItem, correct: boolean): DistributionPoint[] {
    return this.normalize(prior.map(({ theta, density }) => {
      const probability = this.probabilityAt(item, theta);
      return { theta, density: density * (correct ? probability : 1 - probability) };
    }));
  }

  private informationCurve(item: PsychometricItem): DistributionPoint[] {
    const a = item.parameters.discrimination;
    return this.grid.map(theta => {
      const probability = this.probabilityAt(item, theta);
      return { theta, density: LOGISTIC_SCALE ** 2 * a ** 2 * probability * (1 - probability) };
    });
  }

  private estimateDistribution(distribution: DistributionPoint[]): AbilityEstimate {
    const theta = distribution.reduce((sum, point) => sum + point.theta * point.density * GRID_STEP, 0);
    const variance = distribution.reduce((sum, point) => sum + (point.theta - theta) ** 2 * point.density * GRID_STEP, 0);
    return { theta, standardError: Math.sqrt(variance) };
  }

  private normalize(distribution: DistributionPoint[]): DistributionPoint[] {
    const area = distribution.reduce((sum, point) => sum + point.density * GRID_STEP, 0);
    return distribution.map(point => ({ theta: point.theta, density: point.density / area }));
  }

  private clone(distribution: DistributionPoint[]): DistributionPoint[] { return distribution.map(point => ({ ...point })); }
}
