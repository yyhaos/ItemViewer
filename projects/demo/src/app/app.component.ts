import { Component } from '@angular/core';
import { IrtEapEngine, ItemViewerComponent, PsychometricItem, PsychometricSnapshot } from 'item-viewer';

interface DemoQuestion extends PsychometricItem { prompt: string; options: string[]; correctIndex: number; }

@Component({ selector: 'app-root', imports: [ItemViewerComponent], templateUrl: './app.component.html', styleUrl: './app.component.scss' })
export class AppComponent {
  readonly questions: DemoQuestion[] = [
    { id:'MATH-101', prompt:'A rectangle has a length of 8 cm and a width of 5 cm. What is its area?', options:['13 cm²','26 cm²','40 cm²','80 cm²'], correctIndex:2, parameters:{ discrimination:1.2, difficulty:-0.35 } },
    { id:'MATH-102', prompt:'Which expression is equivalent to 3(x + 4)?', options:['3x + 4','3x + 7','3x + 12','7x'], correctIndex:2, parameters:{ discrimination:0.9, difficulty:-0.8 } },
    { id:'MATH-103', prompt:'If 2x − 6 = 10, what is the value of x?', options:['2','5','8','16'], correctIndex:2, parameters:{ discrimination:1.45, difficulty:0.15 } },
    { id:'MATH-104', prompt:'What is the slope of the line y = −2x + 7?', options:['−7','−2','2','7'], correctIndex:1, parameters:{ discrimination:1.1, difficulty:0.55 } },
    { id:'MATH-105', prompt:'Which value solves x² − 5x + 6 = 0?', options:['x = 1 only','x = 2 or 3','x = −2 or −3','x = 6 only'], correctIndex:1, parameters:{ discrimination:1.6, difficulty:1.05 } },
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
