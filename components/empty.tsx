import {  MessagesSquare } from "lucide-react";
import { Heading } from "@/components/heading";



interface EmptyProps {
  label: string;
}

export const Empty = ({
  label
}: EmptyProps) => {
  return (
    <div className="flex items-center justify-center p-8">
      <Heading
        title="Conversation"
        descripition="Our most Advance Conversation model."
        icon={MessagesSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-700/20"
        />
    </div>
  );
};