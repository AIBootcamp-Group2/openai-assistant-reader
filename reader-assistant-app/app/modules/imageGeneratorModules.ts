// Type: Module
// assistantModules.ts
import {
  runAssistantImage,
} from '../services/api';

/**
* Runs the image-generator for a given thread.
* @param {string} threadId - The ID of the thread.
* @returns {Promise<void>} - A promise that resolves when the assistant is successfully run.
*/
export const runImageGenerator = async (threadId: string): Promise<string | null> => {
  
  console.log('Running chat assistant...');

  const response = await runAssistantImage(threadId);
  const image = response.image;

  console.log('Image Generator run successfully');
  return image; 
};