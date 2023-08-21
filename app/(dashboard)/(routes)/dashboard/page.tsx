import { SubscriptionButton } from "@/components/subscription-button";
import { Card } from "@/components/ui/card";
import { checkSubscription } from "@/lib/subscription";
import { cn } from "@/lib/utils";
import { Code, Image, MessagesSquare,  } from "lucide-react";


const tools = [
  {
    label: "conversation",
    icon: MessagesSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/conversation",
  },
  {
    label: "Image Generator",
    icon: Image,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    href: "/image",
  },
  {
    icon: Code,
    label: "Ai Buddy",
    bgColor: "bg-green-500/10",
    href: "/ai-companion",
    color: "text-green-500",
  },
];


const DashboardPage = async  () => {

  const isPro = await checkSubscription();


  return (
      <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20">
      <h2 className="  font-bold text-center text-[var(--text)] " style={{ fontSize: "2rem", lineHeight: "2rem" }}>
                Explore The Power Of AI
              </h2>
              <p className="text-muted-foreground font-light  text-center ">Chat With The Smartest AI - Experience The Power of AI</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 justify-center items-center m-4">
          {tools.map((tool) => (
            <div key={tool.href} className="flex-none" style={{ width: "15rem" }}>
              <Card
                className="gap-5 p-4 bg-[var(--cards)] text-[var(--text)] border-black/5 flex items-center hover:shadow-md transition cursor-pointer"
              >
      <div className={cn("p-2 rounded-md", tool.bgColor)}>
                      <tool.icon className={cn("w-8 h-8", tool.color)} />
                    </div>
                    <div className="font-semibold ">{tool.label}</div>
              </Card>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 justify-center items-center mt-4">
          <div className="flex-none" style={{ width: "15rem" }}>
          <Card
              className="gap-5 p-4 bg-[var(--cards)] text-[var(--text)] border-black/5 flex items-center hover:shadow-md transition cursor-pointer"
            >
          <div className="  space-y-4">
              <div className="text-muted-foreground text-sm">
                {isPro ? "You are currently on a Pro plan." : "You are currently on a free plan."}
              </div>
              <SubscriptionButton isPro={isPro} />
          </div>
            </Card>
          </div>
          <div className="flex-none" style={{ width: "15rem" }}>
            <Card
              className="gap-5 p-4 bg-[var(--cards)] text-[var(--text)] border-black/5 flex items-center hover:shadow-md transition cursor-pointer"
            >
          <div className="  space-y-4">
              <div className="text-muted-foreground text-sm">
                {isPro ? "You are currently on a Pro plan." : "You are currently on a free plan."}
              </div>
              <SubscriptionButton isPro={isPro} />
          </div>
            </Card>
            </div>
            </div>
            
          </div>
        </div>
  );
};

export default DashboardPage;


