import { describe, it, beforeEach, expect } from "vitest";
import { GymsRepository } from "@/repositories/gyms-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: GymsRepository;

let sut: FetchNearbyGymsUseCase;

describe("fetch nearby gyms Use case ", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();

    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able fetch to nearby gyms", async () => {
    await gymsRepository.create({
      id: "gym-01",
      title: "Near gym",
      latitude: -23.6716032,
      longitude: -46.4420864,
      description: null,
      phone: null,
    });

    await gymsRepository.create({
      id: "gym-02",
      title: "Far gym",
      latitude: 23.6506915,
      longitude: -46.3493893,
      description: null,
      phone: null,
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.671603,
      userLongitude: -46.4420864,
    });

    await expect(gyms).toHaveLength(1);
    await expect(gyms).toEqual([
      expect.objectContaining({ title: "Near gym" }),
    ]);
  });
});
