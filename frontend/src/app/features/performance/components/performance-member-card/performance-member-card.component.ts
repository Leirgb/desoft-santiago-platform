import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import {
  PerformanceLevel,
  PerformanceMemberMetrics,
} from '../../models/performance.model';

@Component({
  selector: 'app-performance-member-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './performance-member-card.component.html',
  styleUrl: './performance-member-card.component.scss',
})
export class PerformanceMemberCardComponent {
  @Input({ required: true }) metric!: PerformanceMemberMetrics;

  levelLabel(level: PerformanceLevel): string {
    const labels: Record<PerformanceLevel, string> = {
      HIGH: 'Alto',
      MEDIUM: 'Medio',
      LOW: 'Bajo',
    };

    return labels[level];
  }

  initials(): string {
    return this.metric.member.fullName
      .split(' ')
      .map((part: string) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}