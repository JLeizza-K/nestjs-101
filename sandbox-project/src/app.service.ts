import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

export type User = {
  id: number;
  name: string;
  email: string;
  password: number;
};

const users: Array<User> = [
  { id: 1, name: 'Juan', email: 'juan@email.com', password: 1234 },
  { id: 2, name: 'Helena', email: 'helena@email.com', password: 5678 },
  { id: 3, name: 'Benjamin', email: 'benja@email.com', password: 9101 },
  { id: 4, name: 'Celia', email: 'celia@email.com', password: 1112 },
];

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Academy 2026!';
  }
  getUser(id: number): User {
    const findUser = users.find((user) => {
      return user.id === id;
    });
    if (!findUser) {
      throw new Error('No user matches the given id');
    }
    return findUser;
  }

  createUser(name: string, email: string, password: number): User {
    const newId = randomInt(4, 10);

    const newUser: User = {
      id: newId,
      name,
      email,
      password,
    };
    users.push(newUser);
    return newUser;
  }
}
