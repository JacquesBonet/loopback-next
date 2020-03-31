// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/extension-logging
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {extensions, Getter, Provider, inject} from '@loopback/core';
import {Oauth2AuthStrategy} from './oauth2-strategy';
import {Request, RestBindings, HttpErrors} from '@loopback/rest';

export namespace PassportAuthenticationBindings {
  export const OAUTH2_STRATEGY = 'passport.authentication.oauth2.strategy';
}

/**
 * provider for passport strategies
 */
export class PassportStrategyProvider implements Provider<Oauth2AuthStrategy> {
  constructor(
    @extensions(PassportAuthenticationBindings.OAUTH2_STRATEGY)
    private getStrategies: Getter<Oauth2AuthStrategy[]>,
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
  ) {}

  async value() {
    const providerName = this.request.route.provider;
    const strategies: Oauth2AuthStrategy[] = await this.getStrategies();
    const strategy = strategies.find(
      (s: Oauth2AuthStrategy) => s.provider === providerName,
    );

    if (!strategy) throw new HttpErrors.Unauthorized('unknown provider');
    return strategy;
  }
}
