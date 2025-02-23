import axios from "axios";

const StepContent = ({
    currentStep,
    steps,
    userInput,
    setUserInput,
    selectedOption,
    setSelectedOption,
    setMachineSpecs,
    machineSpecs,
    uploadResponse,
  }) => {

    
    const handleConnectToRemote = async () => {
        try {
        const response = await axios.post("http://localhost:5000/api/connect-to-remote");
        console.log(response.data.specs)
        setMachineSpecs(response.data.specs);
        } catch (error) {
        console.error("Error connecting to remote system:", error);
        }
    };

    return (
      <div className="text-center mb-14">
        {/* Show Upload Response on the last step */}
        {currentStep === steps.length - 1 && uploadResponse && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-100 text-gray-800 text-center">
            <strong>Upload Response:</strong> {uploadResponse}
          </div>
        )}
  
        {/* Step 1: User Defines Task */}
        {currentStep === 1 && (
          <textarea
            className="w-full p-6 border rounded-lg text-xl"
            placeholder="Describe your AI use case..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        )}
  
        {/* Step 2: Choose between Local and Remote Machine Specs */}
        {currentStep === 2 && (
          steps[currentStep].options.map((option, index) => (
            <button
              key={index}
              className={`block w-full px-8 py-4 mb-3 rounded-lg text-xl ${
                selectedOption === option ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
              }`}
              onClick={() => {
                setSelectedOption(option);
                if (option === "Connect to a target system") {
                  handleConnectToRemote();
                }
              }}
            >
              {option}
            </button>
          ))
        )}
  
        {/* Step 3: Show Collected Machine Specs */}
        {currentStep === 3 && (
          <div className="text-left mb-14 bg-gray-100 p-8 rounded-lg">
            {machineSpecs ? (
              <pre className="text-gray-800 text-xl">{machineSpecs}</pre>
            ) : (
              <p className="text-gray-800 text-xl">Fetching system specs...</p>
            )}
          </div>
        )}
  
        {/* General Steps with Options */}
        {steps[currentStep].options.length > 0 && currentStep !== 1 && currentStep !== 2 && (
          steps[currentStep].options.map((option, index) => (
            <button
              key={index}
              className={`block w-full px-8 py-4 mb-3 rounded-lg text-xl ${
                selectedOption === option ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
              }`}
              onClick={() => setSelectedOption(option)}
            >
              {option}
            </button>
          ))
        )}
      </div>
    );
  };
  
  export default StepContent;
  