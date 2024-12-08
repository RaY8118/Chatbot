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

  const navigate = useNavigate(); // React Router's hook for navigation

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
    // Clear authentication info (if any) and navigate to login page
    alert("Logged out successfully!");
    navigate("/");
  };

  return (
    <>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Gemini Chatbot</h1>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div style={styles.chatContainer}>
          <MainContainer>
            <ChatContainer>
              <MessageList
                typingIndicator={
                  typing ? <TypingIndicator content="Gemini is typing..." /> : null
                }
              >
                {messages.map((message, i) => (
                  <Message key={i} model={message}>
                    <Message.CustomContent>
                      <ReactMarkdown
                        className="markdown-content"
                        remarkPlugins={[remarkGfm]}
                      >
                        {message.message}
                      </ReactMarkdown>
                    </Message.CustomContent>
                  </Message>
                ))}
              </MessageList>

              <MessageInput placeholder="Type a message..." onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  headerTitle: {
    margin: 0,
    fontSize: "24px",
  },
  logoutButton: {
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#FF4B4B",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  chatContainer: {
    position: "relative",
    height: "700px",
    width: "100%",
    maxWidth: "700px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    overflow: "hidden",
  },
};

export default Chatbot;
