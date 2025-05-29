import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "../db";
import { differenceInDays, setYear, getMonth, getDate } from "date-fns";

/**
 * Calculates the number of days until the next occurrence of a birthday
 * @param birthDate - The person's birth date
 * @returns The number of days until their next birthday
 */

function getDaysUntilBirthday(birthDate: Date): number {
  const today = new Date();
  const thisYearBirthday = setYear(birthDate, today.getFullYear());
  const nextYearBirthday = setYear(birthDate, today.getFullYear() + 1);

  // If this year's birthday has passed, use next year's birthday
  const targetDate =
    thisYearBirthday < today ? nextYearBirthday : thisYearBirthday;
  return differenceInDays(targetDate, today);
}

/**
 * Router for handling person-related operations in the birthday tracker.
 * @router
 *
 * @procedure create - Creates a new person with name and birth date
 * @procedure update - Updates an existing person's information
 * @procedure delete - Deletes a person by ID
 * @procedure getAll - Retrieves all people in the database
 * @procedure getUpcoming - Gets people with birthdays in the next 30 days
 * @procedure getByMonth - Gets people with birthdays in a specific month (0-11)
 */
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
