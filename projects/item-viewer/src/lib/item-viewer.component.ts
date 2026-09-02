import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DistributionPoint, PsychometricItem, PsychometricSnapshot } from './psychometric.models';

@Component({
  selector: 'lib-item-viewer',
  imports: [CommonModule, FormsModule],
  templateUrl: './item-viewer.component.html',
  styleUrl: './item-viewer.component.scss',
})
export class ItemViewerComponent {
  @Input({ required: true }) item!: PsychometricItem;
  @Input({ required: true }) snapshot!: PsychometricSnapshot;
  @Input() responseOutcome: 'correct' | 'incorrect' | null = null;
  @Input() thetaHistory: number[] = [];
  @Output() debugSaved = new EventEmitter<void>();

  editMode = false;
  draft = { discrimination: 0, difficulty: 0, theta: 0, standardError: 0 };

  get probabilityCorrect(): number {
    const { discrimination, difficulty } = this.item.parameters;
    return 1 / (1 + Math.exp(-1.7 * discrimination * (this.snapshot.estimate.theta - difficulty)));
  }

  get abilityInterval(): [number, number] {
    const theta = this.editMode ? this.draft.theta : this.snapshot.estimate.theta;
    const standardError = this.editMode ? this.draft.standardError : this.snapshot.estimate.standardError;
    return [theta - 1.96 * standardError, theta + 1.96 * standardError];
  }

  toggleEdit(): void {
    if (!this.editMode) {
      this.draft = {
        discrimination: this.roundForEditing(this.item.parameters.discrimination),
        difficulty: this.roundForEditing(this.item.parameters.difficulty),
        theta: this.roundForEditing(this.snapshot.estimate.theta),
        standardError: this.roundForEditing(this.snapshot.estimate.standardError),
      };
      this.editMode = true;
      return;
    }
    this.item.parameters.discrimination = this.draft.discrimination;
    this.item.parameters.difficulty = this.draft.difficulty;
    this.snapshot.estimate.theta = this.draft.theta;
    this.snapshot.estimate.standardError = this.draft.standardError;
    this.snapshot.probabilityCorrect = this.probabilityCorrect;
    this.editMode = false;
    this.debugSaved.emit();
  }

  private roundForEditing(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  distributionPath(points: DistributionPoint[]): string {
    const candidates = [
      ...this.snapshot.prior,
      ...this.snapshot.posteriorIfCorrect,
      ...this.snapshot.posteriorIfIncorrect,
      ...(this.snapshot.actualPosterior ?? []),
    ];
    const sharedMaximum = Math.max(...candidates.map(point => point.density), 0.0001);
    return this.path(points, 154, 126, sharedMaximum);
  }
  informationPath(): string { return this.path(this.snapshot.information, 126, 98); }
  historyPath(): string {
    if (!this.thetaHistory.length) return '';
    const denominator = Math.max(this.thetaHistory.length - 1, 1);
    return this.thetaHistory.map((theta, index) => {
      const x = 16 + index / denominator * 520;
      const y = 72 - (Math.max(-3, Math.min(3, theta)) + 3) / 6 * 52;
      return `${index ? 'L' : 'M'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');
  }
  private path(points: DistributionPoint[], baseline: number, height: number, maximum?: number): string {
    const max = maximum ?? Math.max(...points.map(point => point.density), 0.0001);
    return points.map((point, index) => {
      const x = (point.theta + 4) / 8 * 520 + 16;
      const y = baseline - point.density / max * height;
      return `${index ? 'L' : 'M'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');
  }
}
