import { cls } from "../libs/utils";

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
}: MessageProps) {
  return (
    <div
      className={cls(
        "flex  items-start",
        reversed ? "flex-row-reverse space-x-reverse" : "space-x-2"
      )}
    >
      <div
        className={cls(
          "w-8 h-8 rounded-full bg-slate-400",
          reversed ? "ml-2" : ""
        )}
      />
      <div
        className={cls(
          "w-auto text-sm text-gray-700 p-2 border border-gray-300 rounded-full",
          reversed ? "bg-orange-500 text-white" : "bg-gray-100"
        )}
      >
        <p>{message}</p>
      </div>
    </div>
  );
}
