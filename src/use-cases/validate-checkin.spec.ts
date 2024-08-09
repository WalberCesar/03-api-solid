import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-in-repository ";
import { ValidateCheckInUseCase } from "./validate-checkin";
import { ResourceNotFoundError } from "./errors/rosource-not-found-error";
import { LateCheckInValidateError } from "./errors/late-checkin-validate-error";

let checkInRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("Validate Check In Use case ", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to Validate the Check-In", async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });
    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    await expect(checkIn.validated_at).toEqual(expect.any(Date));
    await expect(checkInRepository.items[0].validated_at).toEqual(
      expect.any(Date),
    );
  });

  it("should not be able to Validate an inexistent Check-In", async () => {
    await expect(async () => {
      await sut.execute({
        checkInId: "id-01",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to Validate the Check-In after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2024, 8, 3, 20, 19));

    const createdCheckIn = await checkInRepository.create({
      gym_id: "id-01",
      user_id: "id-01",
    });

    const twentyOneMinutesInMiliseconds = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMiliseconds);

    await expect(async () => {
      await sut.execute({
        checkInId: createdCheckIn.id,
      });
    }).rejects.toBeInstanceOf(LateCheckInValidateError);
  });
});
