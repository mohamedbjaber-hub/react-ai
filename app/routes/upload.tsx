import { useState, type FormEvent } from "react";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";

const upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, SetFile] = useState<File | null>(null);
  const handelFileSelect = (file:File | null) =>{
    SetFile(file)
}
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if(!form) return;
    const formData = new FormData(form)
    const companyName = formData.get('compony-name');
    const jobTitle = formData.get('job-title');
    const jobDescription = formData.get('job-description');
    console.log(
        {companyName,jobTitle,jobDescription,file}
    )

  };

  return (
    <main className="bg-[url('./images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback pour votre dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>
              Telecharger Votre cv pour tester ATS score et calculer les ereurs
            </h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name"> Nom Entreprise</label>
                <input type="text" name="compony-name" placeholder="Nom Entreprise" id="compony-name"></input>
              </div>
              <div className="form-div">
                <label htmlFor="job-title"> Intitulé de la poste</label>
                <input type="text" name="job-title" placeholder="Intitulé de la poste" id="job-title"></input>
              </div>
              <div className="form-div">
                <label htmlFor="job-description"> Description de la poste</label>
                <textarea rows={5} name="job-description" placeholder="Description de la poste" id="job-description"></textarea>
              </div>
              <div className="form-div">
                <label htmlFor="uploader"> Upload Resume</label>
                <FileUploader onFileSelect={handelFileSelect} />
              </div>
              <button className="primary-button" type="submit">Analyser le CV</button>
              
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default upload;
