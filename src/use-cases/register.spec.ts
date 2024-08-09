import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let registerUsersUseCase: RegisterUseCase;

describe("Use case Register", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    registerUsersUseCase = new RegisterUseCase(usersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await registerUsersUseCase.execute({
      name: "jhon doe",
      email: "jhondoes@example.com",
      password: "123456",
    });

    await expect(user.id).toEqual(expect.any(String));
  });

  it("shhould hash user password upon registrationnot be able to register with same E-mail", async () => {
    await registerUsersUseCase.execute({
      name: "jhon doe",
      email: "jhondoes@example.com",
      password: "123456",
    });

    await expect(() =>
      registerUsersUseCase.execute({
        name: "jhon doe",
        email: "jhondoes@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("shhould hash user password upon registration", async () => {
    const { user } = await registerUsersUseCase.execute({
      name: "jhon doe",
      email: "jhondoes@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHash = await compare("123456", user.password_hash);

    await expect(isPasswordCorrectlyHash).toBe(true);
  });
});
