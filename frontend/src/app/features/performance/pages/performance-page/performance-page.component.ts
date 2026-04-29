import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { PerformanceMemberCardComponent } from '../../components/performance-member-card/performance-member-card.component';
import { PerformanceStore } from '../../data-access/performance.store';

@Component({
  selector: 'app-performance-page',
  standalone: true,
  imports: [FormsModule, MatIconModule, PerformanceMemberCardComponent],
  templateUrl: './performance-page.component.html',
  styleUrl: './performance-page.component.scss',
})
export class PerformancePageComponent {
  private readonly performanceStore = inject(PerformanceStore);

  readonly searchTerm = signal('');

  readonly metrics = this.performanceStore.filteredPerformanceMetrics;
  readonly summary = this.performanceStore.summary;

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.performanceStore.setSearchTerm(term);
  }
}