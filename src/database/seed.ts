import { db } from "./client.ts";
import { enrollments, users, courses } from "./schema.ts";

async function seed() {
  try {
    // Insert users
    const usersInsert = await db
      .insert(users)
      .values([
        {
          name: "João Silva",
          email: "joao.silva@gmail.com.teste",
        },
        {
          name: "Maria Santos",
          email: "maria.santos@gmail.com.teste",
        },
        {
          name: "Pedro Oliveira",
          email: "pedro.oliveira@gmail.com.teste",
        },
      ])
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
      });

    console.log("Users: ", usersInsert);

    // Insert courses
    const coursesInsert = await db
      .insert(courses)
      .values([
        {
          title: "Curso Completo de Node.js",
          description:
            "Aprenda Node.js do básico ao avançado com projetos práticos",
        },
        {
          title: "Desenvolvimento React Profissional",
          description:
            "Domine React, Redux e as melhores práticas de desenvolvimento frontend",
        },
        {
          title: "Curso de JavaScript Moderno",
          description:
            "Aprenda as novas funcionalidades do JavaScript ES6+ e bibliotecas populares",
        },
      ])
      .returning({
        id: courses.id,
        title: courses.title,
        description: courses.description,
      });

    console.log("Courses: ", coursesInsert);

    // Insert enrollments
    const enrollmentsInsert = await db
      .insert(enrollments)
      .values([
        {
          courseId: coursesInsert[0].id,
          userId: usersInsert[0].id,
        },
        {
          courseId: coursesInsert[0].id,
          userId: usersInsert[1].id,
        },
        {
          courseId: coursesInsert[0].id,
          userId: usersInsert[2].id,
        },
        {
          courseId: coursesInsert[1].id,
          userId: usersInsert[0].id,
        },
        {
          courseId: coursesInsert[1].id,
          userId: usersInsert[1].id,
        },
        {
          courseId: coursesInsert[2].id,
          userId: usersInsert[0].id,
        },
      ])
      .returning({
        id: enrollments.id,
        courseId: enrollments.courseId,
        userId: enrollments.userId,
        createdAt: enrollments.createdAt,
      });

    console.log("Enrollments: ", enrollmentsInsert);

    console.log("Seeding successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed().catch((error) => {
  console.error("Failed to seed database:", error);
  process.exit(1);
});
