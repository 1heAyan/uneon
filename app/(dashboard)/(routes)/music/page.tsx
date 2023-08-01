"use client";
import * as z from "zod"
import axios from "axios"
import { useState } from "react";
import { formSchema } from "./constants";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { MessagesSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { zodResolver} from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { useProModal } from "@/hook/use-pro-modal";
import { toast } from "react-hot-toast";


const MusicPage = () => {
    const proModal = useProModal();
    const router = useRouter();
    const [music, setMusic] = useState<string>();

    const form = useForm<z.infer<typeof formSchema>> ({
        resolver: zodResolver(formSchema),
        defaultValues:{
            prompt:""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        setMusic(undefined);
  
        const response = await axios.post('/api/music', values);
        console.log(response)
  
        setMusic(response.data.audio);
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
        title="Voice Generation"
        descripition="Turn your prompt into an voice."
        icon={MessagesSquare}
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
                { !music && !isLoading &&(
                    <div>
                        <Empty label="No Voice Genarated."/>
                    </div>
                )}
                {music && (
                    <audio controls className="w-full mt-8">
                        <source src={music} />
                    </audio>
                )}
            </div>
    </div>
    </div>
   );
};

export default MusicPage;