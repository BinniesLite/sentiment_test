import React, { useState } from 'react';
import { MessageCircle, Send, Brain, AlertCircle } from 'lucide-react';

export default function SentimentAnalyzer() {
  const [comment, setComment] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError('Please enter a comment to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: comment }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const sentimentLabel = await response.text();

      const cleanLabel = sentimentLabel.replace(/"/g, '');
      setResult(cleanLabel);
    } catch (err) {
      setError('Failed to analyze sentiment. Make sure your API is running on http://localhost:8000');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      case 'neutral':
        return '😐';
      default:
        return '🤔';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Sentiment Analyzer</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Enter your comment below and discover its emotional tone
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* Input Section */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                <MessageCircle className="inline h-4 w-4 mr-1" />
                Your Comment
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors"
                placeholder="Type your comment here... (e.g., 'I love this new feature!' or 'This is really frustrating')"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !comment.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Analyze Sentiment
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          {result && (
            <div className="mt-8 p-6 rounded-lg border-2 transition-all duration-300 animate-fadeIn">
              <div className={`${getSentimentColor(result)}`}>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl mr-3">{getSentimentEmoji(result)}</span>
                  <div>
                    <h3 className="text-2xl font-bold capitalize">{result}</h3>
                    <p className="text-sm opacity-75">Sentiment detected</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm">
                    Your comment has been classified as <strong>{result.toLowerCase()}</strong> sentiment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Section */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            Powered by Cardiff NLP Twitter RoBERTa sentiment model
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}