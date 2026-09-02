# ItemViewer

An interactive Angular component for exploring item parameters and ability estimates in a two-parameter logistic (2PL) IRT model.

The repository contains both a reusable Angular library and a demo application. The demo lets you answer sample questions and inspect how each response changes the estimated ability and uncertainty.

## Live demo

[Open the interactive demo](https://yyhaos.github.io/ItemViewer/)

## Features

- Displays the current item's discrimination (`a`) and difficulty (`b`)
- Shows the current EAP ability estimate and standard error
- Displays the normal-approximation interval `EAP ± 1.96 × SE`
- Calculates the probability of a correct response
- Previews the EAP, interval, and SE after a correct or incorrect response
- Provides a Debug mode for editing `a`, `b`, EAP, and SE
- Rebuilds the internal posterior after a Debug edit, so later responses continue from the edited state
- Includes a responsive interactive demo

## Model

The probability of a correct response is calculated using the 2PL model:

```text
P(correct | θ) = 1 / (1 + exp(- a × (θ - b)))
```

where:

- `θ` is the ability estimate
- `a` is item discrimination
- `b` is item difficulty

Ability is estimated with expected a posteriori (EAP) estimation over a discrete ability grid.

## Project structure

```text
projects/
├── item-viewer/   Reusable Angular library
└── demo/          Interactive demo application
```

## Requirements

- Node.js 22
- npm
- Angular CLI 19

## Local development

Install dependencies:

```bash
npm ci
```

Build the library and start the demo:

```bash
npm start
```

Then open:

```text
http://localhost:4200/
```

## Build

Build the library and demo:

```bash
npm run build
```

Build them separately:

```bash
npm run build:lib
npm run build:demo
```

Production output:

```text
dist/item-viewer/
dist/demo/browser/
```

## Tests

Run all unit tests:

```bash
npm test
```

Or run each test suite separately:

```bash
npm run test:lib
npm run test:demo
```

## GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` builds and deploys the demo whenever a commit is pushed to `master`.

The Pages build uses:

```bash
npx ng build demo --configuration production --base-href /ItemViewer/
```

To enable deployment, open the repository's **Settings → Pages** and select **GitHub Actions** as the publishing source.

## Library usage

Import the standalone component:

```ts
import { ItemViewerComponent } from 'item-viewer';

@Component({
  imports: [ItemViewerComponent]
})
export class ExampleComponent {}
```

Use it in a template:

```html
<lib-item-viewer
  [item]="question"
  [snapshot]="snapshot"
  [responseOutcome]="outcome"
  [thetaHistory]="thetaHistory"
/>
```

The component expects a `PsychometricItem` and a `PsychometricSnapshot`. The `IrtEapEngine` class can generate and update snapshots.
