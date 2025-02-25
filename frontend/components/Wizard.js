import { useState } from "react";
import Image from "next/image";
import ProgressBar from "./ProgressBar";
import StepContent from "./StepContent";

const modelDetails = [
  {
    name: "LLaMA 2-13B",
    parameters: "13B",
    size: "48GB",
    requirements: "Requires 24GB RAM",
  },
  {
    name: "Mistral-Small-24B-Instruct-2501",
    parameters: "24B",
    size: "25GB",
    requirements: "Requires 64GB RAM",
  },
  {
    name: "Falcon-40B",
    parameters: "40B",
    size: "50GB",
    requirements: "Requires 48GB RAM",
  },
  {
    name: "Mistral-7B",
    parameters: "7B",
    size: "45GB",
    requirements: "Requires 16GB RAM",
  }
];

const modelDownloadOptions = [
  { name: "Q3_K_L", size: 12.40 },
  { name: "Q4_K_M", size: 14.33 },
  { name: "Q6_K", size: 19.35 },
  { name: "Q8_0", size: 25.05 }
];

const steps = [
  { title: "Start", content: "Welcome to the Tailor AI Wizard. Click Next to begin.", options: [] },
  { title: "User Defines Task", content: "Describe your AI use case. The system will recommend an AI task for you.",
    options: ["Image-Text-to-Text", "Image Classification", "Mask Generation", "Text-to-Video"] },
  { title: "Machine Specs", content: "ready to analyze system specs",
    options: ["Local machine", "Remote VM"] },
  { title: "Show Specs", content: "The Machine specs collected are:",
    options: ["Proceed", "Abort"] },
  { title: "Suggest Models", content: "According to your specs, we recommend these models:", 
    options: modelDetails },
  { title: "Choose a download option", 
    options: modelDownloadOptions },
  { title: "Quantization", options: ["1", "2"]},
  { title: "Deployment", content: "Moving on to the deployment", options: ["Deploy model", "Cancel"] },
  { title: "Completed", content: "🎉 The wizard is complete! Thank you for using Tailor AI.", options: [] }
];

const Wizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [machineSpecs, setMachineSpecs] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isStepComplete, setIsStepComplete] = useState(true);

  const handleUploadBlueprint = async () => {
    setIsUploading(true);
    try {
      const response = await fetch("http://localhost:5000/api/upload-blueprint", { method: "POST" });
      const data = await response.json();
      setUploadResponse(data.message || `Error: ${data.error}`);
    } catch (error) {
      setUploadResponse("An error occurred while uploading the blueprint.");
      console.error(error);
    }
    setIsUploading(false);
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1 ) {
      if (currentStep === 7 && selectedOption === "Deploy model") {
        setIsUploading(true);
        await handleUploadBlueprint();
        setIsUploading(false);
      }
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setUserInput("");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedOption(null);
      setUserInput("");
    }
  };

  return (
    <div className="max-w-9xl w-full mx-auto p-20 bg-white shadow-2xl rounded-xl min-h-screen">
      <div className="text-center mb-10 flex flex-col items-center">
        <Image src="/images/logo.png" alt="Tailor AI Logo" width={350} height={350} />
      </div>

      {/* Progress Bar */}
      <ProgressBar steps={steps} currentStep={currentStep} />

      <div className="text-center mb-14 text-3xl font-bold">{steps[currentStep].title}</div>
      <div className="text-center mb-14 text-lg text-gray-700">{steps[currentStep].content}</div>

      {/* Step Content */}
      <StepContent
        currentStep={currentStep}
        steps={steps}
        userInput={userInput}
        setUserInput={setUserInput}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        setMachineSpecs={setMachineSpecs}
        machineSpecs={machineSpecs}
        uploadResponse={uploadResponse}
        setIsStepComplete={setIsStepComplete}
      />

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
        <button
          className="px-8 py-4 bg-gray-500 text-white rounded-lg text-xl disabled:opacity-50"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Previous
        </button>
        {currentStep === steps.length - 1 ? (
          <button
            className="px-8 py-4 bg-green-600 text-white rounded-lg text-xl"
            onClick={() => setCurrentStep(0)}
          >
            Restart Wizard
          </button>
        ) : (
          <button
            className="px-8 py-4 bg-orange-500 text-white rounded-lg text-xl disabled:opacity-50"
            onClick={nextStep}
            disabled={currentStep === steps.length || (currentStep === 1 && userInput.trim() === "") 
            || (steps[currentStep].options.length > 0 && selectedOption === null && currentStep !== 1 && currentStep !==6) || (!isStepComplete)}
          >
            {isUploading ? "Uploading..." : "Next"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Wizard;
