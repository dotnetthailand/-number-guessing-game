export interface IFb {
  login(callback: (response: any) => any, scope: FbScope): void;
  getLoginStatus(callback: (response: any) => any, forceGetLogInStatus: boolean): void;
  api(url: string, callback: (response: any) => any): void;
  api(url: string, method: string, callback: (response: any) => any): void;
}

declare let FB: IFb;//reference existing variable from Facebook SDK

type FacebookApiResponse = {
  accessToken: string;
  userID: number;
}

export default class FacebookService {
  private readonly fbScope: FbScope = new FbScope([
    'email',
    'public_profile',
  ]);

  logIn(): Promise<FacebookApiResponse> {
    const promise = new Promise<FacebookApiResponse>((resolve, reject) => {
      FB.login(response => {
        try {
          if (response.status === 'connected') {
            const grantedScopes: string = response.authResponse.grantedScopes;
            // Also validate if user allow all required permission
            this.fbScope.validateHasAllRequiredPermissions(grantedScopes);
            resolve(response.authResponse as FacebookApiResponse)
          } else if (response.status === 'not_authorized') {
            reject(new Error('A user is logged in Facebook, but not your app'));
          } else {
            // The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
            reject(new CancelledLoginException());
          }
        } catch (ex) {
          reject(ex);
        }

      }, this.fbScope);
    });

    return promise;
  }

  // https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus
  getLogInStatus(): Promise<FacebookApiResponse> {
    const promise = new Promise<FacebookApiResponse>((resolve, reject) => {
      // call FB.getLoginStatus with the second parameter set to true to force a roundtrip to Facebook, 
      // which effectively refreshes the cache of the response object.
      // If you call FB.getLoginStatus on every page load, be careful not to set this parameter for each as it will significantly increase the number of requests to Facebook's servers, 
      // and thus decrease the performance of your application.
      const forceGetLogInStatus = true;

      FB.getLoginStatus(response => {
        try {
          // list of response.status
          // 'connected' => use connected to our app
          // 'not_authorized' => The person is logged into Facebook, but not your app.

          // other status
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.

          // useful properties that can get from response
          // response.authResponse.userID,
          // response.authResponse.accessToken
          if (response.status == 'connected') {
            resolve(response.authResponse as FacebookApiResponse);
          } else if (response.status === 'not_authorized') {
            reject(new Error('A user is logged in Facebook, but not your app'));
          } else {
            // The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
            reject(new CancelledLoginException());
          }
        } catch (ex) {
          reject(ex);
        }

      }, forceGetLogInStatus);
    });
    return promise;
  }

  async handleException(errorResponse: any): Promise<void> {
    if (errorResponse instanceof MissingFacebookPermissionException) {
      const ex = errorResponse as MissingFacebookPermissionException;
      await this.removeApp();
      alert(`Error, please allow '${ex.missingPermission}' permission`);
      return;
    }

    if (errorResponse instanceof CancelledLoginException) {
      console.error(`Just return we can't handle it`);
      return;
    }

    alert('Something wrong, please retry log in again!!!');
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

// Custom exceptions
class MissingFacebookPermissionException extends Error {
  constructor(public missingPermission: string) {
    super(`missing ${missingPermission} permission`);
  }
}

class CancelledLoginException extends Error {
  constructor() {
    super(`A User cancelled login or did not fully authorize.`);
  }
}


// {
//     scope: 'email', 
//     return_scopes: true
// }
// By setting the return_scopes option to true in the option object when calling FB.login(), 
// you will receive a list of the granted permissions in the grantedScopes field on the authResponse object.
class FbScope {
  public return_scopes: boolean = true;
  public scope: string;

  constructor(private requiredPermissions: string[]) {
    this.scope = requiredPermissions.join(',');
  }

  validateHasAllRequiredPermissions(grantedPermissions: string): void {
    for (let index = 0; index < this.requiredPermissions.length - 1; index++) {
      const permissionToCheck = this.requiredPermissions[index];
      const foundIndex = grantedPermissions.indexOf(permissionToCheck);
      console.log(`found permission at index ${foundIndex}`);
      if (foundIndex < 0) {
        throw new MissingFacebookPermissionException(permissionToCheck);
      }
    }
  }
}
