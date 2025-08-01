import { NSIcons } from "@/components/atoms/Icons/NSIcons"

interface Options {
    value: string,
    color: 'red' | 'green' | 'blue' | 'orange' | 'black'
}

const colorVariants: Record<Options['color'], {text: string, hoverText: string }> = {
    red: {
      text: "text-red-500",
      hoverText: "hover:text-red-700",
    },
    blue: {
      text: "text-blue-500",
      hoverText: "hover:text-blue-700",
    },
    green: {
      text: "text-green-500",
      hoverText: "hover:text-green-700",
    },
    orange: {
        text: "text-orange-500",
        hoverText: "hover:text-orange-700",
    },
    black:{
        text: "text-gray-500",
        hoverText: "hover:text-black",
    }
  };
  

export const ColTable = ({value, options}:{value: React.ReactNode, options: Options[]}) => {
    return (
        <td className="p-2 text-gray-500 cursor-pointer hover:text-black relative group">
            {value}
            <div className="absolute top-[85%] right-0 hidden group-hover:block bg-white shadow-xl rounded-md p-2 z-10 min-w-[120px]">
                {options.map((val) => (
                    <div className={`hover:bg-gray-100 px-2 py-1 font-semibold rounded cursor-pointer ${colorVariants[val.color].text} ${colorVariants[val.color].hoverText}`}>{val.value}</div>
                ))}
            </div>
        </td>
    )
}

