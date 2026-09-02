export interface DistributionPoint { theta: number; density: number; }
export interface IrtItemParameters { difficulty: number; discrimination: number; }
export interface PsychometricItem { id: string; parameters: IrtItemParameters; }
export interface AbilityEstimate { theta: number; standardError: number; }
export interface PsychometricSnapshot {
  prior: DistributionPoint[];
  posteriorIfCorrect: DistributionPoint[];
  posteriorIfIncorrect: DistributionPoint[];
  actualPosterior: DistributionPoint[] | null;
  estimate: AbilityEstimate;
  probabilityCorrect: number;
  information: DistributionPoint[];
}
