
import { toast } from "sonner";

interface LLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const sendToLLM = async (prompt: string): Promise<string> => {
  try {
    // Get API key from localStorage (temporary solution)
    const apiKey = localStorage.getItem('openai_api_key');
    
    if (!apiKey) {
      // Provide a mock response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      return generateMockResponse(prompt);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Provide clear, concise, and helpful responses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: LLMResponse = await response.json();
    return data.choices[0]?.message?.content || 'No response received from AI.';
    
  } catch (error) {
    console.error('Error calling LLM:', error);
    
    // Fallback to mock response
    toast.error('Using demo mode - set OpenAI API key for real responses');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateMockResponse(prompt);
  }
};

const generateMockResponse = (prompt: string): string => {
  const responses = [
    "I'm a demo AI assistant. To get real AI responses, please set your OpenAI API key in the settings.",
    "This is a mock response for demonstration purposes. The chatbot is working correctly!",
    "I understand your question. In demo mode, I can only provide sample responses.",
    "Your message has been received. For actual AI responses, configure your API key.",
  ];
  
  // Simple logic to vary responses based on prompt content
  if (prompt.toLowerCase().includes('hello') || prompt.toLowerCase().includes('hi')) {
    return "Hello! I'm a demo AI assistant. How can I help you today?";
  }
  
  if (prompt.toLowerCase().includes('scraped') || prompt.toLowerCase().includes('content')) {
    return "I can see you've scraped some content. In demo mode, I provide sample responses. Configure your OpenAI API key for real analysis.";
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
};

// Utility to check if API key is set
export const isApiKeySet = (): boolean => {
  return !!localStorage.getItem('openai_api_key');
};

// Utility to set API key
export const setApiKey = (key: string): void => {
  localStorage.setItem('openai_api_key', key);
  toast.success('API key saved successfully');
};

// Utility to clear API key
export const clearApiKey = (): void => {
  localStorage.removeItem('openai_api_key');
  toast.success('API key cleared');
};
