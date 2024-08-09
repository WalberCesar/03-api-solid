import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use case ", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to Authenticate", async () => {
    await usersRepository.create({
      name: "kaique",
      email: "kaique123@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "kaique123@example.com",
      password: "123456",
    });

    await expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to Authenticate with wrong E-mail", async () => {
    await expect(async () => {
      await sut.execute({
        email: "kaique@example.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to Authenticate with wrong Password", async () => {
    await usersRepository.create({
      name: "kaique",
      email: "kaique123@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(async () => {
      await sut.execute({
        email: "kaique123@example.com",
        password: "126",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
