import { Component } from '@angular/core';
import { IrtEapEngine, ItemViewerComponent, PsychometricItem, PsychometricSnapshot } from 'item-viewer';

interface DemoQuestion extends PsychometricItem { prompt: string; options: string[]; correctIndex: number; }

@Component({ selector: 'app-root', imports: [ItemViewerComponent], templateUrl: './app.component.html', styleUrl: './app.component.scss' })
export class AppComponent {
  readonly questions: DemoQuestion[] = [
    { id:'MATH-101', prompt:'Item 1: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.0, difficulty:-0.5 } },
    { id:'MATH-102', prompt:'Item 2: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:0.9, difficulty:-0.8 } },
    { id:'MATH-103', prompt:'Item 3: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.45, difficulty:0.15 } },
    { id:'MATH-104', prompt:'Item 4: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.1, difficulty:0.55 } },
    { id:'MATH-105', prompt:'Item 5: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.6, difficulty:1.05 } },
    { id:'MATH-106', prompt:'Item 6: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.2, difficulty:-1.2 } },
    { id:'MATH-107', prompt:'Item 7: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:0.8, difficulty:-1.0 } },
    { id:'MATH-108', prompt:'Item 8: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.3, difficulty:-0.6 } },
    { id:'MATH-109', prompt:'Item 9: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.5, difficulty:-0.3 } },
    { id:'MATH-110', prompt:'Item 10: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.0, difficulty:0.0 } },
    { id:'MATH-111', prompt:'Item 11: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.4, difficulty:0.2 } },
    { id:'MATH-112', prompt:'Item 12: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:0.95, difficulty:0.4 } },
    { id:'MATH-113', prompt:'Item 13: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.7, difficulty:0.6 } },
    { id:'MATH-114', prompt:'Item 14: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.1, difficulty:0.8 } },
    { id:'MATH-115', prompt:'Item 15: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.35, difficulty:1.0 } },
    { id:'MATH-116', prompt:'Item 16: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.55, difficulty:1.2 } },
    { id:'MATH-117', prompt:'Item 17: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:0.85, difficulty:1.4 } },
    { id:'MATH-118', prompt:'Item 18: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.25, difficulty:1.6 } },
    { id:'MATH-119', prompt:'Item 19: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.6, difficulty:1.8 } },
    { id:'MATH-120', prompt:'Item 20: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.05, difficulty:2.0 } },
    { id:'MATH-121', prompt:'Item 21: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.45, difficulty:-1.5 } },
    { id:'MATH-122', prompt:'Item 22: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:0.9, difficulty:-0.9 } },
    { id:'MATH-123', prompt:'Item 23: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.75, difficulty:-0.1 } },
    { id:'MATH-124', prompt:'Item 24: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.15, difficulty:0.7 } },
    { id:'MATH-125', prompt:'Item 25: Correct answer is A', options:['Correct','Incorrect','Incorrect','Incorrect'], correctIndex:0, parameters:{ discrimination:1.5, difficulty:1.5 } }
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
