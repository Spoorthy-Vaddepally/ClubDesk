import React, { useState } from "react";
import { Lightbulb } from "lucide-react";
// Import the Google Generative AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyDzpFFQ1-ISrW0syy9mWXcIb7DqMlqNi2k";
const GEMINI_MODEL = "gemini-2.0-flash"; // Updated to working model

// Retry mechanism with exponential backoff
const retryWithExponentialBackoff = async (fn: () => Promise<any>, retries: number = 3, delay: number = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    // Wait for delay period
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry with exponential backoff (double the delay each time)
    return retryWithExponentialBackoff(fn, retries - 1, delay * 2);
  }
};

const AILearningResources: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Updated suggested questions to be related to club members and general club participation
  const [suggestedQuestions] = useState<string[]>([
    "How can I become more engaged and active in my club activities?",
    "What are the benefits of joining a club and how can I make the most of them?",
    "How do I effectively communicate with club leaders and other members?",
    "What steps should I take to eventually become a club leader or take on more responsibilities?",
  ]);

  // Function to clean up AI response text by removing markdown formatting
  const cleanAiResponse = (text: string) => {
    // Remove markdown bold formatting (**text**)
    return text.replace(/\*\*(.*?)\*\*/g, '$1')
               // Remove markdown italic formatting (*text* or _text_)
               .replace(/(\*|_)(.*?)\1/g, '$2')
               // Remove markdown code blocks (```text```)
               .replace(/```.*?```/gs, '')
               // Remove markdown inline code (`text`)
               .replace(/`(.*?)`/g, '$1')
               // Remove extra whitespace
               .trim();
  };

  const handleAskAI = async () => {
    setIsLoading(true);
    setError("");
    setAnswer("");

    // ✅ Local handling for date question (no API call)
    if (question.toLowerCase().includes("date") && question.toLowerCase().includes("today")) {
      const today = new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      // Clean the response before setting it
      setAnswer(cleanAiResponse(`Yes, today's date is **${today}**.`));
      setIsLoading(false);
      return;
    }

    try {
      // Use the Google Generative AI SDK with retry mechanism
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
      
      // Wrap the API call with retry mechanism
      const result = await retryWithExponentialBackoff(async () => {
        return await model.generateContent(question);
      }, 3, 1000); // 3 retries with exponential backoff starting at 1 second
      
      const response = await result.response;
      const rawText = response.text() || "Sorry, I couldn't generate a response.";
      
      // Clean the AI response to remove markdown formatting
      const cleanText = cleanAiResponse(rawText);
      
      setAnswer(cleanText);
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      // More specific error handling
      if (err.message?.includes("API_KEY_INVALID")) {
        setError("Invalid API key. Please check the configuration.");
      } else if (err.message?.includes("quota")) {
        setError("API quota exceeded. Please try again later.");
      } else if (err.message?.includes("timeout")) {
        setError("Request timeout. Please try again.");
      } else if (err.message?.includes("blocked")) {
        setError("Content was blocked due to safety filters. Please try rephrasing your question.");
      } else if (err.message) {
        setError("Failed to get response from Gemini API: " + err.message);
      } else {
        setError("An unknown error occurred while communicating with the AI service.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">
        Ask AI for Learning Resources
      </h2>

      <div className="mb-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me anything about learning resources..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-primary-500"
          rows={3}
        />
      </div>

      <button
        onClick={handleAskAI}
        disabled={isLoading || !question.trim()}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {isLoading ? "Thinking..." : "Ask AI"}
      </button>

      {answer && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Answer</h3>
          <p className="text-gray-700 whitespace-pre-line">{answer}</p>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Suggested Questions
        </h3>
        {isLoading && !suggestedQuestions.length ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedQuestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuestion(suggestion)}
                className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && !isLoading && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default AILearningResources;