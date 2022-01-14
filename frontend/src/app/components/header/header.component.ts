import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ISession, IUser, UserRole } from 'interfaces';
import { Observable } from 'rxjs';
import { AuthStateService } from 'src/app/services/auth-state.service';
import { AuthService } from '../../services/auth.service';

/**
 * Header and Navigation
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  links: any = null;
  activeLink: string = "";
  activeLinkRoot: string = "";
  role: any = null;
  isLogin: boolean = false;
  username: string | null = null;
  linksConfig: any = {
    default: null
  };

  menuIcon: 'expand_more' | 'account_circle' = 'expand_more';
  testUsers$: Observable<IUser[]>;

  constructor(
    public authState: AuthStateService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.testUsers$ = this.auth.getCurrentUsers();

    this.linksConfig[UserRole.INSTALLER] = [{
      name: "Profile",
      disabled: false,
      link: '/installer-profile'
    }, {
      name: "Policies",
      disabled: false,
      link: '/policy-viewer'
    }];
    this.linksConfig[UserRole.ORIGINATOR] = [{
      name: "Profile",
      disabled: false,
      link: '/originator-profile'
    }, {
      name: "Policies",
      disabled: false,
      link: '/policy-viewer'
    }];
    this.linksConfig[UserRole.ROOT_AUTHORITY] = [{
      name: "Config",
      disabled: false,
      link: '/config'
    }, {
      name: "Schemes",
      disabled: false,
      link: '/schemes'
    }, {
      name: "Tokens",
      disabled: false,
      link: '/tokens'
    }, {
      name: "Policies",
      disabled: false,
      link: '/policy-viewer'
    }, {
      name: "Policies configuration",
      disabled: false,
      link: '/policy-configuration',
      hidden: true,
    }];
    this.linksConfig[UserRole.AUDITOR] = [{
      name: "Audit",
      disabled: false,
      link: '/audit'
    }, {
      name: "Trust Chain",
      disabled: false,
      link: '/trust-chain'
    }];

    this.links = this.linksConfig.default;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.update();
      }
    })
  }

  ngOnInit() {
    this.activeLink = "";
    this.update();
  }

  async update() {
    if (this.activeLink == this.router.url) {
      return;
    }
    this.activeLink = this.router.url;
    this.activeLinkRoot = this.router.url.split('?')[0];
    this.auth.getCurrentUser().subscribe((user: ISession | null) => {
      const isLogin = !!user;
      const role = user ? user.role : null;
      const username = user ? user.username : null;
      this.setStatus(isLogin, role, username);
      this.authState.updateState(isLogin);
    }, () => {
      this.setStatus(false, null, null);
    });
  }

  setStatus(isLogin: boolean, role: string | null, username: string | null) {
    if (this.isLogin != isLogin || this.role != role) {
      this.isLogin = isLogin;
      this.role = role;
      this.username = username;

      this.menuIcon = this.isLogin ? 'account_circle' : 'expand_more';

      if (this.isLogin) {
        this.links = this.linksConfig[this.role];
      } else {
        this.links = this.linksConfig.default;
      }
    }
  }

  logIn() {
    this.router.navigate(['/login']);
  }

  profile() {
    this.router.navigate(['/installer-profile']);
  }

  logOut() {
    // this.authorizationHelper.logout().subscribe(() => {
    //     this.router.navigate(['/login']);
    // }, () => {
    //     this.router.navigate(['/login']);
    // });
    this.auth.removeAccessToken();
    this.authState.updateState(false);
    this.router.navigate(['/login']);
  }

  rout(link: any) {
    this.router.navigate([link.link]);
  }

  isActive(link: any) {
    return this.activeLink == link.link || this.activeLinkRoot == link.link;
  }

  isHidden(link: any) {
    return link.hidden && !this.isActive(link);
  }

  onHome() {
    this.router.navigate(['/']);
  }
}