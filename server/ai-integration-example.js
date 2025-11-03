/**
 * Example implementation for integrating OpenAI Vision API
 * 
 * Replace the mock AI functions in server/index.js with these implementations
 * when you have an OpenAI API key.
 * 
 * First, install OpenAI package (if not already installed):
 * npm install openai
 */

const OpenAI = require('openai');
const fs = require('fs');

class RealAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    if (this.apiKey) {
      this.client = new OpenAI({ apiKey: this.apiKey });
    }
  }

  /**
   * Classify waste types in an image using OpenAI Vision API
   */
  async classifyWaste(imagePath) {
    if (!this.client) {
      // Fallback to mock if no API key
      return this.mockClassifyWaste();
    }

    try {
      // Read image file and convert to base64
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');

      const response = await this.client.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image and classify the waste types present. Respond with a JSON array of objects, each with 'type' (plastic, metal, wood, paper, glass, organic, mixed, or other) and 'confidence' (0-100 percentage). Only include types with confidence > 20%. Example format: [{\"type\": \"plastic\", \"confidence\": 85}, {\"type\": \"metal\", \"confidence\": 60}]"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 300
      });

      // Parse the response
      const content = response.choices[0].message.content;
      let classifications;
      
      try {
        classifications = JSON.parse(content);
      } catch (e) {
        // If response is not JSON, try to extract JSON from markdown
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          classifications = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not parse AI response');
        }
      }

      // Ensure we have the right format
      if (!Array.isArray(classifications)) {
        classifications = [classifications];
      }

      // Sort by confidence and return top 3
      return classifications
        .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
        .slice(0, 3)
        .map(item => ({
          type: item.type || 'mixed',
          confidence: Math.round(item.confidence || 50)
        }));

    } catch (error) {
      console.error('Error in AI waste classification:', error);
      // Fallback to mock on error
      return this.mockClassifyWaste();
    }
  }

  /**
   * Verify cleanup by comparing original and cleanup images
   */
  async verifyCleanup(originalImagePath, cleanupImagePath) {
    if (!this.client) {
      // Fallback to mock if no API key
      return this.mockVerifyCleanup();
    }

    try {
      // Read both images
      const originalImage = fs.readFileSync(originalImagePath).toString('base64');
      const cleanupImage = fs.readFileSync(cleanupImagePath).toString('base64');

      const response = await this.client.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Compare these two images. The first image shows a garbage site, and the second shows the same location after cleanup. Analyze if the cleanup is successful - meaning the garbage from the first image has been removed in the second image. Respond with JSON: {\"verified\": true/false, \"similarity\": 0-100, \"message\": \"explanation\"}"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${originalImage}`
                }
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${cleanupImage}`
                }
              }
            ]
          }
        ],
        max_tokens: 200
      });

      const content = response.choices[0].message.content;
      let verification;

      try {
        verification = JSON.parse(content);
      } catch (e) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          verification = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not parse AI response');
        }
      }

      return {
        verified: verification.verified === true || verification.verified === 'true',
        similarity: Math.round(verification.similarity || 0),
        message: verification.message || 'Verification completed'
      };

    } catch (error) {
      console.error('Error in AI cleanup verification:', error);
      // Fallback to mock on error
      return this.mockVerifyCleanup();
    }
  }

  // Mock implementations (fallback)
  mockClassifyWaste() {
    const wasteTypes = ['plastic', 'metal', 'wood', 'paper', 'glass', 'organic', 'mixed'];
    const classifications = {};
    
    wasteTypes.forEach(type => {
      classifications[type] = Math.random() * 100;
    });
    
    const sorted = Object.entries(classifications)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type, confidence]) => ({ type, confidence: Math.round(confidence) }));
    
    return sorted;
  }

  mockVerifyCleanup() {
    const similarity = Math.random() * 40 + 60;
    const verified = similarity > 70;
    
    return {
      verified,
      similarity: Math.round(similarity),
      message: verified 
        ? 'Cleanup verified successfully!' 
        : 'Cleanup needs more work. Please ensure the area matches the original report.'
    };
  }
}

module.exports = RealAIService;
