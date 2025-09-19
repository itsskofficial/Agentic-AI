import { Navbar } from "@/modules/home/ui/components/navbar";

interface Props {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: Props) {
  return (
    <main className="flex flex-col min-h-screen max-h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col px-4 pb-4">
        {children}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393E48_1px,transparent_1px)] bg-[radial-gradient(#DADADA_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>
    </main>
  );
}