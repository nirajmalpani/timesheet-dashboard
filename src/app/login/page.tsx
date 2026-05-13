import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/login/LoginForm";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <section className="flex flex-1 items-center justify-center p-6 sm:p-10 bg-white">
        <LoginForm />
      </section>
      <aside className="hidden md:flex md:flex-1 items-center bg-brand-600 text-white p-12">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold">ticktock</h2>
          <p className="mt-4 text-base leading-relaxed text-white/90">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            ticktock, you can effortlessly track and monitor employee attendance
            and productivity from anywhere, anytime, using any internet-connected
            device.
          </p>
        </div>
      </aside>
      <p className="absolute bottom-3 right-4 text-xs text-white/70">
        © 2024 tentwenty
      </p>
    </div>
  );
}
