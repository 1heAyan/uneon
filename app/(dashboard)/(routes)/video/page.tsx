"use client";
import * as z from "zod"
import axios from "axios"
import { useState } from "react";
import { formSchema } from "./constants";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { VideoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { zodResolver} from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { useProModal } from "@/hook/use-pro-modal";
import { toast } from "react-hot-toast";


const VideoPage = () => {
    const proModal = useProModal();
    const router = useRouter();
    const [video, setVideo] = useState<string>();

    const form = useForm<z.infer<typeof formSchema>> ({
        resolver: zodResolver(formSchema),
        defaultValues:{
            prompt:""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        setVideo(undefined);
  
        const response = await axios.post('/api/video', values);
        console.log(response)
  
        setVideo(response.data[0]);
        form.reset();
        } catch (error: any) {
            if (error?.response?.status === 403) {
            proModal.onOpen();
            }else{
                toast.error("somthing went wroung");
              }
        } finally {
            router.refresh();
        }
}

  return (
    <div>
        <Heading
        title="Video Generation"
        descripition="Turn your prompt into an Video."
        icon={VideoIcon}
        iconColor="text-violet-500"
        bgColor="bg-violet-700/20"
        />
        <div className="px-4 lg:px-8">
            <div className="">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                    >
                        <FormField
                            name="prompt"
                            render={({field}) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-0 p-0">
                                        <Input className="border-0 outline-none 
                                        focus-visible:ring-0 focus-visible:ring-transparant" disabled={isLoading} placeholder="Type Something To Generat." {...field}></Input>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}> 
                            Generate
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="space-y-4 mt-4">
                {isLoading && (
                    <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                        <Loader/>
                    </div>
                )}
                { !video && !isLoading &&(
                    <div>
                        <Empty label="No Video Genarated."/>
                    </div>
                )}
                {video && (
                    <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
                        <source src={video} />
                    </video>
                )}
            </div>
    </div>
    </div>
   );
};

export default VideoPage;