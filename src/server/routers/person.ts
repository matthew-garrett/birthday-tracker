import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "../db";
import { differenceInDays, setYear, getMonth, getDate } from "date-fns";

function getDaysUntilBirthday(birthDate: Date): number {
  const today = new Date();
  const thisYearBirthday = setYear(birthDate, today.getFullYear());
  const nextYearBirthday = setYear(birthDate, today.getFullYear() + 1);

  // If this year's birthday has passed, use next year's birthday
  const targetDate =
    thisYearBirthday < today ? nextYearBirthday : thisYearBirthday;
  return differenceInDays(targetDate, today);
}

export const personRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date",
        }),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.person.create({
        data: {
          name: input.name,
          birthDate: new Date(input.birthDate),
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date",
        }),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.person.update({
        where: { id: input.id },
        data: {
          name: input.name,
          birthDate: new Date(input.birthDate),
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.person.delete({
        where: { id: input.id },
      });
    }),

  getAll: publicProcedure.query(() => {
    return prisma.person.findMany();
  }),

  getUpcoming: publicProcedure.query(async () => {
    const people = await prisma.person.findMany();

    return people
      .map((person) => ({
        ...person,
        daysUntil: getDaysUntilBirthday(person.birthDate),
      }))
      .filter((person) => person.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }),

  getByMonth: publicProcedure
    .input(z.number().min(0).max(11))
    .query(async ({ input: month }) => {
      const people = await prisma.person.findMany();

      return people
        .filter((person) => getMonth(person.birthDate) === month)
        .map((person) => ({
          ...person,
          dayOfMonth: getDate(person.birthDate),
        }))
        .sort((a, b) => a.dayOfMonth - b.dayOfMonth);
    }),
});
