// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-passport-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {repository} from '@loopback/repository';
import {Profile as UserProfile} from 'passport';
import {UserRepository} from '../repositories';
import {User} from '../models';

export interface UserService {
  findOrCreateExternalUser(
    email: string,
    profile: UserProfile,
    token: string,
  ): Promise<UserProfile>;
}

export interface UserWithToken extends UserProfile {
  token: string;
}

/**
 * User service to accept a 'passport' UserProfile and save it locally
 */
export class LocalUserService implements UserService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  /**
   * find a linked local user for an external profile
   * create a local user if not created yet.
   * @param email
   * @param profile
   * @param token
   */
  async findOrCreateExternalUser(
    email: string,
    profile: UserProfile,
    token: string,
  ): Promise<UserWithToken> {
    const user: User[] = await this.userRepository.find({
      where: {
        email: email,
      },
    });
    if (!user || !user.length) {
      await this.userRepository.create({
        email: email,
        name: profile.displayName,
        username: email,
      });
    }
    return {
      ...profile,
      token: token,
    };
  }
}
