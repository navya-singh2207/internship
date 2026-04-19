import dynamic from "next/dynamic";
import ExpenseTrackerApp from "@/components/expense-tracker/ExpenseTrackerApp";

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: true });
const FooterComponent = dynamic(() => import("@/components/Footer"), { ssr: true });

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background font-sans text-text-main selection:bg-primary/35 selection:text-white">
      <div
        className="pointer-events-none fixed inset-0 -z-10 page-ambient"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 page-grid opacity-40"
        aria-hidden
      />
      <Navbar />
      <main className="relative z-10">
        <ExpenseTrackerApp />
      </main>
      <div className="relative z-10">
        <FooterComponent />
      </div>
    </div>
  );
}
