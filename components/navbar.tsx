import { getApiLimitCount } from "@/lib/api-limits";
import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./mobile-sidebar";
import { checkSubscription } from "@/lib/subscription";
import { ModeToggle } from "./mode-toggle";


const Navbar = async () => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();


  return ( 
    <div className="flex items-center p-4 fixed right-0 top-0 justify-end width-ful">
      <MobileSidebar isPro={isPro} apiLimitCount={apiLimitCount} />
      <div className="flex w-full justify-end">
      </div>
      <ModeToggle/>
    </div>
   );
}
 
export default Navbar;
