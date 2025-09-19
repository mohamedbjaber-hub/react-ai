// Update the import path to the correct module where prepareInstructions is exported
import { prepareInstructions } from "../../constants";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

const upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  /* my use Stat VAR */
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, SetFile] = useState<File | null>(null);
  /* function de traitment */

  const handleFileSelect = (file: File | null) => {
    SetFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);

    setStatusText("Chargement de document ...");
    const uploadedFile = await fs.upload([file]);
    if(!uploadedFile) return setStatusText("Erreur : chargement pdf impossible");
    
    setStatusText("Convertion de cv en image en cour...");
    const imageFile = await convertPdfToImage(file);
    if(!imageFile.file) return setStatusText("Erreur : probleme de convertion le pdf en image");

    setStatusText("Chargement de l'image");
    const uploadedImage = await fs.upload([imageFile.file]);
    if(!uploadedImage)return setStatusText("Erreur : chargement Image impossible");

    setStatusText("Preparation des données ...");
     const uuid = generateUUID();
      const data = {
          id: uuid,
          resumePath: uploadedFile.path,
          imagePath: uploadedImage.path,
          companyName, jobTitle, jobDescription,
          feedback: '',
      }

      await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyse encour ...");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );
    if (!feedback) return setStatusText("Erreur : problem dans l'analyse de CV");

    const feedbackTexte =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;
    data.feedback = JSON.parse(feedbackTexte);
    await kv.set(`resume${uuid}`, JSON.stringify(data));
    setStatusText("L'analyse de CV est terminé, redirection ...");
    console.log(data);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("compony-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;
    if (!file) return;
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
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
                <input
                  type="text"
                  name="compony-name"
                  placeholder="Nom Entreprise"
                  id="compony-name"
                ></input>
              </div>
              <div className="form-div">
                <label htmlFor="job-title"> Intitulé de la poste</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Intitulé de la poste"
                  id="job-title"
                ></input>
              </div>
              <div className="form-div">
                <label htmlFor="job-description">
                  {" "}
                  Description de la poste
                </label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Description de la poste"
                  id="job-description"
                ></textarea>
              </div>
              <div className="form-div">
                <label htmlFor="uploader"> Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button className="primary-button" type="submit">
                Analyser le CV
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default upload;
