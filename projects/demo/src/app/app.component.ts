import { Component } from '@angular/core';
import { IrtEapEngine, ItemViewerComponent, PsychometricItem, PsychometricSnapshot } from 'item-viewer';

interface DemoQuestion extends PsychometricItem { prompt: string; options: string[]; correctIndex: number; }

@Component({ selector: 'app-root', imports: [ItemViewerComponent], templateUrl: './app.component.html', styleUrl: './app.component.scss' })
export class AppComponent {
  readonly questions: DemoQuestion[] = [
    {
      id: 'MATH-101',
      prompt: 'Item 1: Correct answer is A',
      options: ['Correct', 'Incorrect', 'Incorrect', 'Incorrect'],
      correctIndex: 0,
      parameters: { discrimination: 1.0, difficulty: -0.5 }
    },
    {
      id: 'MATH-102',
      prompt: 'Item 2: Correct answer is A',
      options: ['Correct', 'Incorrect', 'Incorrect', 'Incorrect'],
      correctIndex: 0,
      parameters: { discrimination: 0.9, difficulty: -0.8 }
    },
    {
      id: 'MATH-103',
      prompt: 'Item 3: Correct answer is A',
      options: ['Correct', 'Incorrect', 'Incorrect', 'Incorrect'],
      correctIndex: 0,
      parameters: { discrimination: 1.45, difficulty: 0.15 }
    },
    {
      id: 'MATH-104',
      prompt: 'Item 4: Correct answer is A',
      options: ['Correct', 'Incorrect', 'Incorrect', 'Incorrect'],
      correctIndex: 0,
      parameters: { discrimination: 1.1, difficulty: 0.55 }
    },
    {
      id: 'MATH-105',
      prompt: 'Item 5: Correct answer is A',
      options: ['Correct', 'Incorrect', 'Incorrect', 'Incorrect'],
      correctIndex: 0,
      parameters: { discrimination: 1.6, difficulty: 1.05 }
    }
  ];
  private readonly engine = new IrtEapEngine();
  currentIndex = 0;
  selectedIndex: number | null = null;
  outcome: 'correct' | 'incorrect' | null = null;
  snapshot: PsychometricSnapshot = this.engine.preview(this.questions[0]);
  thetaHistory = [this.snapshot.estimate.theta];

  get question(): DemoQuestion { return this.questions[this.currentIndex]; }
  get answered(): boolean { return this.outcome !== null; }

  select(index: number): void { if (!this.answered) this.selectedIndex = index; }
  submit(): void {
    if (this.selectedIndex === null || this.answered) return;
    const correct = this.selectedIndex === this.question.correctIndex;
    this.outcome = correct ? 'correct' : 'incorrect';
    this.snapshot = this.engine.respond(this.question, correct);
    this.thetaHistory = [...this.thetaHistory, this.snapshot.estimate.theta];
  }
  next(): void {
    if (!this.answered) return;
    if (this.currentIndex === this.questions.length - 1) { this.restart(); return; }
    this.currentIndex++;
    this.selectedIndex = null;
    this.outcome = null;
    this.snapshot = this.engine.preview(this.question);
  }
  restart(): void {
    this.engine.reset(); this.currentIndex = 0; this.selectedIndex = null; this.outcome = null;
    this.snapshot = this.engine.preview(this.question); this.thetaHistory = [this.snapshot.estimate.theta];
  }
}
