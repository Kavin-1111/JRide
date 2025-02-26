import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

const Rating = () => {
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [questionAnswers, setQuestionAnswers] = useState({});
  const { id } = useParams();

  // Define common emojis for rating
  const emojis = [
    { label: "5", icon: "😍" },
    { label: "4", icon: "😀" },
    { label: "3", icon: "😐" },
    { label: "2", icon: "😒" },
    { label: "1", icon: "😡" },
  ];

  // Common feedback questions for both driver and rider
  const commonQuestions = [
    { key: "safety", question: "Was the ride safe?" },
    { key: "behavior", question: "Was the driver/rider polite and respectful?" },
    { key: "cleanliness", question: "Was the vehicle clean and well-maintained?" },
    { key: "punctuality", question: "Did the driver/rider arrive on time?" },
    { key: "safetyPrecautions", question: "Did the driver/rider follow safety precautions?" },
  ];

  const handleRating = (label) => {
    setRating(label);
  };

  const handleQuestionChange = (questionKey, value) => {
    setQuestionAnswers({ ...questionAnswers, [questionKey]: value });
  };

  // Handle form submission
  const handleSubmit = () => {
    const feedbackData = {
      rating,
      feedback,
      questionAnswers,
    };

    // Submit logic (e.g., sending feedback to a backend API)
    console.log("Submitted Feedback Data: ", feedbackData);
  };

  return (
    <div className='flex justify-center items-center mt-30'>
    <div className="w-100 mx-5 p-4 border rounded-lg shadow-xl bg-white">
      <h2 className="text-lg font-semibold mb-2">Rate Your Ride</h2>

      {/* Emoji-Based Rating */}
      <div className="flex space-x-3 mb-3 justify-between">
        {emojis.map((emoji) => (
          <button
            key={emoji.label}
            onClick={() => handleRating(emoji.label)}
            className={`text-3xl transition-transform duration-200 ease-in-out 
              ${rating === emoji.label ? "opacity-100 scale-110" : "opacity-50"} 
              hover:opacity-100 hover:scale-125`}
          >
            {emoji.icon}
          </button>
        ))}
      </div>

      {/* Text Area for Feedback */}
      <textarea
        className="w-full p-2 border rounded-md mb-3"
        placeholder="Write your feedback..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />

      {/* Dynamic Feedback Questions */}
      {commonQuestions.map((q) => (
        <div key={q.key} className="mb-3">
          <p className="font-medium">{q.question}</p>
          {["Yes", "No"].map((option) => (
            <label key={option} className="mr-3">
              <input
                type="radio"
                name={q.key}
                value={option}
                checked={questionAnswers[q.key] === option}
                onChange={(e) => handleQuestionChange(q.key, e.target.value)}
              />{" "}
              {option}
            </label>
          ))}
        </div>
      ))}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        Submit
      </button>
    </div></div>
  );
};

export default Rating;
