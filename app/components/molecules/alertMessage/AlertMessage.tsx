import { NSIcons } from "@/components/atoms/Icons/NSIcons";
import "./style.css";

const Icons = {
    loading: {
        icon: <NSIcons.Load className="w-5 h-5 mr-2 animate-spin" />,
        className: "bg-gray-500"
    },
    error: {
        icon: <NSIcons.Error className="w-5 h-5 mr-2" />,
        className: "bg-red-500"
    },
    success: {
        icon: <NSIcons.Check className="w-5 h-5 mr-2" />,
        className: "bg-green-500"
    }
}


export const AlerMessage = ({ message, type, animation }: { message: string, type?: 'error' | 'success' | 'loading', animation: boolean }) => {
    return (
        <div id="message" className={`-z-0 absolute right-5 bottom-5 anima flex items-center justify-center ${animation ? "start" : "end"} p-4 rounded-lg text-white ${Icons[type || 'success'].className} transition-all`}>
            {Icons[type || 'success'].icon}
            <span className="text-sm font-semibold">{message}</span>
        </div>
    );
}