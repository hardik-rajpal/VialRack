import { Component } from '@angular/core';
import { GitdbService } from 'src/app/services/gitdb.service';
import { LiteraryWork } from 'src/data/literature';

@Component({
  selector: 'app-literary-works',
  templateUrl: './literary-works.component.html',
  styleUrls: ['./literary-works.component.css']
})
export class LiteraryWorksComponent {
  works: LiteraryWork[] = [];
  loaded = false;

  private readonly covers = ['#8C4A3C', '#5E7385', '#6F7E5F', '#B08A3C', '#4E5D6B', '#7A5A6B', '#A8693E'];

  constructor(private gitdb: GitdbService) {
    this.gitdb.getLiterature().subscribe({
      next: (data: any) => {
        this.works = (data?.works ?? []) as LiteraryWork[];
        this.loaded = true;
      },
      error: () => (this.loaded = true),
    });
  }

  author(w: LiteraryWork): string {
    return w.author?.trim() || 'Unattributed';
  }

  coverFor(index: number): string {
    return this.covers[index % this.covers.length];
  }

  host(link: string): string {
    try {
      return new URL(link).hostname.replace(/^www\./, '');
    } catch {
      return 'link';
    }
  }
}
