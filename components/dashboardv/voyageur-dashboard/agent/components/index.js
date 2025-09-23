'use client';

import React, { useState } from 'react';

const ChatBubble = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    console.log('Message envoyé :', message);
    setMessage('');
  };

  return (
    <div className="chatBubble">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Découvrir New York pour une semaine à deux entre septembre et octobre 2025..."
        aria-label="Message"
      />

<div className="col-auto">
              <a
 href="/conciergerie-dashboard/add-hotel"
 className="button h-50 px-24 text-white"  style={{ backgroundColor: "#007cd2" }}
                >
                  Envoyer <div className="icon-check ml-15"></div>
                </a>
              </div>

      <style jsx>{`
        .chatBubble {
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
          background: transparent; /* conserve le fond du parent */
        }

        textarea {
          width: 100%;
          min-height: 180px;
          resize: vertical;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px 18px;
          font-size: 16px;
          line-height: 1.5;
          outline: none;
          margin-bottom: 16px;
        }

        textarea:focus {
          border-color: #0b74d0;
          box-shadow: 0 0 0 3px rgba(11, 116, 208, 0.15);
        }

        .actions {
          display: flex;
          justify-content: flex-start; /* bouton à gauche */
        }

        .sendBtn {
          display: inline-block;
          padding: 12px 24px;
          border-radius: 5px;
          background: #0b74d0;
          color: #fff;
          border: none;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.05s ease;
        }

        .sendBtn:hover {
          background: #0863b2;
        }

        .sendBtn:active {
          transform: translateY(1px);
        }
      `}</style>
    </div>
  );
};

export default ChatBubble;
