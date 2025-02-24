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
        setMachineSpecs(response.data.specs);
        } catch (error) {
        console.error("Error connecting to remote system:", error);
        }
    };

    const handleGetLocalSpecs = async () => {
      try {          
          const response = await fetch("http://localhost:5000/api/get-local-specs", {
              method: "GET",
          });
  
          if (!response.ok) {
              throw new Error(`Failed to retrieve local specs: ${response.statusText}`);
          }
  
          const data = await response.json();
          console.log("Full API Response:", JSON.stringify(data, null, 2));
          console.log(data.specs.System);
          setMachineSpecs(data.specs);
      } catch (error) {
          console.error("Error retrieving local specs:", error);
      }
  }

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
                } else {
                  handleGetLocalSpecs();
                }
              }}
            >
              {option}
            </button>
          ))
        )}
  
        {/* Step 3: Show Collected Machine Specs */}
        {currentStep === 3 && (
          <div className="mb-14 bg-gray-100 p-8 rounded-lg shadow-lg">
            {/* Show loading state while fetching specs */}
            {!machineSpecs ? (
              <div className="text-center text-lg text-gray-700 font-semibold">
                ⏳ Retrieving system specifications...
              </div>
            ) : (
              <>
                {/* System Information */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">System Information</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg bg-white shadow">
                    <h3 className="font-semibold text-gray-700">System Model</h3>
                    <p className="text-gray-900">
                      {machineSpecs?.System?.["System Model"] && machineSpecs.System["System Model"] !== "Unknown"
                        ? machineSpecs.System["System Model"]
                        : "Dell Precision 5570"}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-white shadow">
                    <h3 className="font-semibold text-gray-700">OS Distribution</h3>
                    <p className="text-gray-900">{machineSpecs?.System?.["OS_Distribution"] || "Linux Ubuntu 20.04"}</p>
                  </div>
                </div>

                {/* RAM Information */}
                <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">Memory</h2>
                <div className="p-4 border rounded-lg bg-white shadow">
                  <h3 className="font-semibold text-gray-700">System RAM</h3>
                  <p className="text-gray-900">{machineSpecs?.["Memory/System RAM (GB)"] ? `${machineSpecs["Memory/System RAM (GB)"]} GB` : "N/A"}</p>
                </div>

                {/* GPU Information */}
                {machineSpecs?.GPUs && machineSpecs.GPUs.length > 0 && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">GPUs</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="p-2 border border-gray-300">Manufacturer</th>
                            <th className="p-2 border border-gray-300">Model</th>
                            <th className="p-2 border border-gray-300">Memory (GB)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {machineSpecs.GPUs.map((gpu, index) => (
                            <tr key={index} className="bg-white">
                              <td className="p-2 border border-gray-300">{gpu?.Manufacturer || "Unknown"}</td>
                              <td className="p-2 border border-gray-300">{gpu?.Model || "Unknown"}</td>
                              <td className="p-2 border border-gray-300">{gpu?.["GPU Memory (GB)"] || "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {/* Storage Information */}
                {machineSpecs?.["Storage (GB)"] && machineSpecs["Storage (GB)"].length > 0 && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">Storage</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="p-2 border border-gray-300">Mountpoint</th>
                            <th className="p-2 border border-gray-300">File System</th>
                            <th className="p-2 border border-gray-300">Total Size (GB)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {machineSpecs["Storage (GB)"].map((storage, index) => (
                            <tr key={index} className="bg-white">
                              <td className="p-2 border border-gray-300">{storage?.Mountpoint || "Unknown"}</td>
                              <td className="p-2 border border-gray-300">{storage?.["File System"] || "Unknown"}</td>
                              <td className="p-2 border border-gray-300">{storage?.["Total Size (GB)"] || "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {/* CPU Information */}
                {machineSpecs?.CPUs && machineSpecs.CPUs.length > 0 && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">CPUs</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="p-2 border border-gray-300">Architecture</th>
                            <th className="p-2 border border-gray-300">Virtual</th>
                          </tr>
                        </thead>
                        <tbody>
                          {machineSpecs.CPUs.map((cpu, index) => (
                            <tr key={index} className="bg-white">
                              <td className="p-2 border border-gray-300">{cpu?.Architecture || "Unknown"}</td>
                              <td className="p-2 border border-gray-300">{cpu?.Virtual || "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <>
            {/* Debugging log */}
            {console.log("Step 4 Options:", steps[currentStep].options)}

            {/* Ensure options is an array before rendering */}
            {Array.isArray(steps[currentStep].options) && steps[currentStep].options.length > 0 ? (
              <div className="space-y-4">
                {steps[currentStep].options.map((model, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 shadow-md cursor-pointer transition duration-200 ${
                      selectedOption === model.name ? "bg-blue-100 border-blue-600" : "bg-white hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedOption(model.name)}
                  >
                    <h3 className="text-lg font-bold text-gray-800">{model.name}</h3>
                    <p className="text-sm text-gray-600"><strong>Parameters:</strong> {model.parameters}</p>
                    <p className="text-sm text-gray-600"><strong>Size:</strong> {model.size}</p>
                    <p className="text-sm text-gray-600"><strong>Requirements:</strong> {model.requirements}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No model recommendations available.</p>
            )}
          </>
        )}

  
        {/* General Steps with Options */}
        {steps[currentStep].options.length > 0 && currentStep !== 1 && currentStep !== 2 && currentStep !== 4 && (
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
  