import { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/chat";

function Chatbot() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am Gemini. How can I help you today?",
      sender: "Gemini",
      direction: "incoming",
    },
  ]);

  const navigate = useNavigate();

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);

    try {
      const response = await processMessageToGemini(message);
      setTyping(false);

      const geminiMessage = {
        message: response,
        sender: "Gemini",
        direction: "incoming",
      };

      setMessages([...newMessages, geminiMessage]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setTyping(false);
    }
  };

  async function processMessageToGemini(userMessage) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response from Gemini");
    }

    const data = await response.json();
    return data.response;
  }

  const handleLogout = () => {
    // alert("Logged out successfully!");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
        <header className="w-full flex justify-between items-center p-3 bg-blue-600 text-white rounded-md">
          <h1 className="m-0 p-2 text-xl">Gemini Chatbot</h1>
          <button
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <div className="relative h-[700px] w-full max-w-[700] shadow-lg rounded-lg overflow-hidden bg-white flex flex-col text-wrap">
          <MainContainer>
            <ChatContainer>
              <MessageList
                typingIndicator={
                  typing ? (
                    <TypingIndicator content="Gemini is typing..." />
                  ) : null
                }
                className="flex-grow overflow-y-auto"
              >
                {messages.map((message, i) => (
                  <Message key={i} model={message}>
                    <Message.CustomContent>
                      <ReactMarkdown
                        className="markdown-content text-lg text-wrap"
                        remarkPlugins={[remarkGfm]}
                      >
                        {message.message}
                      </ReactMarkdown>
                    </Message.CustomContent>
                  </Message>
                ))}
              </MessageList>

              <MessageInput
                placeholder="Type a message..."
                onSend={handleSend}
                className="mt-auto"
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
