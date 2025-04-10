import type { User } from "~/types/user";
import { users } from "~/models/user";

const getUser = (email: string, password: string) => users.find(
    (u: User) => u.email === email && u.password === password
  );

export const addUser = (user: User) => {
  const existingUser = getUser(user.email, user.password);

  if (!existingUser) {
    users.push(user);
  }
};
export const findUser = (id: string) => {}
export const findUserByEmailPassword = (email: string, password: string) => getUser(email, password);
export const deleteUser = (id: string) => {};