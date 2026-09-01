import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { getDiscussionApi } from '../../services/matchApi';
import { joinMatchRoom, leaveMatchRoom, sendMatchMessage, emitTyping, getSocket } from '../../services/socketService';
import { useAuth } from '../../hooks/useAuth';
import { getAvatarUrl } from '../../utils/helpers';
import { timeAgo } from '../../utils/formatDates';
import Loader from '../common/Loader';

const MatchDiscussion = ({ matchId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    getDiscussionApi(matchId)
      .then((r) => setMessages(r.data.data.messages.reverse()))
      .catch(() => {})
      .finally(() => setLoading(false));

    joinMatchRoom(matchId);
    const socket = getSocket();
    if (socket) {
      socket.on('newMatchMessage', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
      socket.on('userTyping', ({ userName }) => {
        setTyping(`${userName} is typing…`);
        setTimeout(() => setTyping(''), 2000);
      });
    }
    return () => {
      leaveMatchRoom(matchId);
      if (socket) {
        socket.off('newMatchMessage');
        socket.off('userTyping');
      }
    };
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMatchMessage({ matchId, userId: user._id, message: text.trim() });
    setText('');
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    emitTyping(matchId, user.name);
  };

  return (
    <div className="card flex flex-col h-96">
      <div className="px-4 py-3 border-b border-brand-900/40">
        <h3 className="text-sm font-medium text-brand-300">Match Discussion</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? <div className="flex justify-center"><Loader size="sm" /></div> : (
          messages.map((msg) => (
            <div key={msg._id} className={`flex gap-2 ${msg.userId?._id === user._id ? 'flex-row-reverse' : ''}`}>
              <img src={getAvatarUrl(msg.userId?.avatar, msg.userId?.name)} alt="" className="w-7 h-7 rounded-full shrink-0 object-cover" />
              <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${msg.userId?._id === user._id ? 'bg-brand-700 text-white' : 'bg-dark-700 text-brand-200'}`}>
                {msg.userId?._id !== user._id && (
                  <p className="text-xs text-brand-500 font-medium mb-0.5">{msg.userId?.name}</p>
                )}
                <p>{msg.message}</p>
                <p className="text-[10px] opacity-50 mt-0.5">{timeAgo(msg.createdAt)}</p>
              </div>
            </div>
          ))
        )}
        {typing && <p className="text-xs text-brand-700 italic">{typing}</p>}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="p-3 border-t border-brand-900/40 flex gap-2">
        <input value={text} onChange={handleTyping} placeholder="React to the match…" className="input text-sm py-2 flex-1" />
        <button type="submit" disabled={!text.trim()} className="btn-primary px-3 disabled:opacity-50">
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};

export default MatchDiscussion;