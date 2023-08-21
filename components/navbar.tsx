import { getApiLimitCount } from "@/lib/api-limits";
import { UserButton } from "@clerk/nextjs";
import { checkSubscription } from "@/lib/subscription";
import { ModeToggle } from "./mode-toggle";
import { FreeCounter } from "./free-counter";
import MobileSidebar from "./mobile-sidebar";


const Navbar = async () => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();


  return ( 
    <div className="flex items-center p-2 fixed right-0 top-0 justify-end width-ful">
      <MobileSidebar isPro={isPro} apiLimitCount={apiLimitCount} />
    </div>
   );
}
 
export default Navbar;
