import React, { MouseEvent } from 'react';
import axios from 'axios';
import '../scss/style.scss';

type Props = {
  returnUrlRelativeToRoot: string;
  siteName: string;
};

export default function FacebookLogIn(props: Props) {

  const handleOnClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    const facebookService = new FacebookService();
    try {
      event.preventDefault();
      const response = await facebookService.logIn();
      const authResponse = response.authResponse;
      const grantedScopes = response.authResponse.grantedScopes;
      console.log('grantedScopes \n%o\n', grantedScopes);
      const facebookAccessToken = authResponse.accessToken;

      var client = axios.create();
      const params = new URLSearchParams();
      params.append('facebookAccessToken', facebookAccessToken);

      const url = '/game/connect';// URL is from custom route
      await client.post(url, params);

      location.href = safeUrlRelativeToRoot(props.returnUrlRelativeToRoot);

    } catch (ex) {
      facebookService.handleException(ex);
    }
  };

  const safeUrlRelativeToRoot = (returnUrl: string): string => {
    if (!returnUrl) return '/';

    // Add / prefix to make replace work both with and without / in return URL
    // Expected output is URL has / prefix
    return `/${returnUrl}`.replace(/\/+/, '/');
  };

  return (
    <a className='btn-fb-login' onClick={handleOnClick}>
      <i className='fa fa-facebook-official' aria-hidden='true'></i>
      Log in with Facebook
    </a>
  );
}

interface IFb {
  login(callback: (response: any) => any, scope: FbScope): void;
  getLoginStatus(callback: (response: any) => any, forceGetLogInStatus: boolean): void;
  api(url: string, callback: (response: any) => any): void;
  api(url: string, method: string, callback: (response: any) => any): void;
}

declare let FB: IFb;//reference existing variable from Facebook SDK

// Custom exception
class MissingFacebookPermissionException extends Error {
  constructor(public missingPermission: string) {
    super(`missing ${missingPermission} permission`);
  }
}

class FbScope {
  public return_scopes: boolean = true;
  public scope: string;

  constructor(private requiredPermissions: string[]) {
    this.scope = requiredPermissions.join(',');
  }

  validateHasAllRequiredPermissions(grantedPermissions: string): void {
    for (let index = 0; index < this.requiredPermissions.length - 1; index++) {
      let permissionToCheck = this.requiredPermissions[index];
      let foundIndex = grantedPermissions.indexOf(permissionToCheck);
      console.log(`found permission at index ${foundIndex}`);
      if (foundIndex < 0) {
        throw new MissingFacebookPermissionException(permissionToCheck);
      }
    }
  }
}

class FacebookService {
  private readonly fbScope: FbScope = new FbScope(['email', 'public_profile']);

  logIn(): Promise<any> {
    let promise = new Promise<void>((resolve, reject) => {
      FB.login(response => {
        try {
          if (response.status === 'connected') {
            let grantedScopes: string = response.authResponse.grantedScopes;
            // Also validate if user allow all required permission
            this.fbScope.validateHasAllRequiredPermissions(grantedScopes);
            resolve(response);
          } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            reject(response);
          } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            reject('user not logged into Facebook');
          }

        } catch (ex) {
          reject(ex);
        }

      }, this.fbScope);
    });
    return promise;
  }

  getLogInStatus(): Promise<any> {
    let promise = new Promise<void>((resolve, reject) => {
      const forceGetLogInStatus = true;
      FB.getLoginStatus(response => {
        try {
          // The response object is returned with a status field that lets the
          // app know the current login status of the person.
          // Full docs on the response object can be found in the documentation
          // for FB.getLoginStatus().

          //list of response.status
          //'connected', use connected to our app
          //not_authorized, The person is logged into Facebook, but not your app.

          //other status
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.

          //useful properties that can get from response
          //response.authResponse.userID,
          //response.authResponse.accessToken
          console.log('get log in status \n%o\n', response);
          resolve(response);

        } catch (ex) {
          reject(ex);
        }

      }, forceGetLogInStatus);
    });
    return promise;
  }

  async handleException(response: any): Promise<void> {
    if (!(response instanceof MissingFacebookPermissionException)) {
      alert('Error, please retry log in again');
      return;
    }

    const ex = response as MissingFacebookPermissionException;
    await this.removeApp();
    alert(`Error, please allow '${ex.missingPermission}' permission`);
  };

  // User can start log in again without any permission issue
  removeApp(): Promise<void> {
    let promise = new Promise<void>((resolve, reject) => {
      FB.api('/me/permissions', 'delete', (response: any) => {
        try {
          console.log('remove app response \n%o\n', response);
          resolve();
        } catch (ex) {
          reject(ex);
        }
      });
    });

    // Return promise immediately
    return promise;
  }
}
