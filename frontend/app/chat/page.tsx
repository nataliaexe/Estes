import { ChatInterface } from "../componentes/chat/ChatInterface";

export const metadata = {
  title: "Estes Assistant",
  description:
    "Describe the material you have and the environmental problem. Estes investigates the Atlas, scientific literature, and the web.",
};

export default function ChatPage() {
  return (
    <main className="bg-elfo-creme">
      <ChatInterface />
    </main>
  );
}
