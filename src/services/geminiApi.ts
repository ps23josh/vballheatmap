import { ApiError } from '../types';

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const analyzeImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  customPrompt?: string
): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new ApiError('Gemini API key not configured. Please add your API key to the environment variables.');
  }

  const prompt = customPrompt || `

		Context:
		Students are drawing on a heatmap based on their team's gameplay where:
		- successful points are drawn using O
		- unsuccessful points are drawn using X

----
		Your Role:
    Act as a PE teacher teaching concepts of net/ barrier games to primary school student on the following concept based on the heat map they drew for their team's game play:

Send the ball into space that is located close to the net, deep to the sides, or between the 2 opponents to force the opponent away from his central base position

As the teacher, provide 3 to 5 succinct pointers on the students' gameplay based on their heat map.
——
Act as a coach and provide an analysis of the gameplay based on the heat map of the court:
<number of Os> / <number of Xs + number of Os>
include any other insights

————-
Note:
DO NOT provide feedback regarding the correct/ incorrect marking of X and O because your feedback should be focused on their gameplay not annotation

Negative Examples:
"Good job marking the successful and unsuccessful groundings with O and X! 👍 I can see you placed them in the correct zone."

"Good job marking X for unsuccessful groundings and O for successful ones! 👍 You put them in the right areas of the court."
————
  `;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 2048,
    }
  };

  try {
    // Direct API call to Gemini
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific API errors
      if (response.status === 400) {
        throw new ApiError('Invalid request. Please check your image format and try again.', 'INVALID_REQUEST');
      } else if (response.status === 401) {
        throw new ApiError('Invalid API key. Please check your Gemini API key configuration.', 'INVALID_API_KEY');
      } else if (response.status === 403) {
        throw new ApiError('API access forbidden. Please check your API key permissions.', 'FORBIDDEN');
      } else if (response.status === 429) {
        throw new ApiError('Rate limit exceeded. Please wait a moment and try again.', 'RATE_LIMIT');
      } else {
        throw new ApiError(
          errorData.error?.message || `API request failed with status ${response.status}`,
          errorData.error?.code || 'API_ERROR',
          errorData.error?.details
        );
      }
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      throw new ApiError(data.error.message || 'API returned an error', data.error.code);
    } else {
      throw new ApiError('Invalid response format from Gemini API - no analysis text found');
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Network error. Please check your internet connection and try again.',
        'NETWORK_ERROR'
      );
    }
    
    console.error('Gemini API Error:', error);
    throw new ApiError(
      'Failed to analyze image. Please try again later.',
      'UNKNOWN_ERROR'
    );
  }
};
