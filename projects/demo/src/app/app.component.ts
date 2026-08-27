import { Component } from '@angular/core';
import { ItemViewerComponent } from 'item-viewer';

@Component({
  selector: 'app-root',
  imports: [ItemViewerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo';
}
