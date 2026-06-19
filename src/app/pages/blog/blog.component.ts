import { Component } from '@angular/core';
import { MediumService } from 'src/app/services/medium.service';
import { MediumStory } from 'src/data/medium';

// kept for blogpost.component (Google-Docs embedded posts)
export interface blogPost {
  title: string;
  publishedLink: string;
  tags: string[];
  summary: string;
  docId: string;
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  stories: MediumStory[] = [];
  loaded = false;
  profile = 'https://medium.com/@hardikraj08';
  driveUrl = 'https://drive.google.com/drive/folders/1oKO2LteQho8BY7bHiSwjNxT9F_rRuNhS?usp=drive_link';

  constructor(private medium: MediumService) {
    this.medium.getFeed().subscribe((feed) => {
      this.stories = feed.stories ?? [];
      if (feed.profile) this.profile = feed.profile;
      this.loaded = true;
    });
  }
}
