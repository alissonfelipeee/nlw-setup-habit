import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";
import dayjs from "dayjs";

export async function appRoutes(app: FastifyInstance) {
  app.post("/habits", async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().int().min(0).max(6)),
    });

    const { title, weekDays } = createHabitBody.parse(request.body);

    const today = dayjs().startOf("day").toDate();

    await prisma.habit.create({
      data: {
        title,
        createdAt: today,
        weekDays: {
          create: weekDays.map((weekDay) => ({ weekDay })),
        },
      },
    });
  });

  app.get("/day", async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
    });

    const { date } = getDayParams.parse(request.query);

    const parsedDate = dayjs(date).startOf("day");
    const weekDay = parsedDate.get("day");

    const possibleHabbits = await prisma.habit.findMany({
      where: {
        createdAt: {
          lte: date,
        },
        weekDays: {
          some: {
            weekDay,
          },
        },
      },
    });

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true,
      },
    });

    const completedHabbits = day?.dayHabits.map(
      (dayHabbit) => dayHabbit.habitId
    );

    return {
      possibleHabbits,
      completedHabbits,
    };
  });

  app.patch("/habits/:id/toggle", async (request) => {
    const toggleHabbitParams = z.object({
      id: z.string().uuid(),
    });

    const { id } = toggleHabbitParams.parse(request.params);

    const today = dayjs().startOf("day").toDate();

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      },
    });

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
        },
      });
    }

    const dayHabbit = await prisma.dayHabit.findUnique({
      where: {
        dayId_habitId: {
          dayId: day.id,
          habitId: id,
        },
      },
    });

    if (dayHabbit) {
      await prisma.dayHabit.delete({
        where: {
          id: dayHabbit.id,
        },
      });
      return;
    } else {
      await prisma.dayHabit.create({
        data: {
          dayId: day.id,
          habitId: id,
        },
      });
    }
  });

  app.get("/summary", async () => {
    const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        (
          SELECT 
            cast(count(*) as float)
          FROM day_habits DH
          WHERE DH.dayId = D.id
          ) as completedHabits,
          (
            SELECT
              cast(count(*) as float)
            FROM habit_week_days HWD
            JOIN habits H
              ON H.id = HWD.habitId
            WHERE 
              HWD.weekDay = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
              AND H.createdAt <= D.date
          ) as amountOfHabits
      FROM days D
    `;

    return summary;
  });
}
