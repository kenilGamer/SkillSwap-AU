export default function ChatBubble({ message, hisChat = false }: { message: string; hisChat?: boolean }) {
  return (
    <div className={`my-2 flex gap-3 ${hisChat ? "" : "justify-end"}`}>
      {hisChat && (
        <div className="aspect-square h-9 overflow-hidden rounded-full">
          <img
            className="block h-full w-full object-cover"
            src="https://img.freepik.com/premium-photo/handsome-young-businessman-shirt-eyeglasses_85574-6228.jpg"
            alt="User Avatar"
          />
        </div>
      )}
      <div
        className={`max-w-[60%] break-all rounded-xl px-4 py-2 text-sm ${
          hisChat ? "bg-gray-300 text-black" : "bg-blue-500 text-white"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
