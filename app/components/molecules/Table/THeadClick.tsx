import { NSIcons } from "@/components/atoms/Icons/NSIcons"
import { useState } from "react";

interface THeadClickProps {
  text: string;
  onClick?: (direction: "asc" | "desc" | undefined) => void;
  initialDirection?: "asc" | "desc" | undefined;
  className?: string
}

export const THeadClick = ({
  text,
  onClick,
  initialDirection = undefined,
  className = "",
}: THeadClickProps) => {

  const handleClick = () => {
    let newDirection: "asc" | "desc" | undefined;

    switch (initialDirection) {
      case undefined:
        newDirection = "asc";
        break;
      case "asc":
        newDirection = "desc";
        break;
      default:
        newDirection = undefined;
    }

    onClick?.(newDirection);
  };

  const getIcon = () => {
    switch (initialDirection) {
      case "asc":
        return <NSIcons.Up className="w-5 right-0 absolute " />;
      case "desc":
        return <NSIcons.Down className="w-5 right-0 absolute " />;
      default:
        return <NSIcons.Up className="w-5 right-0 absolute opacity-0 group-hover:opacity-50" />;
    }
  };

  return (
    <th
      className={`group cursor-pointer   select-none ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center relative">
        <span>{text}</span>
        {getIcon()}
      </div>
    </th>
  );
};