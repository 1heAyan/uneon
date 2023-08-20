"use client";

import qs from "query-string";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hook/use-debounce";

export const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("categoryId");
  const name = searchParams.get("name");

  const [value, setValue] = useState(name || "");
  const debouncedValue = useDebounce<string>(value, 500);


  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const query = { 
      name: debouncedValue, 
      categoryId: categoryId,
    };

    const url = qs.stringifyUrl({
      url: window.location.href,
      query
    }, { skipNull: true, skipEmptyString: true });

    router.push(url);
  }, [debouncedValue, router, categoryId])

  return (
    <div className="flex gap-2 ">
    <div className="relative  p-2 rounded-lg w-full flex items-center bg-[var(--searchbar)] " >
      {/* <Search className="absolute h-4 w-4  left-4 text-muted-foreground" /> */}
      <Input
        onChange={onChange}
        value={value}
        placeholder="Search here "
        className="  border-none bg-[var(--searchbar)] p-3  text-xs"
      />
    </div>
    <div className="">
        <a href="/ai-companion/companion/page">
        <button 
        className="
                  flex 
                  items-center 
                  text-center 
                  text-xs 
                  rounded-md 
                  hover:opacity-75 
                  transition
                  text-white
                  bg-[#44b75c]
                  p-5
        ">create</button>
        </a>
      </div>
    </div>
  )
};