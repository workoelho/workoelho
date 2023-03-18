import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  await prisma.project.create({
    data: {
      name: "Project 1",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente aperiam eaque necessitatibus illo impedit nulla minima nostrum inventore tempore. Ea placeat eaque architecto debitis dolor consectetur voluptatibus odio explicabo illo.",
    },
  });
  await prisma.project.create({
    data: {
      name: "Project 2",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente aperiam eaque necessitatibus illo impedit nulla minima nostrum inventore tempore. Ea placeat eaque architecto debitis dolor consectetur voluptatibus odio explicabo illo.",
    },
  });
  await prisma.project.create({
    data: {
      name: "Project 3",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente aperiam eaque necessitatibus illo impedit nulla minima nostrum inventore tempore. Ea placeat eaque architecto debitis dolor consectetur voluptatibus odio explicabo illo.",
    },
  });
} finally {
  await prisma.$disconnect();
}
