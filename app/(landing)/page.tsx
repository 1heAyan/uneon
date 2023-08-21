import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage = () => {
    return (
        <div className="">
            <div className="fixed flex justify-end w-screen">
                <ModeToggle />
            </div>
            <div className="flex flex-col items-center justify-center h-screen gap-2">
                <div className="border-dotted p-2 border-2 rounded-lg gap-2">
                <div className="flex gap-2">
                    <Link href="/sign-in">
                        <Button className="bg-[var(--bgbtn)] text-[#ffff] mb-2">
                            Login
                        </Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button className="bg-[#44b75c] text-[#ffff]">
                            Sign-Up
                        </Button>
                    </Link>
                </div>
                <Link href={"/dashboard"} >
                    <Button className="bg-[var(--bgbtn)] text-[#ffff]">
                        Already Logged In?
                    </Button>
                </Link>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
