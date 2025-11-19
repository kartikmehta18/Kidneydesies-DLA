// interface PredictionResponse {
//   result: string;
//   confidence?: number;
//   error?: string;
// }

// class ApiError extends Error {
//   status?: number;
  
//   constructor(message: string, status?: number) {
//     super(message);
//     this.name = 'ApiError';
//     this.status = status;
//   }
// }

// class KidneyClassificationAPI {
//   private baseUrl: string;

//   constructor(baseUrl: string = 'http://127.0.0.1:8080') {
//     this.baseUrl = baseUrl;
//   }

//   private async handleResponse(response: Response): Promise<any> {
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new ApiError(`HTTP ${response.status}: ${errorText}`, response.status);
//     }
    
//     const contentType = response.headers.get('content-type');
//     if (contentType && contentType.includes('application/json')) {
//       return response.json();
//     }
    
//     return response.text();
//   }

//   private fileToBase64(file: File): Promise<string> {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const result = reader.result as string;
//         // Remove data:image/jpeg;base64, prefix
//         const base64 = result.split(',')[1];
//         resolve(base64);
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   }

//   async predictKidneyDisease(imageFile: File): Promise<PredictionResponse> {
//     try {
//       const base64Image = await this.fileToBase64(imageFile);
      
//       const response = await fetch(`${this.baseUrl}/predict`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Access-Control-Allow-Origin': '*',
//         },
//         body: JSON.stringify({
//           image: base64Image
//         })
//       });

//       const result = await this.handleResponse(response);
      
//       // The Flask API returns the class name directly
//       const normalizedResult = result.toLowerCase();
      
//       return {
//         result: normalizedResult === 'normal' ? 'normal' : 'tumor',
//         confidence: 0.85 + Math.random() * 0.14 // Mock confidence for now
//       };
      
//     } catch (error) {
//       console.error('API Error:', error);
      
//       if (error instanceof TypeError && error.message.includes('fetch')) {
//         throw new ApiError('Unable to connect to the prediction server. Please ensure the Flask server is running on http://127.0.0.1:8080');
//       }
      
//       if (error instanceof ApiError) {
//         throw error;
//       }
      
//       throw new ApiError('An unexpected error occurred during prediction. Please try again.');
//     }
//   }

//   async healthCheck(): Promise<boolean> {
//     try {
//       const response = await fetch(`${this.baseUrl}/`, {
//         method: 'GET',
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//         }
//       });
//       return response.ok;
//     } catch {
//       return false;
//     }
//   }
// }

// export const kidneyAPI = new KidneyClassificationAPI();
// export type { PredictionResponse, ApiError };

interface PredictionResponse {
  result: string;
  confidence?: number;
  error?: string;
}

class ApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

class KidneyClassificationAPI {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://127.0.0.1:8080') {
    this.baseUrl = baseUrl;
  }

  private async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(`HTTP ${response.status}: ${errorText}`, response.status);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }

    return response.text();
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // remove prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // FIXED to match Flask API output
  async predictKidneyDisease(imageFile: File): Promise<PredictionResponse> {
    try {
      const base64Image = await this.fileToBase64(imageFile);

      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: base64Image })
      });

      const data = await this.handleResponse(response);

      // Flask returns: { class, class_index, confidence }
      return {
        result: data.class.toLowerCase(),       // "normal" or "tumor"
        confidence: data.confidence             // actual confidence from model
      };

    } catch (error: any) {
      console.error('API Error:', error);

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          'Cannot reach the server. Make sure Flask is running on http://127.0.0.1:8080'
        );
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError('Unexpected error occurred during prediction.');
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const kidneyAPI = new KidneyClassificationAPI();
export type { PredictionResponse, ApiError };
