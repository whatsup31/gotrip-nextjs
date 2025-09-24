'use client';

import React, { useState } from 'react';

const ChatBubble = () => {
  const [message, setMessage] = useState(
    'Découvrir New York pour une semaine à deux entre septembre et octobre 2025...'
  );

  const handleSend = () => {
    if (!message.trim()) return;
    console.log('Message envoyé :', message);
    // TODO: appelle ton action réelle ici (API, navigation, etc.)
    setMessage('');
  };

  return (
    <div className="chatBubble">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        aria-label="Message"
        readOnly={false}
      />

      <div className="col-auto actions">
        {/* Si tu veux garder la navigation, utilise un <button> puis route programmatique */}
        <button
          type="button"
          className="button h-50 px-24 text-white sendBtn"
          style={{ backgroundColor: '#007cd2' }}
          onClick={handleSend}
        >
          Envoyer <div className="icon-check ml-15"></div>
        </button>
      </div>

      <style jsx>{`
        .chatBubble {
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
          /* garde le fond du parent, mais le textarea aura un fond opaque */
          background: transparent;
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

          /* Règles demandées */
          background: #ffffff;        /* non transparent */
          color: #111827;
          user-select: text;          /* texte sélectionnable */
          -webkit-user-select: text;
          -ms-user-select: text;
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
          display: inline-flex;
          align-items: center;
          gap: 8px;
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
