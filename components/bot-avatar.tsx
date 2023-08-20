import { Avatar, AvatarImage } from "@/components/ui/avatar";


export const BotAvatar = () => {
  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage className="p-1 rounded-lg" src="/logo.jpeg" />
    </Avatar>
  );
};