import React, { useState } from "react";
import LineReaderComponent from "./LineReader";

// Example component showing how to use the improved LineReader
const LineReaderExample: React.FC = () => {
  const [showLineReader, setShowLineReader] = useState(false);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setShowLineReader(true)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Show Line Reader
        </button>

        {/* Question Container - this should have relative positioning */}
        <div className="relative bg-white border border-gray-200 rounded-xl p-8 shadow-lg min-h-96">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Sample Question Container
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>

            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Question 1:</h3>
              <p>
                What is the main theme of the passage above? Select the best
                answer from the options below:
              </p>
              <div className="mt-3 space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="q1" className="mr-2" />
                  A) The importance of hard work
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q1" className="mr-2" />
                  B) The value of education
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q1" className="mr-2" />
                  C) The benefits of technology
                </label>
              </div>
            </div>

            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>
          </div>

          {/* LineReader - positioned absolutely within this container */}
          {showLineReader && (
            <LineReaderComponent
              onClose={() => setShowLineReader(false)}
              initialPosition={{ x: 0, y: 50 }}
              containerWidth={800} // Adjust based on your container width
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LineReaderExample;
