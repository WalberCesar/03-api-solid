import { describe, it, beforeEach, expect } from "vitest";
import { CheckInRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-in-repository ";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInRepository: CheckInRepository;

let sut: GetUserMetricsUseCase;

describe("Get user metrics Use case ", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();

    sut = new GetUserMetricsUseCase(checkInRepository);
  });

  it("should be able to check ins count from metrics", async () => {
    await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });
    await checkInRepository.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });

    const { checkIns } = await sut.execute({
      userId: "user-01",
    });

    await expect(checkIns).toEqual(2);
  });
});
