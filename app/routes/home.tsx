import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resum CV AI" },
    { name: "description", content: "AI Feddback CV " },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
    const navigate = useNavigate();
    useEffect(() => {
        console.log('auth 2', auth.isAuthenticated)
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    },[auth.isAuthenticated])
  return (
    <main className="bg-[url('./images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-6">
          <h1>Tester votre CV</h1>
          <h2>Valider votre condidature et verfier votre CV avec AI </h2>
        </div>
        {resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
