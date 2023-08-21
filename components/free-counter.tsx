"use client";
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { MAX_FREE_COUNTS } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProModal } from "@/hook/use-pro-modal";

export const FreeCounter = ({
  isPro = false,
  apiLimitCount = 0,
}: {
  isPro: boolean,
  apiLimitCount: number
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  

  if (isPro) {
    return null;
  }

  return (
    <div className="-rotate-90 " >
      <Card className="bg-[var(--progressbar)] border-0 " >
        <CardContent className="bg-[var(--progressbar)] " style={{borderRadius:".25rem"}}>
          <div className="" style={{width: "10rem"}}>
            <Progress  value={(apiLimitCount / MAX_FREE_COUNTS) * 100} />
          </div>
        </CardContent>
        </Card>
    </div>


  )
}