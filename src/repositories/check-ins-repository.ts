import { Checkin, Prisma } from "@prisma/client";

export interface CheckInRepository {
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>;
  findById(id: string): Promise<Checkin | null>;
  findManyByUserId(userId: string, page: number): Promise<Checkin[]>;
  countByUser(userId: string): Promise<number>;
  findByUserIdOnDate(userId: string, date: Date): Promise<Checkin | null>;
  save(checkIn: Checkin): Promise<Checkin>;
}
