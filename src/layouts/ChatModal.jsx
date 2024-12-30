import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ChatWindow = styled.div`
  position: fixed;
  bottom: 20px; // 바닥에서 20px 띄움
  right: 30px;
  width: 380px;
  height: 580px; // 전체 높이 살짝 줄임
  background: white;
  border-radius: 20px; // 모든 모서리 둥글게
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ChatHeader = styled.div`
  padding: 12px 20px;
  background: #2563eb;
  color: white;
`;

const ChatBody = styled.div`
  height: calc(100% - 160px);
  overflow-y: auto;
  padding: 20px;
`;

const Message = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: ${(props) => (props.isUser ? "row-reverse" : "row")};
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  background: ${(props) =>
    props.isUser ? "#2563eb" : "#f3f4f6"}; // primary blue for user messages
  color: ${(props) => (props.isUser ? "white" : "black")};
  margin: 4px;
`;

const ChatFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #eee;
  background: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #2563eb; // primary blue
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background: #f3f4f6;
  border-radius: 16px;
  width: fit-content;
  margin: 4px;

  .dot {
    width: 8px;
    height: 8px;
    background: #94a3b8;
    border-radius: 50%;
    animation: bounce 1.4s infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }
`;

function ChatModal({ onClose }) {
  // 1. sessionId 먼저 초기화
  const [sessionId] = useState(() => {
    const savedSessionId = localStorage.getItem("chatSessionId");
    return savedSessionId || uuidv4().replace(/-/g, "");
  });

  // 2. sessionId를 이용해 messages 초기화
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(`chat_${sessionId}`);
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            isUser: false,
            text: "안녕하세요! 새싹 LMS 상담입니다. 무엇을 도와드릴까요? 😊",
          },
        ];
  });

  // 3. 나머지 상태들 초기화
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 4. 효과들
  useEffect(() => {
    localStorage.setItem("chatSessionId", sessionId);
  }, [sessionId]);

  useEffect(() => {
    localStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages));
  }, [messages, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 5. 핸들러 함수들
  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { isUser: true, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://iampam.app.n8n.cloud/webhook/df161b49-9a7e-42f4-afed-3729402ee737/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            chatInput: input,
          }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          isUser: false,
          text: data.output || "죄송합니다. 응답을 받지 못했습니다.",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          isUser: false,
          text: "죄송합니다. 오류가 발생했습니다.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ModalOverlay onClick={handleClose} />
      <ChatWindow>
        <ChatHeader className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">새싹 상담</h3>
            <p className="text-sm text-gray-100">보통 몇 분 내 답변</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-blue-600 rounded-full transition-colors"
          >
            ✕
          </button>
        </ChatHeader>

        <ChatBody>
          {messages.map((message, index) => (
            <Message key={index} isUser={message.isUser}>
              {!message.isUser && (
                <img
                  src="/saesac.png"
                  alt="Bot"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <MessageBubble isUser={message.isUser}>
                {message.text}
              </MessageBubble>
            </Message>
          ))}

          {isLoading && (
            <Message>
              <img
                src="/saesac.png"
                alt="Bot"
                className="w-8 h-8 rounded-full"
              />
              <TypingIndicator>
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </TypingIndicator>
            </Message>
          )}

          <div ref={messagesEndRef} />
        </ChatBody>

        <ChatFooter>
          <form onSubmit={handleSubmit} className="relative">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </ChatFooter>
      </ChatWindow>
    </>
  );
}

export default ChatModal;
