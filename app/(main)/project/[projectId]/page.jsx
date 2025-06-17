import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";
import { currentOrganization } from "@clerk/nextjs/server";

// import SprintCreationForm from "../_components/create-sprint";
// import SprintBoard from "../_components/sprint-board";

export default async function ProjectPage({ params }) {
  const { projectId } = params;
  const org = await currentOrganization();
  const orgId = org?.id;

  if (!orgId) {
    notFound(); // Could also throw error
  }

  const project = await getProject(projectId, orgId);

  if (!project) {
    notFound();
  }

  // return (
  //   <div className="container mx-auto">
  //     <SprintCreationForm
  //       projectTitle={project.name}
  //       projectId={projectId}
  //       projectKey={project.key}
  //       sprintKey={project.sprints?.length + 1}
  //     />

  //     {project.sprints.length > 0 ? (
  //       <SprintBoard
  //         sprints={project.sprints}
  //         projectId={projectId}
  //         orgId={project.organizationId}
  //       />
  //     ) : (
  //       <div>Create a Sprint from button above</div>
  //     )}
  //   </div>
  // );
  return (
    <div>hjhjfhshrud</div>
  );
}
