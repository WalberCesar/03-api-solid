import { CheckInRepository } from "@/repositories/check-ins-repository";
import { Checkin } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/rosource-not-found-error";
import dayjs from "dayjs";
import { LateCheckInValidateError } from "./errors/late-checkin-validate-error";

interface ValidateCheckInRequest {
  checkInId: string;
}

interface ValidateCheckInResponse {
  checkIn: Checkin;
}

export class ValidateCheckInUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInRequest): Promise<ValidateCheckInResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes",
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidateError();
    }

    checkIn.validated_at = new Date();

    await this.checkInRepository.save(checkIn);
    return { checkIn };
  }
}
