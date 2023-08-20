import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const LandingPage = () => {
    return(
        <div className="">
            <div className="fixed flex justify-end w-screen"><ModeToggle/></div>
            <div className=" flex items-center justify-center h-screen gap-2  ">
                 <div className="border-dotted p-2 border-2 rounded-lg gap-2 flex">
                <Link href="/sign-in">
                <Button className="bg-[var(--bgbtn)] text-[#ffff]">
                    Login
                </Button>
                </Link>
                <Link href="/sign-up">
                <Button className="bg-[#44b75c] text-[#ffff]">
                sign-up
                </Button>
                </Link>
</div>
            </div>
        </div>
    );
}

export default LandingPage;