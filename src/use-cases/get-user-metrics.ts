import { CheckInRepository } from "@/repositories/check-ins-repository";

interface GetUserMetricsRequest {
  userId: string;
}

interface GetUserMetricsResponse {
  checkIns: number;
}
export class GetUserMetricsUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    userId,
  }: GetUserMetricsRequest): Promise<GetUserMetricsResponse> {
    const checkIns = await this.checkInRepository.countByUser(userId);

    return {
      checkIns,
    };
  }
}
