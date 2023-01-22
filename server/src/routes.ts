import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";
import dayjs from "dayjs";

export async function appRoutes(app: FastifyInstance) {
  app.post("/habits", async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().int().min(0).max(6)),
      name: z.string(),
      email: z.string().email(),
    });

    const { title, weekDays, name, email } = createHabitBody.parse(
      request.body
    );

    const today = dayjs().startOf("day").toDate();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      await prisma.user.create({
        data: {
          email,
          name,
        },
      });
    }

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        habits: {
          create: {
            title,
            createdAt: today,
            weekDays: {
              create: weekDays.map((weekDay) => ({ weekDay })),
            },
          },
        },
      },
    });
  });

  app.get("/day", async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
      email: z.string().email(),
    });

    const { date, email } = getDayParams.parse(request.query);

    const parsedDate = dayjs(date).startOf("day");
    const weekDay = parsedDate.get("day");

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return;
    }

    const possibleHabits = await prisma.habit.findMany({
      where: {
        userId: user.id,
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
        date_userId: {
          date: parsedDate.toDate(),
          userId: user.id,
        },
      },
      include: {
        dayHabits: true,
      },
    });

    const completedHabits =
      day?.dayHabits.map((dayHabit) => dayHabit.habitId) ?? [];

    return {
      possibleHabits,
      completedHabits,
    };
  });

  app.patch("/habits/toggle", async (request, reply) => {
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
      email: z.string().email(),
    });

    const { id, email } = toggleHabitParams.parse(request.body);

    const today = dayjs().startOf("day").toDate();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return reply.status(404).send({
        message: "User not found",
      });
    }

    let day = await prisma.day.findUnique({
      where: {
        date_userId: {
          date: today,
          userId: user.id,
        },
      },
    });

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
          userId: user.id,
        },
      });
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        dayId_habitId_userId: {
          dayId: day.id,
          habitId: id,
          userId: user.id,
        },
      },
    });

    const habit = await prisma.habit.findUnique({
      where: {
        id,
      },
    });

    if (!habit) {
      return reply.status(404).send({
        message: "Habit not found",
      });
    }

    if (habit.userId !== user.id) {
      return reply.status(401).send({
        message: "You are not allowed to toggle this habit",
      });
    }

    if (dayHabit) {
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        },
      });
      return;
    } else {
      await prisma.dayHabit.create({
        data: {
          dayId: day.id,
          habitId: id,
          userId: user.id,
        },
      });
    }
  });

  app.get("/summary/global", async () => {
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

  app.get("/summary", async (request) => {
    const getSummaryQuery = z.object({
      email: z.string().email(),
    });

    const { email } = getSummaryQuery.parse(request.query);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return;
    }

    const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        D.userId,
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
              ON H.id = HWD.habitId AND H.userId = ${user.id}
            WHERE 
              HWD.weekDay = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
              AND H.createdAt <= D.date
          ) as amountOfHabits
      FROM days D WHERE D.userId = ${user.id}
    `;

    return summary;
  });
}
