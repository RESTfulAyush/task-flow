"use server";

import NotFound from "@/app/not-found";
import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export async function createProject(data) {
  const { userId } = auth(); // Get only userId from auth()
  const { orgId, name, key, description } = data; // orgId comes from client

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!orgId) {
    throw new Error("No Organization Selected");
  }

  // Verify user is an admin of the organization
  const { data: membershipList } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userMembership = membershipList.find(
    (membership) => membership.publicUserData.userId === userId
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization admins can create projects");
  }

  try {
    const project = await db.project.create({
      data: {
        name,
        key,
        description,
        organizationId: orgId,
      },
    });

    return project;
  } catch (error) {
    throw new Error("Error creating project: " + error.message);
  }
}

// /actions/projects.ts
export async function getProject(projectId, orgId) {
  const { userId } = auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    notFound();
  }

  if (project.organizationId !== orgId) {
    return null;
  }

  return project;
}

// actions/projects.js or .ts
export async function deleteProject(projectId, orgId) {
  const { userId } = auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // Optional: Fetch membership list to verify role server-side
  const { data: membershipList } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userMembership = membershipList.find(
    (m) => m.publicUserData.userId === userId
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization admins can delete projects");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error(
      "Project not found or you don't have permission to delete it"
    );
  }

  await db.project.delete({
    where: { id: projectId },
  });

  return { success: true };
}
