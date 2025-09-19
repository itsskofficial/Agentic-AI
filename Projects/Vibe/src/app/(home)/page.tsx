import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/projects-list";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-6 py-16 md:py-24 lg:py-32 xl:py-48">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="Vibe"
            width={50}
            height={50}
            className="hidden md:block"
          />
          <h1 className="text-2xl md:text-5xl font-bold text-center">
            Build something with Vibe
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-center">
            Create apps and websites by chatting with AI.
          </p>
        </div>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>
      <ProjectsList />
    </div>
  );
}