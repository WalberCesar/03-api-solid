import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let createGymsUseCase: CreateGymUseCase;

describe("Use case Create gym", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    createGymsUseCase = new CreateGymUseCase(gymsRepository);
  });

  it("should be able to Create gym", async () => {
    const { gym } = await createGymsUseCase.execute({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: -23.671603,
      longitude: -46.4420864,
    });

    await expect(gym.id).toEqual(expect.any(String));
  });
});
