"use client"

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Code, Image, MessagesSquare, Music, Settings, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { size } from "pdfkit/js/page";



const tools = [
  {
    label:"conversation",
    icon:MessagesSquare,
    color:"text-violet-500",
    bgColor:"bg-violet-500/10",
    href:"/conversation"
  },
  {
    label:"Image Generator",
    icon:Image,
    color:"text-pink-500",
    bgColor:"bg-pink-500/10",
    href:"/image"
  },
  {
    icon: Code,
    label: 'Ai Buddy',
    bgColor:"bg-green-500/10",
    href: '/ai-companion',
    color: "text-green-500",
  },
]

const DashboardPage = () => {
  const router = useRouter();
  return ( 
<div className="flex flex-col items-center p-12 ">
  <div className="mb-8 space-y-4 ">
    <h2 className="  font-bold text-center text-[var(--text)] " style={{ fontSize:"2rem", lineHeight:"1rem"  }}>Explore The Power Of AI</h2>
    <p className="text-muted-foreground font-light  text-center ">Chat With The Smartest AI - Experience The Power of AI</p>
  </div>
  <div className="flex flex-wrap overflow-x-auto px-4 md:px-20 space-x-4 ">
    {tools.map((tool) => (
      <div key={tool.href} className="flex-none " style={{ width:"15rem" }}>
        <Card onClick={() => router.push(tool.href)} className="gap-5 p-4 bg-[var(--cards)] text-[var(--text)] border-black/5 flex items-center  hover:shadow-md transition cursor-pointer">
          <div className={cn("p-2 rounded-md", tool.bgColor)}>
            <tool.icon className={cn("w-8 h-8", tool.color)} />
          </div>
          <div className="font-semibold ">{tool.label}</div>
        </Card>
      </div>
    ))}
  </div>
</div>

    )
}

export default DashboardPage;




