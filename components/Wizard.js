import { useState } from "react";
import Image from "next/image";
import axios from "axios";

const steps = [
  { title: "Start", content: "Welcome to the Tailor AI Wizard. Click Next to begin.", options: [] },
  { title: "User Defines Task", content: "Describe your AI use case. The system will recommend an AI task for you.",
    options: ["Image-Text-to-Text", "Image Classification", "Mask Generation", "Text-to-Video"] },
  { title: "Machine Specs", content: "We need to check system specs for AI model compatibility. How would you like to proceed?",
    options: ["Gather local machine specs", "Connect to a target system"] },
  { title: "Show Specs", content: "The Machine specs collected are:",
    options: ["Proceed", "Abort"] },
  { title: "Suggest Models", content: "According to your specs, we recommend these models:", 
    options: ["deepseek-ai/DeepSeek-R1", "Zyphra/Zonos-v0.1-hybrid", "microsoft/OmniParser-v2.0", "mistralai/Mistral-Small-24B-Instruct-2501"] },
  { title: "Quantization", content: "To optimize performance, please choose a quantization factor.",
    options: ["Quantize by factor of 4 - faster answers, less accurate", "Quantize by factor of 2 - slower answers, more accurate"] },
  { title: "Deployment", content: "Moving on to the deployment", options: ["Upload blueprint.yaml to Dell Cloudify", "Cancel"] },
  { title: "Completed", content: "🎉 The wizard is complete! Thank you for using Tailor AI.", options: [] }
];

const Wizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [machineSpecs, setMachineSpecs] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleConnectToRemote = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/connect-to-remote");
      setMachineSpecs(response.data.specs);
    } catch (error) {
      console.error("Error connecting to remote system:", error);
    }
  };

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
      if (currentStep === 6 && selectedOption === "Upload blueprint.yaml to Dell Cloudify") {
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
    <div className="max-w-7xl w-full mx-auto p-20 bg-white shadow-2xl rounded-xl min-h-screen">
      <div className="text-center mb-10 flex flex-col items-center">
        <Image src="/images/logo.png" alt="Tailor AI Logo" width={350} height={350} />
      </div>
      
    <div className="mb-10">
      <h1 className="mb-6 text-center font-extrabold text-gray-800 text-3xl tracking-wide">
      STEPS
      </h1>
    <div className="flex justify-center items-center">
      <div className="w-full max-w-4xl mx-auto flex justify-center items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-40 text-center px-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                index === currentStep
                  ? "bg-orange-500 text-white border-orange-600"
                  : index < currentStep
                  ? "bg-orange-300 text-white border-orange-400"
                  : "bg-gray-300 text-gray-700 border-gray-400"
              }`}
            >
              <div className="w-1/3 h-16 flex items-center justify-center icon-step">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z" />
                </svg>
              </div>
              <div className="w-2/3 h-16 flex flex-col items-center justify-center px-1 rounded-r-lg">
                <h2 className="font-bold text-sm">{step.title}</h2>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-6 h-6 transform rotate-45 ${
                  index < currentStep ? "bg-orange-600" : "bg-gray-300"
                } -ml-3`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>

      <div className="text-center mb-14 text-3xl font-bold">
        {steps[currentStep].title}
      </div>
      <div className="text-center mb-14 text-lg text-gray-700">
        {steps[currentStep].content}
      </div>
      {currentStep === steps.length - 1 && uploadResponse && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100 text-gray-800 text-center">
        <strong>Upload Response:</strong> {uploadResponse}
      </div>
      )}
      {currentStep === 1 ? (
        <div className="text-center mb-14">
          <textarea
            className="w-full p-6 border rounded-lg text-xl"
            placeholder="Describe your AI use case..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          ></textarea>
        </div>
      ) : currentStep === 2 ? (
        <div className="text-center mb-14">
          {steps[currentStep].options.map((option, index) => (
            <button
              key={index}
              className={`block w-full px-8 py-4 mb-3 rounded-lg text-xl ${selectedOption === option ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
              onClick={() => {
                setSelectedOption(option);
                if (option === "Connect to a target system") {
                  handleConnectToRemote();
                }
              }}
            >
              {option}
            </button>
          ))}
        </div>
      ) : currentStep === 3 ? (
        <div className="text-left mb-14 bg-gray-100 p-8 rounded-lg">
          {machineSpecs ? (
            <pre className="text-gray-800 text-xl">{machineSpecs}</pre>
          ) : (
            <p className="text-gray-800 text-xl">Fetching system specs...</p>
          )}
          <div className="text-center mt-6">
            {steps[currentStep].options.map((option, index) => (
              <button
                key={index}
                className={`block w-full px-8 py-4 mb-3 rounded-lg text-xl ${selectedOption === option ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
                onClick={() => setSelectedOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : currentStep === 6 ? (
        <div className="text-center mb-14">
          {steps[currentStep].options.map((option, index) => (
            <button
              key={index}
              className={`block w-full px-8 py-4 mb-3 rounded-lg text-xl ${selectedOption === option ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
              onClick={() => setSelectedOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : steps[currentStep].options.length > 0 ? (
        <div className="text-center mb-14">
          {steps[currentStep].options.map((option, index) => (
            <button
              key={index}
              className={`block w-full px-8 py-4 mb-3 rounded-lg text-xl ${selectedOption === option ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
              onClick={() => setSelectedOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
      
      <div className="flex justify-between">
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
            disabled={currentStep === steps.length || (currentStep === 1 && userInput.trim() === "") || (steps[currentStep].options.length > 0 && selectedOption === null && currentStep !== 1)}
          >
            {isUploading ? "Uploading..." : "Next"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Wizard;
