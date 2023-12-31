"use client"

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { formSchema } from "./constants";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatCompletionRequestMessage } from "openai";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { useProModal } from "@/hook/use-pro-modal";
import { toast } from "react-hot-toast";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import TextAreaComponent from "@/components/TextAreaComponent";
import rehypeRaw from 'rehype-raw'; // Import rehype-raw

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
  const [Messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

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

      form.reset();
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
          message.role === 'user' ? ' text-[var(--text)] bg-[var(--cards)] ' : 'bg-[#d0cece]  text-[#424242]'
        )}
      >
        <div className="flex items-start gap-x-2">
          {message.role === 'user' ? <UserAvatar /> : ""}
          <MarkdownRenderer content={message.content} />
        </div>
      </div>
    ));
  };
  return (
    <div className="w-full flex ">
      <div className="w-2/4 h-screen justify-center items-center flex flex-col">
        <div className="items-center justify-center flex  flex-col">
          <Button className="bg-[var(--activebtn)] text-[#ffff] l-0" disabled={isLoading} >
            Generate
          </Button>
        </div>
      </div>
      <div className="w-2/4  h-screen flex flex-col justify-end height-full min-h-screen">
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
            className="justify-between w-full bg-[var(--cards)] rounded-lg p-2 flex mt-12"
          >
            <FormField 
              name="prompt"
              render={({field}) => (
                <FormItem className="bg-[var(--cards)] w-full">
                  <FormControl className="">
                    <Input className="border-0 outline-none" disabled={isLoading} placeholder="Type Something To Generate." {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className=" bg-[var(--activebtn)] text-[#ffff]" disabled={isLoading}>
              Generate
            </Button>
          </form>
        </Form>
      </div>
    </div>
    </div>
  );
};

export default TextBot;