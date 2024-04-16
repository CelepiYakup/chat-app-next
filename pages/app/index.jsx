import React, { useState, useContext, useRef, useEffect } from 'react';
import ChatBody from '@/components/chatbody';
import { WebsocketContext } from '../../modules/websocket_provider';
import { useRouter } from 'next/router';
import { API_URL } from '../../constants';
import autosize from 'autosize';
import { AuthContext } from '../../modules/auth_provider';

const Index = () => {
  const [messages, setMessage] = useState([]);
  const [messageText, setMessageText] = useState('');
  const textarea = useRef(null);
  const { conn } = useContext(WebsocketContext);
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (conn === null) {
      router.push('/');
      return;
    }

    const roomId = conn.url.split('/')[5];
    async function getUsers() {
      try {
        const res = await fetch(`${API_URL}/ws/getClients/${roomId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();

        setUsers(data);
      } catch (e) {
        console.error(e);
      }
    }
    getUsers();
  }, []);

  useEffect(() => {
    if (textarea.current) {
      autosize(textarea.current);
    }

    if (conn === null) {
      router.push('/');
      return;
    }

    conn.onmessage = (message) => {
      const m = JSON.parse(message.data);
      if (m.content === 'A new user has joined the room') {
        setUsers([...users, { username: m.username }]);
      }

      if (m.content === 'user left the chat') {
        const deleteUser = users.filter((user) => user.username !== m.username);
        setUsers([...deleteUser]);
        setMessage([...messages, m]);
        return;
      }

      m.type = user?.username === m.username ? 'self' : 'recv';
      setMessage([...messages, m]);
    };

    conn.onclose = () => {};
    conn.onerror = () => {};
    conn.onopen = () => {};
  }, [textarea, messages, conn, users]);

  const sendMessage = () => {
    if (!messageText.trim()) return;
    if (conn === null) {
      router.push('/');
      return;
    }

    conn.send(messageText);
    setMessageText('');
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      sendMessage();
    }
  };

  const handleExit = () => {
    if (conn === null) {
      router.push('/');
      return;
    }
      conn.close();
      router.push('/');
  };

  return (
    <>
      <div className='flex flex-col w-full'>
        <div className='p-6 m-4 mb-12'>
          <ChatBody data={messages} />
        </div>
        <div className='fixed bottom-0 mt-4 w-full'>
          <div className='flex md:flex-row px-4 py-2 bg-grey md:mx-4 rounded-md'>
            <div className='flex w-full mr-4 rounded-md border border-black'>
              <textarea
                ref={textarea}
                placeholder='type your message here'
                className='w-full h-10 p-2 rounded-md focus:outline-none'
                style={{ resize: 'none' }}
                value={messageText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className='flex items-center'>
              <button
                className='p-2 rounded-md bg-orange text-white'
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='fixed top-1 right-2 m-4'>
        <button
          className='p-2 rounded-full bg-orange-200 hover:bg-gray-300'
          onClick={handleExit}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Index;
