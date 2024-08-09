import { Checkin } from "@prisma/client";
import { CheckInRepository } from "@/repositories/check-ins-repository";

interface FetchUserCheckInsHistoryRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInsHistoryResponse {
  checkIns: Checkin[];
}
export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryRequest): Promise<FetchUserCheckInsHistoryResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(
      userId,
      page,
    );

    return {
      checkIns,
    };
  }
}
