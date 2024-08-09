import { describe, it, beforeEach, expect } from "vitest";
import { CheckInRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-in-repository ";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";

let checkInRepository: CheckInRepository;

let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch Check In History Use case ", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();

    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository);
  });

  it("should be able to fetch Check In history", async () => {
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
      page: 1,
    });

    await expect(checkIns).toHaveLength(2);
    await expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-01" }),
      expect.objectContaining({ gym_id: "gym-02" }),
    ]);
  });

  it("should be able to fetch paginated check in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-01",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 2,
    });

    await expect(checkIns).toHaveLength(2);
    await expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
