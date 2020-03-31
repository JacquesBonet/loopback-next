// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: example-passport-oauth2-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {asAuthStrategy, AuthenticationStrategy} from '@loopback/authentication';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {Strategy, StrategyOption} from 'passport-facebook';
import {bind, inject} from '@loopback/context';
import {UserService, UserServiceBindings} from '../services';
import {Oauth2AuthStrategy} from './oauth2-strategy';
import {PassportAuthenticationBindings} from './provider';
import {extensionFor} from '@loopback/core';

const oauth2Providers = require('../../oauth2-providers');

const facebookOptions: StrategyOption = {
  clientID: oauth2Providers['facebook-login'].clientID,
  clientSecret: oauth2Providers['facebook-login'].clientSecret,
  callbackURL: oauth2Providers['facebook-login'].callbackURL,
  profileFields: oauth2Providers['facebook-login'].profileFields,
};

@bind(
  asAuthStrategy,
  extensionFor(PassportAuthenticationBindings.OAUTH2_STRATEGY),
)
export class FaceBookOauth2Authorization extends Oauth2AuthStrategy
  implements AuthenticationStrategy {
  passportstrategy: Strategy;

  /**
   * create an oauth2 strategy for facebook
   */
  constructor(
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService,
  ) {
    super('oauth2-facebook');
    this.passportstrategy = new Strategy(
      facebookOptions,
      this.verify.bind(this),
    );
    this.strategy = new StrategyAdapter(
      this.passportstrategy,
      this.provider,
      this.mapProfile.bind(this),
    );
  }
}
