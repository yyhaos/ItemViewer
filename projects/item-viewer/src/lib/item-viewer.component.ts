import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DistributionPoint, PsychometricItem, PsychometricSnapshot } from './psychometric.models';

@Component({
  selector: 'lib-item-viewer',
  imports: [CommonModule],
  templateUrl: './item-viewer.component.html',
  styleUrl: './item-viewer.component.scss',
})
export class ItemViewerComponent {
  @Input({ required: true }) item!: PsychometricItem;
  @Input({ required: true }) snapshot!: PsychometricSnapshot;
  @Input() responseOutcome: 'correct' | 'incorrect' | null = null;
  @Input() thetaHistory: number[] = [];

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
