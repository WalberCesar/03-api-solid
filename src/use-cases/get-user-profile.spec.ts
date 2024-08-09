import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/rosource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get user profile Use case ", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to Get user", async () => {
    const userCreated = await usersRepository.create({
      name: "kaique",
      email: "kaique123@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: userCreated.id,
    });

    await expect(user.name).toEqual("kaique");
  });

  it("should not be able to Get user profile with wrong id", async () => {
    await expect(async () => {
      await sut.execute({
        userId: "no-existing-id",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
