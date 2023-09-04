"use client"

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { formSchema } from "./constants";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatCompletionRequestMessage } from "openai";
import { Form, FormControl, FormItem } from "@/components/ui/form";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { useProModal } from "@/hook/use-pro-modal";
import { toast } from "react-hot-toast";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeRaw from 'rehype-raw'; 
import TextAreaComponent from "@/components/TextAreaComponent";
import Tesseract from "tesseract.js";
import { ArrowDownToLine, Copy, ImagePlus, Mic, PenSquare } from "lucide-react";


type MarkdownRendererProps = {
  content: string;
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => (
  <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose">
    {content}
  </ReactMarkdown>
);

const TextBot = () => {
  const proModal = useProModal();
  const router = useRouter();
  const storedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
  const [Messages, setMessages] = useState<ChatCompletionRequestMessage[]>(storedMessages);
  const [inputValue, setInputValue] = useState(""); // State to track input value
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [voiceInput, setVoiceInput] = useState("");
  const { speechSynthesis } = window; // Import SpeechSynthesis API
  const [imageText, setImageText] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });




  // ...
 
  const convertImageToText = async (imageUrl: string) => {
    try {
      setIsImageLoading(true);
      const { data: { text } } = await Tesseract.recognize(imageUrl, "eng");
      setImageText(text);
  
      // Save the extracted text as a bot response
      const botMessage: ChatCompletionRequestMessage = {
        role: "assistant", // Use "assistant" role
        content: text,
      };
      setMessages((current) => [...current, botMessage]);
  
      setIsImageLoading(false);
  
      // Save the updated messages in local storage
      const updatedMessages = [...Messages, botMessage];
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
    } catch (error) {
      console.error("Error converting image to text:", error);
      setIsImageLoading(false);
      setImageText(null);
    }
  };
  
  
  
  
  
  
  

  useEffect(() => {
    if (voiceInput) {
      form.setValue("prompt", voiceInput);
      form.handleSubmit(onSubmit)();
    }
  }, [voiceInput]);

  useEffect(() => {
    setVoiceInput(""); // Clear the voice input
    form.setValue("prompt", ""); // Clear the form's prompt field
  }, [Messages]);

  const handleClearChat = () => {
    setMessages([]); // Clear messages in state
    localStorage.removeItem("messages"); // Clear messages in local storage
  };

  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // Update input value
  };



  // const handleDownload = () => {
  //   const conversationText = Messages.map((message) => {
  //     return `${message.role === "user" ? "User:" : "AI:"} ${message.content}`;
  //   }).join("\n");

  //   const pdf = new jsPDF();
  //   pdf.text(conversationText, 10, 10);

  //   const filename = generateFilenameFromConversation(); // Call a function to generate a meaningful filename
  //   pdf.save(filename);
  // };

  const generateFilenameFromConversation = () => {
    // Implement logic here to generate a meaningful filename
    // based on the content of the conversation.
    // You could use NLP techniques or keyword extraction.
    // For this example, let's use a default filename "Conversation.pdf".
    return "Conversation.pdf";
  };



  const isLoading = form.formState.isSubmitting;


  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...Messages, userMessage];
  
      const response = await axios.post('/api/conversation', {
        messages: newMessages,
      });
  
      setMessages((current) => [...current, userMessage, response.data]);
      localStorage.setItem("messages", JSON.stringify([...Messages, userMessage, response.data]));
      setInputValue("");
      // Check if the AI's response is from the user input
      const updatedMessages = [...Messages, userMessage, response.data];
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
      
      form.reset();

      if (voiceInput) {
        const utterance = new SpeechSynthesisUtterance(response.data.content);
        speechSynthesis.speak(utterance);
      }
    
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      router.refresh();
    }
  };
  

  // Voice Input State
  const [isListening, setIsListening] = useState(false);

  // Voice Recognition Handler
  const handleVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceInput(transcript);
    };

    recognition.start();
  };


  const processMessagesToMarkdown = () => {
    return Messages.map((message) => {
      const role = message.role === 'user' ? 'user' : 'bot';
      const content = message.content || '';
  
      return {
        role,
        content,
      };
    });
  };
  
  const renderMessages = () => {
    const processedMessages = processMessagesToMarkdown();
    return processedMessages.map((message, index) => (
      <div
        key={index}
        className={cn(
          'p-8 w-full flex items-start gap-x-8 rounded-lg',
          message.role === 'user'
            ? ' text-[var(--text)] bg-[var(--cards)] '
            : 'bg-[#d0cece]  text-[#424242]'
        )}
      >
        <div className="flex items-start gap-x-2 w-full">
          {message.role === 'user' ? <UserAvatar /> : ""}
          {editingMessageIndex === index ? (
            <>
            <TextAreaComponent
              value={Messages[index].content} // Provide the content of the message being edited
              onChange={(value) => handleEditChange(index, value)}
              
            />
            <button
              onClick={() => handleSaveEdit(index)}
              className="bg-[var(--activebtn)] text-white px-2 py-1 rounded-md"
            >
              Save
            </button>
            </>
          ) : (
            <>
              <MarkdownRenderer content={message.content} />
              {message.role !== 'user' && (
                <div className="flex gap-x-2">
                  <Copy
                  onClick={() => {
                      navigator.clipboard.writeText(message.content);
                      toast.success('Copied to clipboard!');
                    }}
                  />
                   <a
                        href={`data:text/plain;charset=utf-8,${encodeURIComponent(message.content)}`}
                        download={`bot_response_${index}.txt`}
                      >
                        <ArrowDownToLine />
                      </a>
                  <PenSquare
                    onClick={() => handleEditClick(index)}
                  />
                </div>
              )}
              
            </>
          )}
        </div>
      </div>
    ));
  };

  const handleEditClick = (index: number) => {
    setEditingMessageIndex(index);
  };

  const handleEditChange = (index: number, value: string) => {
    const updatedMessages = [...Messages];
    updatedMessages[index].content = value;
    setMessages(updatedMessages);
  };

  const handleSaveEdit = (index: number) => {
    setEditingMessageIndex(null);
    // Perform any save/edit operations you need here
  };

  
  

  return (
    <div className="flex flex-col justify-end height-full min-h-screen  w-full">
      <div className="relative">
        <div className=" top-0 right-0 m-4 z-10 fixed">
          <Button
            className="bg-[var(--activebtn)] text-[#ffff]"
            onClick={handleClearChat}
            disabled={isLoading || form.formState.isSubmitting}
          >
            Clear Chat
          </Button>
        </div>
        </div>
      <div className="px-4 lg:px-4">
        <div className="mt-4">

          {Messages.length === 0 && !isLoading && (
            <div>
              <Empty label="Our most Advance Conversation model."/>
            </div>
          )}
      <div className="flex flex-col gap-y-4">{renderMessages()}</div>
            {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader/>
            </div>
          )}
        </div>
    </div>

    <div className="sticky bottom-3 px-3 w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="justify-between w-full bg-[var(--cards)] rounded-lg p-2 flex mt-12 items-center"
          >
            <FormItem className="bg-[var(--cards)] w-full">
              <FormControl className="">
                <Input
                  className="border-0 outline-none"
                  disabled={isLoading || isListening}
                  placeholder="Type Something To Generate."
                  value={form.getValues("prompt") || voiceInput}
                  onChange={(e) => {
                    form.setValue("prompt", e.target.value);
                    handleInputChange(e); // Update input value
                  }}
                ></Input>
              </FormControl>
            </FormItem>


            {inputValue.trim() === "" ? ( // Conditionally render Mic icon or Generate button
              <Mic
                className={`text-[#44b75c] ${
                  isLoading || form.formState.isSubmitting ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={handleVoiceInput}
              />
            ) : (
              <Button
                className="bg-[var(--activebtn)] text-[#ffff]"
                disabled={isLoading || form.formState.isSubmitting}
                type="submit"
              >
                Generate
              </Button>
            )}
    {/* <button
      className={`bg-[var(--activebtn)] text-[#ffff] p-2 rounded-full cursor-pointer ml-2 ${
        Messages.length === 0 ? "opacity-50 pointer-events-none" : ""
      }`}
      onClick={handleDownload}
    >
      Download PDF
    </button> */}
    <ImagePlus
    className={`text-[#44b75c] cursor-pointer ml-2 ${
      Messages.length === 0 ? "opacity-50 pointer-events-none" : ""
    }`}
    onClick={() => {
      // Trigger the hidden file input
      const input = document.getElementById("imageInput");
      if (input) {
        input.click();
      }
    }}
  />
  <input
    id="imageInput"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        convertImageToText(imageUrl);
      }
    }}
  />
          </form>
        </Form>
      </div>
    </div>
  );
};
export default TextBot;



