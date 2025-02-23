const ProgressBar = ({ steps, currentStep }) => {
    return (
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
    );
  };
  
  export default ProgressBar;
  