import { useState } from "react";
import "./App.css";
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

const API_URL = "http://localhost:5000/chat"; // Your Flask backend URL

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am Gemini",
      sender: "Gemini",
      direction: "incoming",
    },
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true); // Show typing indicator

    try {
      const response = await processMessageToGemini(message);
      setTyping(false); // Hide typing indicator when response is received

      // Add Gemini's response to the chat
      const geminiMessage = {
        message: response, // Assuming this is valid Markdown
        sender: "Gemini",
        direction: "incoming",
      };

      setMessages([...newMessages, geminiMessage]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setTyping(false); // Hide typing indicator on error
    }
  };

  // Function to call the Flask backend API
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
    return data.response; // Assuming the response is valid Markdown
  }

  return (
    <>
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              typingIndicator={
                typing ? <TypingIndicator content="Gemini is typing" /> : null
              }
            >
              {messages.map((message, i) => (
                <Message key={i} model={message}>
                  {/* Render message with ReactMarkdown */}
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.message}
                  </ReactMarkdown>
                </Message>
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  );
}

export default App;
