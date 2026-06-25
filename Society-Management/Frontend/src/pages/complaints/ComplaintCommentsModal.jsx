import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { X, Send, MessageSquare } from 'lucide-react';
import { addComplaintComment } from '../../store/slices/complaintSlice.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import Button from '../../components/Button.jsx';

const ComplaintCommentsModal = ({ isOpen, onClose, complaint }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of comments
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      scrollToBottom();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, complaint?.comments]);

  if (!isOpen || !complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    const result = await dispatch(addComplaintComment({ id: complaint._id, text: text.trim() }));
    
    if (addComplaintComment.fulfilled.match(result)) {
      setText('');
    } else {
      showToast(result.payload || 'Failed to post comment', 'error');
    }
    setIsSubmitting(false);
  };

  // Extract initials for avatars
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary-950/40 dark:bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-transparent" onClick={onClose} />
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col h-[600px] max-h-[90vh] relative z-10">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <MessageSquare size={18} className="text-primary-500" />
              Discussion
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[300px]">
              {complaint.title}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Comments Area */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50 dark:bg-slate-900/50">
          {(!complaint.comments || complaint.comments.length === 0) ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
              <MessageSquare size={32} className="opacity-20" />
              <p className="text-sm">No comments yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {complaint.comments.map((comment) => {
                const isMe = comment.author?._id === (user?._id || user?.id);
                const authorName = comment.author?.name || 'Unknown User';
                
                return (
                  <div key={comment._id} className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white ${isMe ? 'bg-primary-500' : 'bg-slate-400'}`}>
                      {getInitials(authorName)}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] text-slate-500 mb-1 px-1">{isMe ? 'You' : authorName} • {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none shadow-sm'}`}>
                        {comment.text}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              disabled={!text.trim() || isSubmitting}
              className="px-4 rounded-xl flex items-center justify-center"
            >
              <Send size={16} className={isSubmitting ? 'animate-pulse' : ''} />
            </Button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ComplaintCommentsModal;
