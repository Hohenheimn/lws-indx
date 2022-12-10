import { twMerge } from "tailwind-merge";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Avatar({ children, className }: AvatarProps) {
  return (
    <div
      className={twMerge(
        "relative h-16 w-16 bg-gray-300 rounded-full",
        className
      )}
    >
      <div className="flex justify-center items-center h-full w-full">
        {children}
      </div>
    </div>
  );
}

export default Avatar;
