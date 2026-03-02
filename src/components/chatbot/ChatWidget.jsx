"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useData } from "../../contexts/DataContext";
import "../../styles/chatbot.css";

const WELCOME_MESSAGE = {
    role: "assistant",
    content:
        "Hello! 👋 I'm the **DailyDocket Assistant** with full access to your business data. I can:\n\n• 📊 **Read & analyze** your sales, orders, expenses, and user data\n• ➕ **Add** new records via voice or text\n• ✏️ **Edit** existing records\n• 🗑️ **Delete** records\n• 🎤 **Voice commands** — click the mic to speak\n\nTry: *\"How many orders do I have?\"* or *\"Add a sale for today\"*",
};

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [messages, setMessages] = useState([WELCOME_MESSAGE]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [error, setError] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [actionResults, setActionResults] = useState([]);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const abortRef = useRef(null);
    const recognitionRef = useRef(null);

    const { getDataSnapshot, executeAction } = useData();

    // Auto-scroll to the latest message
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 350);
        }
    }, [isOpen]);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = "en-US";

                recognition.onresult = (event) => {
                    let finalTranscript = "";
                    let interimTranscript = "";
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript;
                        } else {
                            interimTranscript += transcript;
                        }
                    }
                    setInput(finalTranscript || interimTranscript);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognition.onerror = (event) => {
                    console.error("Speech recognition error:", event.error);
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            }
        }
    }, []);

    const toggleVoice = () => {
        if (!recognitionRef.current) {
            setError("Voice recognition is not supported in your browser.");
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setInput("");
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const toggleChat = () => {
        if (isOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsClosing(false);
            }, 250);
        } else {
            setIsOpen(true);
        }
    };

    // Parse and execute action blocks from assistant response
    const parseAndExecuteActions = useCallback(
        (text) => {
            const actionRegex = /```action\s*\n?([\s\S]*?)\n?```/g;
            let match;
            const results = [];
            while ((match = actionRegex.exec(text)) !== null) {
                try {
                    const actionData = JSON.parse(match[1].trim());
                    const result = executeAction(actionData);
                    results.push({ action: actionData, ...result });
                } catch (e) {
                    results.push({ error: `Failed to parse action: ${e.message}` });
                }
            }
            if (results.length > 0) {
                setActionResults(results);
            }
            return results;
        },
        [executeAction]
    );

    const sendMessage = async (messageText) => {
        const trimmed = (messageText || input).trim();
        if (!trimmed || isStreaming) return;

        // Stop listening if voice was active
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }

        setError(null);
        setActionResults([]);
        const userMessage = { role: "user", content: trimmed };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsStreaming(true);
        setIsThinking(true);

        // Build the conversation history for the API (skip the welcome message)
        const apiMessages = newMessages
            .filter((m) => m !== WELCOME_MESSAGE)
            .map((m) => ({ role: m.role, content: m.content }));

        // Get live data snapshot
        const dataSnapshot = getDataSnapshot();

        try {
            abortRef.current = new AbortController();

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: apiMessages, dataSnapshot }),
                signal: abortRef.current.signal,
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantContent = "";
            let reasoningContent = "";

            // Add empty assistant message to stream into
            setMessages((prev) => [...prev, { role: "assistant", content: "", reasoning: "" }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value, { stream: true });
                const lines = text.split("\n");

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    const data = line.slice(6).trim();

                    if (data === "[DONE]") break;

                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.error) {
                            setError(parsed.error);
                            break;
                        }

                        // Handle reasoning content (thinking)
                        if (parsed.reasoning) {
                            reasoningContent += parsed.reasoning;
                            setIsThinking(true);
                        }

                        // Handle main content
                        if (parsed.content) {
                            setIsThinking(false);
                            assistantContent += parsed.content;
                            const captured = assistantContent;
                            const capturedReasoning = reasoningContent;
                            setMessages((prev) => {
                                const updated = [...prev];
                                updated[updated.length - 1] = {
                                    role: "assistant",
                                    content: captured,
                                    reasoning: capturedReasoning,
                                };
                                return updated;
                            });
                        }
                    } catch {
                        // Skip malformed JSON chunks
                    }
                }
            }

            // After streaming complete, parse and execute any action blocks
            if (assistantContent) {
                parseAndExecuteActions(assistantContent);
            }
        } catch (err) {
            if (err.name !== "AbortError") {
                setError("Something went wrong. Please try again.");
                console.error("Chat error:", err);
            }
        } finally {
            setIsStreaming(false);
            setIsThinking(false);
            abortRef.current = null;
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Render content with bold formatting and action blocks hidden
    const renderContent = (text) => {
        if (!text) return null;

        // Remove action blocks from display
        const cleanText = text.replace(/```action\s*\n?[\s\S]*?\n?```/g, "").trim();

        return cleanText.split("\n").map((line, i) => (
            <React.Fragment key={i}>
                {line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                    }
                    return <span key={j}>{part}</span>;
                })}
                {i < cleanText.split("\n").length - 1 && <br />}
            </React.Fragment>
        ));
    };

    return (
        <>
            {/* Floating toggle button */}
            <button
                className={`chatbot-toggle ${isOpen ? "open" : ""}`}
                onClick={toggleChat}
                aria-label={isOpen ? "Close chat" : "Open chat"}
                id="chatbot-toggle-btn"
            >
                {isOpen ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <img src="/chatbot-icon.png" alt="Chat" className="chatbot-toggle-icon" />
                )}
            </button>

            {/* Chat panel */}
            {isOpen && (
                <div className={`chatbot-panel ${isClosing ? "closing" : ""}`} id="chatbot-panel">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-avatar">
                            <img src="/chatbot-icon.png" alt="Assistant" className="chatbot-avatar-img" />
                        </div>
                        <div className="chatbot-header-info">
                            <div className="chatbot-header-title">DailyDocket AI</div>
                            <div className="chatbot-header-status">
                                <span className="status-dot" />
                                Full Access • DeepSeek V3.1
                            </div>
                        </div>
                        <button className="chatbot-close-btn" onClick={toggleChat} aria-label="Close chat">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chatbot-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chatbot-message ${msg.role}`}>
                                {renderContent(msg.content)}
                            </div>
                        ))}

                        {/* Thinking indicator */}
                        {isThinking && (
                            <div className="chatbot-thinking">
                                <div className="chatbot-thinking-icon">🧠</div>
                                <span>Thinking...</span>
                            </div>
                        )}

                        {/* Streaming typing indicator */}
                        {isStreaming && !isThinking &&
                            messages[messages.length - 1]?.role !== "assistant" && (
                                <div className="chatbot-typing">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            )}

                        {/* Action results */}
                        {actionResults.length > 0 && (
                            <div className="chatbot-action-results">
                                {actionResults.map((r, i) => (
                                    <div key={i} className={`chatbot-action-badge ${r.success ? "success" : "error"}`}>
                                        {r.success ? "✅" : "❌"}{" "}
                                        {r.success
                                            ? `${r.action?.type?.replace("_", " ")} executed`
                                            : r.error}
                                    </div>
                                ))}
                            </div>
                        )}

                        {error && <div className="chatbot-error">{error}</div>}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chatbot-input-area">
                        {/* Voice button */}
                        <button
                            className={`chatbot-voice-btn ${isListening ? "listening" : ""}`}
                            onClick={toggleVoice}
                            disabled={isStreaming}
                            aria-label={isListening ? "Stop listening" : "Start voice input"}
                            id="chatbot-voice-btn"
                        >
                            {isListening ? (
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                    <rect x="4" y="4" width="16" height="16" rx="2" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                    <line x1="12" y1="19" x2="12" y2="23" />
                                    <line x1="8" y1="23" x2="16" y2="23" />
                                </svg>
                            )}
                        </button>

                        <input
                            ref={inputRef}
                            type="text"
                            className="chatbot-input"
                            placeholder={isListening ? "🎤 Listening..." : "Ask or command..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isStreaming}
                            id="chatbot-input"
                        />
                        <button
                            className="chatbot-send-btn"
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isStreaming}
                            aria-label="Send message"
                            id="chatbot-send-btn"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
