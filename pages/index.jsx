import React, { useState, useEffect, useContext } from 'react';
import { API_URL } from '../constants/index';
import { v4 as uuidv4 } from 'uuid';
import { WEBSOCKET_URL } from '../constants/index';
import { AuthContext } from '@/modules/auth_provider';
import { WebsocketContext } from '../modules/websocket_provider';
import { useRouter } from 'next/router';

const Index = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const { user } = useContext(AuthContext);
  const { setConn } = useContext(WebsocketContext);
  const router = useRouter();

  const getRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/ws/getRooms`, {
        method: 'GET',
      });

      const data = await res.json();
      if (res.ok) {
        setRooms(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  useEffect(() => {
    // WebSocket bağlantısı oluştur
    const ws = new WebSocket(`${WEBSOCKET_URL}/ws/updateRooms`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Odanın silindiğine dair bir mesaj geldiyse
      if (data.content === 'room deleted') {
        // Odaları yeniden getir
        getRooms();
      }
    };

    return () => {
      // Component kaldırıldığında WebSocket bağlantısını kapat
      ws.close();
    };
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setRoomName('');
      const res = await fetch(`${API_URL}/ws/createRoom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: uuidv4(),
          name: roomName,
        }),
      });

      if (res.ok) {
        getRooms();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const joinRoom = (roomId) => {
    const ws = new WebSocket(
      `${WEBSOCKET_URL}/ws/joinRoom/${roomId}?userId=${user.id}&username=${user.username}`
    );
    if (ws.OPEN) {
      setConn(ws);
      router.push('/app');
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      const res = await fetch(`${API_URL}/ws/deleteRoom/${roomId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        getRooms();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    // Çıkış yapılınca giriş sayfasına yönlendir
    router.push('/login');
  };

  return (
    <>
      <div className='my-8 px-4 md:mx-32 w-full h-full'>
        <div className='flex justify-center mt-3 p-5'>
          <input
            type='text'
            className='border border-grey p-2 rounded-md focus:outline-none focus:border-blue'
            placeholder='room name'
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button
            className='bg-orange border text-white rounded-md p-2 md:ml-4'
            onClick={submitHandler}
          >
            create room
          </button>
        </div>
        <div className='mt-6'>
          <div className='font-bold'>Available Rooms</div>
          <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mt-6'>
            {rooms.map((room, index) => (
              <div
                key={index}
                className='border border-orange p-4 flex items-center rounded-md w-full'
              >
                <div className='w-full'>
                  <div className='text-sm'>room</div>
                  <div className='text-orange font-bold text-lg'>{room.name}</div>
                </div>
                <div className=''>
                  <button
                    className='px-4 py-2  text-white bg-orange rounded-md mr-2 '
                    onClick={() => joinRoom(room.id)}
                  >
                    join
                  </button>
                  
                  <button
                    className='px-4 py-2 my-2 text-white bg-red rounded-md mr-1'
                    onClick={() => deleteRoom(room.id)}
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='fixed top-1 right-2 m-4'>
        <button
          className='p-2 rounded-full bg-gray-200 hover:bg-gray-300'
          onClick={handleLogout}
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
