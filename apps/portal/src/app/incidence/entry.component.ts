import { Component } from '@angular/core';



@Component({
  selector: 'portal-support-entry',
  styleUrls: ['./entry.component.scss'],
  template: `<router-outlet></router-outlet>`
})
export class RemoteEntryComponent {}
//============================================

// import { Component, ViewEncapsulation, AfterViewInit, ChangeDetectorRef } from '@angular/core';
// import { Router, NavigationEnd } from '@angular/router';
// import { environment } from '../../environments/environment';
// import { ProjectQuery } from './project/state/project/project.query';
// import { ProjectService } from './project/state/project/project.service';
// import { GoogleAnalyticsService } from './core/services/google-analytics.service';

// @Component({
//   selector: 'portal-support-entry',
//   template: `<div id="app-frame">
//     <nz-spin class="global-spinner"
//             [nzSpinning]="isLoading$ | async"
//             nzSize="large">
//         <!-- <router-outlet></router-outlet> -->
//     </nz-spin>
//   </div>`,
//   styleUrls: ['./entry.component.scss'],
//   encapsulation: ViewEncapsulation.None
// })
// export class RemoteEntryComponent implements AfterViewInit {
  
//   isLoading$ = true;

//   constructor(
//     public router: Router,
//     public projectQuery: ProjectQuery,
//     private _cdr: ChangeDetectorRef,
//     private _projectService: ProjectService,
//     private _googleAnalytics: GoogleAnalyticsService
//   ) {
//     this._projectService.setLoading(true);

//     if (environment.production) {
//       this.router.events.subscribe(this.handleGoogleAnalytics);
//     }
//   }

//   handleGoogleAnalytics = (event: any): void => {
//     if (event instanceof NavigationEnd) {
//       this._googleAnalytics.sendPageView(event.urlAfterRedirects);
//     }
//   };

//   ngAfterViewInit() {
//     this._cdr.detectChanges();
//   }
// }

