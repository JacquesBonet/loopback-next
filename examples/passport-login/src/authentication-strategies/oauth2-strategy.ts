// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: example-passport-oauth2-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AuthenticationStrategy} from '@loopback/authentication';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {Profile} from 'passport';
import {Request, RedirectRoute} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {UserService, UserWithToken} from '../services';

export abstract class Oauth2AuthStrategy implements AuthenticationStrategy {
  name = 'oauth2';
  protected strategy: StrategyAdapter<Profile>;
  protected userService: UserService;

  /**
   * create a common oauth2 authentication object
   */
  constructor(public provider: string) {}

  /**
   * authenticate a request
   * @param request
   */
  async authenticate(request: Request): Promise<UserProfile | RedirectRoute> {
    return this.strategy.authenticate(request);
  }

  /**
   * verify function for the oauth2 strategy
   * This function looks up the user in the user service and creates a local user profile if not present
   *
   * @param accessToken
   * @param refreshToken
   * @param profile
   * @param done
   */
  verify(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    done: (error: any, user?: any, info?: any) => void,
  ) {
    if (profile.emails && profile.emails.length) {
      this.userService
        .findOrCreateExternalUser(profile.emails[0].value, profile, accessToken)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((user: any) => {
          done(null, user);
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((err: any) => {
          done(err);
        });
    } else {
      done(new Error('email-id is required in returned profile to login'));
    }
  }

  /**
   * map passport profile to user profile
   * @param user
   */
  mapProfile(profile: Profile): UserProfile {
    const user = profile as UserWithToken;
    const userProfile: UserProfile = {
      [securityId]: user.id,
      profile: {
        ...user,
        _json: null,
        _raw: null,
      },
    };
    return userProfile;
  }
}
