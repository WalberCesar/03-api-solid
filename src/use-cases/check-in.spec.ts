import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { CheckInRepository } from "@/repositories/check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-in-repository ";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let checkInRepository: CheckInRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check In Use case ", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);

    vi.useFakeTimers();

    await gymsRepository.create({
      id: "gym-01",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: -23.671603,
      longitude: -46.4420864,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to Check In", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user_id_01",
      userLatitude: -23.6716032,
      userLongitude: -46.4420864,
    });

    await expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to Check in twice in the same day", async () => {
    await sut.execute({
      gymId: "gym-01",
      userId: "user_id_01",
      userLatitude: -23.6716032,
      userLongitude: -46.4420864,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user_id_01",
        userLatitude: -23.6716032,
        userLongitude: -46.4420864,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to Check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2023, 9, 2, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user_id_01",
      userLatitude: -23.6716032,
      userLongitude: -46.4420864,
    });

    vi.setSystemTime(new Date(2023, 9, 3, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user_id_01",
      userLatitude: -23.6716032,
      userLongitude: -46.4420864,
    });

    await expect(checkIn.user_id).toEqual(expect.any(String));
  });

  it("should be not able to Check In on distance gym", async () => {
    await gymsRepository.items.push({
      id: "gym-02",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-23.634809),
      longitude: new Decimal(-46.4450046),
    });

    await expect(async () => {
      await sut.execute({
        gymId: "gym-02",
        userId: "user_id_01",
        userLatitude: -23.6716032,
        userLongitude: -46.4420864,
      });
    }).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
