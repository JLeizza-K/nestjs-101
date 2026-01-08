import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { NotFoundException } from './overview/not-found.exception';
import { CreateUserDTO } from './overview/create-user.dto';

export type User = {
  id: number;
  name: string;
  email: string;
  password: number;
};

@Injectable()
export class AppService {
  private readonly users: Array<User> = [
    { id: 1, name: 'Juan', email: 'juan@email.com', password: 1234 },
    { id: 2, name: 'Helena', email: 'helena@email.com', password: 5678 },
    { id: 3, name: 'Benjamin', email: 'benja@email.com', password: 9101 },
    { id: 4, name: 'Celia', email: 'celia@email.com', password: 1112 },
  ];

  getUsers(): Array<User> {
    return this.users;
  }

  getHello(): string {
    return 'Hello Academy 2026!';
  }

  getUser(id: number): User {
    const findUser = this.users.find((user) => {
      return user.id === id;
    });
    if (!findUser) {
      throw new NotFoundException();
    }
    return findUser;
  }

  createUser(createUserDTO: CreateUserDTO): User {
    const newId = 5;

    const newUser: User = {
      id: newId,
      ...createUserDTO,
    };
    this.users.push(newUser);
    return newUser;
  }
}
