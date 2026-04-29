import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { MetricCardData } from './models/metric-card.model';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss',
})
export class MetricCardComponent {
  readonly metric = input.required<MetricCardData>();
}