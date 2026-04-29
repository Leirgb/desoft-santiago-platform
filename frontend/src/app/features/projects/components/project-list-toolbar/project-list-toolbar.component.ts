import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { ProjectStatus } from '../../models/project.model';

@Component({
  selector: 'app-project-list-toolbar',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './project-list-toolbar.component.html',
  styleUrl: './project-list-toolbar.component.scss',
})
export class ProjectListToolbarComponent {
  readonly canCreateProject = input(false);

  readonly searchChanged = output<string>();
  readonly statusChanged = output<ProjectStatus | 'ALL'>();
  readonly createProject = output<void>();

  searchTerm = '';
  selectedStatus: ProjectStatus | 'ALL' = 'ALL';

  onSearchChange(): void {
    this.searchChanged.emit(this.searchTerm);
  }

  onStatusChange(): void {
    this.statusChanged.emit(this.selectedStatus);
  }
}