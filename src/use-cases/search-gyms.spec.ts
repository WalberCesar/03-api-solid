import { describe, it, beforeEach, expect } from "vitest";
import { GymsRepository } from "@/repositories/gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: GymsRepository;

let sut: SearchGymsUseCase;

describe("Search gyms Use case ", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();

    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to search gyms", async () => {
    await gymsRepository.create({
      id: "gym-01",
      title: "javascript gym",
      latitude: -23.671603,
      longitude: -46.4420864,
      description: null,
      phone: null,
    });

    await gymsRepository.create({
      id: "gym-02",
      title: "typescript gym",
      latitude: -23.671603,
      longitude: -46.4420864,
      description: null,
      phone: null,
    });

    const { gyms } = await sut.execute({
      query: "javascript gym",
      page: 1,
    });

    await expect(gyms).toHaveLength(1);
    await expect(gyms).toEqual([
      expect.objectContaining({ title: "javascript gym" }),
    ]);
  });

  it("should be able to fetch paginated gym search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
      });
    }

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym 21" }),
      expect.objectContaining({ title: "JavaScript Gym 22" }),
    ]);
  });
});
