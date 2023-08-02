// "use client";
// import * as z from "zod"
// import axios from "axios"
// import { useState } from "react";
// import { formSchema } from "./constants";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { MessagesSquare } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Heading } from "@/components/heading";
// import { Button } from "@/components/ui/button";
// import { zodResolver} from "@hookform/resolvers/zod";
// import { ChatCompletionRequestMessage } from "openai";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Empty } from "@/components/empty";
// import { Loader } from "@/components/loader";
// import { cn } from "@/lib/utils";
// import {  UserAvatar } from "@/components/user-avatar";
// import { BotAvatar } from "@/components/bot-avatar";
// import { useProModal } from "@/hook/use-pro-modal";
// import { toast } from "react-hot-toast";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";







// const ConverstionPage = () => {
//     const proModal = useProModal();
//     const router = useRouter();
//     const [Messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

//     const form = useForm<z.infer<typeof formSchema>> ({
//         resolver: zodResolver(formSchema),
//         defaultValues:{
//             prompt:""
//         }
//     });

// const isLoading = form.formState.isSubmitting;
  
// const onSubmit = async (values: z.infer<typeof formSchema>) => {
//   try {
//     const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };
//     const newMessages = [...Messages, userMessage];
    
//     const response = await axios.post('/api/conversation', { messages: newMessages });
//     setMessages((current) => [...current, userMessage, response.data]);
    
//     form.reset();
//         } catch (error: any) {
//         if (error?.response?.status === 403) {
//         proModal.onOpen();
//         }else{
//           toast.error("somthing went wroung");
//         }
//         } finally {
//             router.refresh();
//         }
// }


// const handleGeneratePDF = () => {
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfContainer = document.getElementById("pdfContainer");

//     if (pdfContainer) {
//       html2canvas(pdfContainer).then((canvas) => {
//         const imgData = canvas.toDataURL("image/png");
//         pdf.addImage(imgData, "PNG", 10, 10, 190, 277); // You can adjust the positioning and size of the content in the PDF
//         pdf.save("conversation_history.pdf");
//       });
//     } else {
//       console.error("pdfContainer element not found.");
//     }
//   };



//   return (
//     <div className="">
//         <Heading
//         title="Conversation"
//         descripition="Our most Advance Conversation model."
//         icon={MessagesSquare}
//         iconColor="text-violet-500"
//         bgColor="bg-violet-700/20"
//         />
//         <div id="pdfContainer" className="">
//         <div className="px-4 lg:px-8">
//             <div className="">
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)}
//                     className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
//                     >
//                         <FormField
//                             name="prompt"
//                             render={({field}) => (
//                                 <FormItem className="col-span-12 lg:col-span-10">
//                                     <FormControl className="m-0 p-0">
//                                         <Input className="border-0 outline-none 
//                                         focus-visible:ring-0 focus-visible:ring-transparant" disabled={isLoading} placeholder="Type Something To Generat." {...field}></Input>
//                                     </FormControl>
//                                 </FormItem>
//                             )}
//                         />
//                         <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}         onClick={handleGeneratePDF}> 
//                             Generate
//                         </Button>
//                     </form>
//                 </Form>
//             </div>
//             <div className="space-y-4 mt-4">
//                 {isLoading && (
//                     <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
//                         <Loader/>
//                     </div>
//                 )}
//                 {Messages.length === 0 && !isLoading &&(
//                     <div>
//                         <Empty label="No Conversation Started."/>
//                     </div>
//                 )}
//                     <div className="flex flex-col-reverse gap-y-4">
//                     {Messages.map((message) => (
//                         <div
//                         key={message.content}
//                         className={cn(
//                             "p-8 w-full flex items-start gap-x-8 rounded-lg",
//                             message.role === "user"
//                             ? "bg-white border border-black/10"
//                             : "bg-muted"
//                         )}
//                         >
//                         {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
//                         <p className="text-sm">{message.content}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     </div>
//     <Button
//         className="col-span-12 lg:col-span-2 w-full"
//         disabled={isLoading}
//         onClick={handleGeneratePDF}
//       >
//         Generate PDF
//       </Button>
// </div>
//    );
// };

// export default ConverstionPage;


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
import { ChatCompletionRequestMessage } from "openai";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import {  UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useProModal } from "@/hook/use-pro-modal";
import { toast } from "react-hot-toast";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";


const ConverstionPage = () => {
    const proModal = useProModal();
    const router = useRouter();
    const [Messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

    const form = useForm<z.infer<typeof formSchema>> ({
        resolver: zodResolver(formSchema),
        defaultValues:{
            prompt:""
        }
    });

const isLoading = form.formState.isSubmitting;
  
const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };
    const newMessages = [...Messages, userMessage];
    
    const response = await axios.post('/api/conversation', { messages: newMessages });
    setMessages((current) => [...current, userMessage, response.data]);
    
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
    <div className="">
        <Heading
        title="Conversation"
        descripition="Our most Advance Conversation model."
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
                {Messages.length === 0 && !isLoading &&(
                    <div>
                        <Empty label="No Conversation Started."/>
                    </div>
                )}
                <div className="flex flex-col-reverse gap-y-4">
                    {Messages.map((message) => (
                        <div key={message.content} className={cn(
                            "p-8 w-full flex items-start gap-x-8 rounded-lg",
                            message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
                            )}>
                            {message.role === "user" ? <UserAvatar/> : <BotAvatar/>}
                            <ReactMarkdown components={{
                                pre: ({ node, ...props }) => (
                                    <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                    <pre {...props} />
                                    </div>
                                ),
                                code: ({ node, ...props }) => (
                                    <code className="bg-black/10 rounded-lg p-1" {...props} />
                                )
                                }} className="text-sm overflow-hidden leading-7">
                                {message.content || ""}
                            </ReactMarkdown>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
   );
};

export default ConverstionPage;
