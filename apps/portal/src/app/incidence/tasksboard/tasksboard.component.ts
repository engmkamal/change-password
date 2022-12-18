import { Component, ViewEncapsulation, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../environments/environment';
// import { ProjectQuery } from '../project/state/project/project.query';
// import { ProjectService } from '../project/state/project/project.service';
// import { GoogleAnalyticsService } from '../core/services/google-analytics.service';

@Component({
  selector: 'portal-tasksboard',
  templateUrl: './tasksboard.component.html',
  styleUrls: ['./tasksboard.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class TasksboardComponent implements AfterViewInit {
  constructor(
    public router: Router,
    //public projectQuery: ProjectQuery,
    private _cdr: ChangeDetectorRef,
    //private _projectService: ProjectService,
    //private _googleAnalytics: GoogleAnalyticsService
  ) {
    //this._projectService.setLoading(true);

    // if (environment.production) {
    //   this.router.events.subscribe(this.handleGoogleAnalytics);
    // }
  }

  // handleGoogleAnalytics = (event: any): void => {
  //   if (event instanceof NavigationEnd) {
  //     this._googleAnalytics.sendPageView(event.urlAfterRedirects);
  //   }
  // };

  ngAfterViewInit() {
    this._cdr.detectChanges();
  }
}

