import { ChatInterface } from "../componentes/chat/ChatInterface";

export const metadata = {
  title: "AI Assistant - ESTES",
  description:
    "Describe the material you have and the environmental problem. ESTES investigates the Atlas, scientific literature, and the web.",
};

export default function ChatPage() {
  return (
    <main className="bg-bg-primary">
      <ChatInterface />
    </main>
  );
}
