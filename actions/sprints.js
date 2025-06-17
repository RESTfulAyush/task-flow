"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createSprint(projectId, data, organisationId) {
  const { userId } = auth();
  const orgId = organisationId;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { sprints: true },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not found");
  }

  // Find the latest sprint number by name pattern (e.g., "PROJKEY-1")
  const lastSprint = await db.sprint.findFirst({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });

  let nextSprintNumber = 1;
  if (lastSprint) {
    const match = lastSprint.name.match(/-(\d+)$/); // matches the trailing number
    if (match) {
      nextSprintNumber = parseInt(match[1]) + 1;
    }
  }

  const sprintName = `${project.key}-${nextSprintNumber}`;

  const sprint = await db.sprint.create({
    data: {
      name: sprintName,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "PLANNED",
      projectId,
    },
  });
  return sprint;
}

export async function updateSprintStatus(sprintId, newStatus, organisationId) {
  const { userId } = auth(); // get userId only
  const orgId = organisationId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!orgId) {
    throw new Error("No Organization Provided");
  }

  // ✅ Fetch and verify admin role
  const { data: membershipList } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userMembership = membershipList.find(
    (membership) => membership.publicUserData.userId === userId
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization admins can update sprint status");
  }

  // ✅ Fetch sprint and validate org ownership
  const sprint = await db.sprint.findUnique({
    where: { id: sprintId },
    include: { project: true },
  });

  if (!sprint) {
    throw new Error("Sprint not found");
  }

  if (sprint.project.organizationId !== orgId) {
    throw new Error(
      "Unauthorized: Sprint does not belong to your organization"
    );
  }

  const now = new Date();
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);

  if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
    throw new Error("Cannot start sprint outside of its date range");
  }

  if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
    throw new Error("Can only complete an active sprint");
  }

  try {
    const updatedSprint = await db.sprint.update({
      where: { id: sprintId },
      data: { status: newStatus },
    });

    return { success: true, sprint: updatedSprint };
  } catch (error) {
    throw new Error("Error updating sprint: " + error.message);
  }
}
