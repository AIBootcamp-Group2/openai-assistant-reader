import { LoadingCircle } from '../icons';
import React, { useState, useEffect } from 'react';
import UploadFiles_Configure from './UploadFiles_Component';
import { statusToProgress as statusToProgressRecord } from './statusToProgress';
import { AlignCenter, AlignCenterVertical } from 'lucide-react';

const statusToProgress: Record<string, number> = statusToProgressRecord;

interface WelcomeFormProps {
  assistantName: string;
  setAssistantName: (name: string) => void;
  assistantModel: string;
  setAssistantModel: (model: string) => void;
  startChatAssistant: () => void;
  isButtonDisabled: boolean;
  isStartLoading: boolean;
  statusMessage: string;
  fileIds: string[];
  setFileIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const WelcomeForm: React.FC<WelcomeFormProps> = ({
  assistantName,
  setAssistantName,
  assistantModel,
  setAssistantModel,
  startChatAssistant,
  isButtonDisabled,
  isStartLoading,
  statusMessage,
  fileIds,
  setFileIds,
}) => {
  const [lastProgress, setLastProgress] = useState(0);
  const baseStatusMessage = statusMessage.split(' (')[0];
  let progress = statusToProgress[baseStatusMessage] || 0;

  if (progress === 0 && lastProgress !== 0) {
    progress = lastProgress;
  } else if (progress !== lastProgress) {
    setLastProgress(progress);
  }

  const handleFileIdUpdate = (fileId: string) => {
    console.log("WelcomeForm: New file ID added:", fileId);
    setFileIds(prevFileIds => [...prevFileIds, fileId]);
  };

  const handleActiveFileIdsUpdate = (activeFileIds: string[]) => {
    setFileIds(activeFileIds);
  };

  useEffect(() => {
    console.log("Aktive Datei-IDs:", fileIds);
  }, [fileIds]);

  
  return (
    <div className="border-gray-500 bg-gray-200 sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border-2 sm:w-full">
      <div className="flex flex-col space-y-4 p-7 sm:p-10">
        <h1 className="text-lg font-semibold text-center py-4" style={{ color: 'rgb(123,104,238)' }}>
          ₊˚✧ Welcome to BookPal! ✧˚₊‧
        </h1>

        <img /*width="1024" height="1024"*/ src="OIG4 (2).jpg" alt="" className="middle" />
        
        <p className="text-lg font-semibold text-center py-4" style={{ color: 'rgb(30,144,255)' }}>
          
          <br/>
          જ⁀➴
          BookPal is an AI reader that enhances your reading experience by generating an OpenAI Assistant based on the book of your choice. 
          It allows you to interact with it, providing analysis, character descriptions, and more.
          Additionally, it generates images based on your prompts or the assistant's suggestions, making the reading experience immersive and enjoyable.
        </p>

        <h1 className="text-lg font-semibold text-center py-4" style={{ color: 'rgb(178, 102, 225)' }}>
          ── ˗ˏˋ ★ Let's have fun ★ ˎˊ˗ ── 
        </h1>

        <form className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="What are you reading today? Write the book's title..."
            value={assistantName}
            onChange={(e) => setAssistantName(e.target.value)}
            required
            className="p-2 border border-gray-200 rounded-md"
          />

          <div>
            <button
              type="button"
              onClick={() => setAssistantModel('gpt-4-1106-preview')}
              className={`p-1 border border-gray-400 rounded-md ${assistantModel === 'gpt-4-1106-preview' ? 'bg-blue-500 text-white' : ''}`}
              disabled={process.env.NEXT_PUBLIC_DEMO_MODE === 'true'}
            >
              GPT-4
            </button>
            <button
              type="button"
              onClick={() => setAssistantModel('gpt-3.5-turbo-1106')}
              className={`p-1 border border-gray-400 rounded-md ${assistantModel === 'gpt-3.5-turbo-1106' ? 'bg-blue-500 text-white' : ''}`}
            >
              GPT-3.5
            </button>
          </div>
        </form>
        
        <div className="upload-files-container"> 
          <UploadFiles_Configure 
            onFileIdUpdate={handleFileIdUpdate} 
            setActiveFileIds={handleActiveFileIdsUpdate} 
          />
        </div>
        {/* Start button in its own container */}
        <div className="flex justify-center p-4">
          <button
            type="button"
            onClick={startChatAssistant}
            disabled={isButtonDisabled || !assistantName || fileIds.length === 0|| fileIds.some(fileId => typeof fileId === 'undefined')}
            className="w-full p-2 rounded-md bg-green-500 text-white flex justify-center items-center relative overflow-hidden"
            style={{ 
              position: 'relative', 
              opacity: isButtonDisabled ? 0.5 : 1,
            }}
          >
            {isStartLoading && (
              <div 
                style={{ 
                  position: 'absolute', 
                  left: 0, 
                  top: 0, 
                  height: '100%', 
                  width: `${progress}%`, 
                  background: 'rgba(0, 0, 0, 0.2)' 
                }} 
              />
            )}
            {isStartLoading ? (
              <div className="flex flex-col items-center space-y-2">
                <LoadingCircle />
                <p className="text-sm text-gray-700">{statusMessage}</p>
              </div>
            ) : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeForm;
