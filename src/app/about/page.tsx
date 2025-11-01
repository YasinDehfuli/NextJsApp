"use client"
import ButtonOutlined from "@/components/buttons/button-outlined";
import ButtonPrimary from "@/components/buttons/button-primary";

export default function Home() {
    const handleClick = () => {
        console.log("clicked");
    }

    return (
        <div
            className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-black">
            <ButtonOutlined onClick={handleClick}>ارسال</ButtonOutlined>

            <ButtonPrimary onClick={handleClick}>تست</ButtonPrimary>
        </div>

    );
}
