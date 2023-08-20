"use client"

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { formSchema } from "./constants";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { MessagesSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatCompletionRequestMessage } from "openai";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useProModal } from "@/hook/use-pro-modal";
import { toast } from "react-hot-toast";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useConversationContext } from "@/components/context";

const ConverstionPage = () => {
  const { messages } = useConversationContext();
  const proModal = useProModal();
  const router = useRouter();
  const [Messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
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

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });
      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col justify-end height-full min-h-screen">
      <div className="px-4 lg:px-4">
        <div className="mt-4">

          {Messages.length === 0 && !isLoading && (
            <div>
              <Empty label="Our most Advance Conversation model."/>
            </div>
          )}
          <div className="flex flex-col gap-y-4">
            {Messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? " text-[var(--text)] bg-[var(--cards)] " : "bg-[var(--cards)] "
                )}
                        >
                        {message.role === "user" ? <UserAvatar/> : <BotAvatar/>}
                        <ReactMarkdown components={{
                            pre: ({ node, ...props }) => (
                                <div className="overflow-auto w-full my-2  p-2 rounded-lg">
                                    <pre {...props} />
                                </div>
                            ),
                            code: ({ node, ...props }) => (
                                <code className=" rounded-lg p-1" {...props} />
                            )
                        }} className="text-sm overflow-hidden leading-7">
                            {message.content || ""}
                        </ReactMarkdown>
                    </div>
                ))}
            </div>
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
            <Button className=" bg-[var(--button)]" disabled={isLoading}>
              Generate
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ConverstionPage;
