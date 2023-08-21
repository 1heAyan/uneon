"use client";
import * as z from "zod"
import axios from "axios"
import { useEffect, useState } from "react";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Download, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { zodResolver} from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useProModal } from "@/hook/use-pro-modal";
import { toast } from "react-hot-toast";
import { useConversationContext } from "@/components/context";
import { EmptyImage } from "@/components/emptyimgy";


const ImagePage = () => {
  const { messages } = useConversationContext();
  const proModal = useProModal();
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const [conversationPrompt, setConversationPrompt] = useState<string | null>(null);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([]);

      if (conversationPrompt) {
        const response = await axios.post('/api/image', {
          prompt: conversationPrompt,
          amount: values.amount,
          resolution: values.resolution,
        });

        const urls = response.data.map((image: { url: string }) => image.url);
        setImages(urls);
        form.reset();
      } else {
        const response = await axios.post('/api/image', values);
        const urls = response.data.map((image: { url: string }) => image.url);
        setImages(urls);
        form.reset();
      }
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

  useEffect(() => {
    const lastUserMessage = messages
      .filter((message) => message.role === "user")
      .pop();

    if (lastUserMessage) {
      setConversationPrompt(`"${lastUserMessage}" make the words and sentences in the colons into a descriptive paragraph for dalle.2 to generate better and more detailed images. without any introduction or conclusion. word limit 50`);
    }
  }, [messages]);




  return (

        <div className="flex flex-col">
            <div className=" px-3 w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="mt-4 bg-[var(--cards)] rounded-lg w-full p-4 focus-within:shadow-sm grid grid-cols-12 gap-2"
                    >
                        <FormField
                            name="prompt"
                            render={({field}) => (
                                <FormItem className="col-span-12 lg:col-span-10 bg-[var(--form-items)]"style={{borderRadius:".2rem"}}>
                                    <FormControl className="">
                                        <Input className="border-none" disabled={isLoading} placeholder="Type Something To Generat." {...field}></Input>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-1 bg-[var(--form-items)] "style={{borderRadius:".2rem"}}>
                  <Select 
                    disabled={isLoading} 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl className="border-none">
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {amountOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-1 border-none bg-[var(--form-items)]" style={{borderRadius:".2rem"}}>
                  <Select 
                    disabled={isLoading} 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl className="border-none" >
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resolutionOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
                        <Button className="bg-[var(--activebtn)]  col-span-12 text-[#ffff] w-full" disabled={isLoading}> 
                            Generate
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="space-y-4 mt-4 px-3">
            {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader/>
            </div>
            )}
                {images.length === 0 && !isLoading &&(
                    <div>
                        <EmptyImage label="No Images Genarated."/>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {images.map((src) => (
                    <Card key={src} className=" overflow-hidden border-dotted  border-2 rounded-lg">
                    <div className="relative aspect-square">
                        <Image
                        fill
                        alt="Generated"
                        src={src}
                        />
                    </div>
                    <CardFooter className="p-2 bg-[#44b75c]">
                        <Button onClick={() => window.open(src)}  className="w-full ">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                        </Button>
                    </CardFooter>
                    </Card>
                ))}
                </div>
            </div>
        </div>
   );
};

export default ImagePage;