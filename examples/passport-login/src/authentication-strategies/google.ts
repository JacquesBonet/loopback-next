// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: example-passport-oauth2-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {asAuthStrategy, AuthenticationStrategy} from '@loopback/authentication';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {Strategy, StrategyOptions} from 'passport-google-oauth2';
import {bind, inject} from '@loopback/context';
import {UserService, UserServiceBindings} from '../services';
import {Oauth2AuthStrategy} from './oauth2-strategy';
import {extensionFor} from '@loopback/core';
import {PassportAuthenticationBindings} from './provider';

const oauth2Providers = require('../../oauth2-providers');

const googleOptions: StrategyOptions = {
  clientID: oauth2Providers['google-login'].clientID,
  clientSecret: oauth2Providers['google-login'].clientSecret,
  callbackURL: oauth2Providers['google-login'].callbackURL,
  scope: ['email'],
};

@bind(
  asAuthStrategy,
  extensionFor(PassportAuthenticationBindings.OAUTH2_STRATEGY),
)
export class GoogleOauth2Authorization extends Oauth2AuthStrategy
  implements AuthenticationStrategy {
  passportstrategy: Strategy;

  /**
   * create an oauth2 strategy for google
   */
  constructor(
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService,
  ) {
    super('oauth2-google');
    this.passportstrategy = new Strategy(googleOptions, this.verify.bind(this));
    this.strategy = new StrategyAdapter(
      this.passportstrategy,
      this.provider,
      this.mapProfile,
    );
  }
}
