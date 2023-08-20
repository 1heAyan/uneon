import {  ImageIcon } from "lucide-react";
import { Heading } from "@/components/heading";



interface EmptyProps {
  label: string;
}

export const EmptyImage = ({
  label
}: EmptyProps) => {
  return (
    <div className="flex items-center justify-center p-8">
      <Heading
        title="Image Generation"
        descripition="Turn your prompt into an image."
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/20"
        />
    </div>
  );
};