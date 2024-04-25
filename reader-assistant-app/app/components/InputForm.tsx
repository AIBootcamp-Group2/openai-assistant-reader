// app/components/InputForm.ts

import clsx from 'clsx';
import Textarea from 'react-textarea-autosize';
import { SendIcon, LoadingCircle} from '../icons';

interface Props {
  input: string;
  setInput: (input: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  formRef: React.RefObject<HTMLFormElement>;
  disabled: boolean;
  chatStarted: boolean;
  isSending: boolean;
  isLoading: boolean;
  chatUploadedFiles: File[];
  setChatUploadedFiles: (files: File[]) => void;
  chatFileDetails: { name: string; type: string; size: number }[];
  setChatFileDetails: (details: { name: string; type: string; size: number }[]) => void;
  chatManager: any; 
  setChatStarted: (started: boolean) => void;
  setChatMessages: (messages: any[]) => void; 
  setStatusMessage: (message: string) => void;
  setIsSending: (sending: boolean) => void;
  setProgress: (progress: number) => void;
  setIsLoadingFirstMessage: (loading: boolean) => void;
}

const InputForm: React.FC<Props> = ({ input, setInput, inputRef, formRef, disabled, chatStarted, isSending, isLoading, chatUploadedFiles, setChatUploadedFiles, chatFileDetails, setChatFileDetails, chatManager, setChatStarted, setChatMessages, setStatusMessage, setIsSending, setProgress, setIsLoadingFirstMessage }) => {
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSending) {
      return;
    }
    const message = input;
    setInput('');
    setIsSending(true);
    if (chatManager) {
      const currentFiles = chatUploadedFiles; 
      setChatUploadedFiles([]); 
      setChatFileDetails([]); 
      try {
        await chatManager.sendMessage(message, currentFiles, chatFileDetails); 
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsSending(false);
      }
    }
    // const prompt = input;
    // setInput('');
    // setIsSending(true);
    // if (chatManager) {
    //   try {
    //     await chatManager.sendImagePrompt(prompt); 
    //   } catch (error) {
    //     console.error('Error sending message:', error);
    //   } finally {
    //     setIsSending(false);
    //   }
    // }
  };

return (
  <div className="fixed bottom-0 flex w-full justify-center mx-auto items-center bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
    <div className="flex flex-col items-stretch w-2/3 max-w-screen-md mr-2 ml-20">
      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        className="relative rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
      >
      <Textarea
        ref={inputRef}
        tabIndex={0}
        required
        rows={1}
        autoFocus
        placeholder="Whats on your mind?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && chatStarted) {
            formRef.current?.requestSubmit();
            e.preventDefault();
          }
        }}
        spellCheck={false}
        className="w-full focus:outline-none" 
        disabled={disabled || !chatStarted}
      />
        <button
          className={clsx(
            "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
            disabled || !chatStarted || input.trim().length === 0 || isSending
              ? "cursor-not-allowed bg-white"
              : "bg-green-500 hover:bg-green-600",
          )}
          disabled={disabled || !chatStarted || isLoading || isSending}
        >
          {isSending ? (
            <LoadingCircle />
          ) : (
            <SendIcon
              className={clsx(
                "h-4 w-4",
                input.length === 0 ? "text-gray-300" : "text-white",
              )}
            />
          )}
        </button>
      </form>
    </div>
    <div className="flex flex-col items-stretch w-1/10">
      <button
        className="bg-blue-500 p-2 text-white rounded shadow-xl"
        disabled={isLoading}
        // onClick={async () => {
        //   setImageIsLoading(true);
        //   const response = await fetch("api/images", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       message: messages[messages.length - 1].content,
        //     }),
        //   });
        //   const data = await response.json();
        //   setImage(data);
        //   setImageIsLoading(false);
        // }}
      >
        Generate image
      </button>
    </div>
  </div>
);
};

export default InputForm;