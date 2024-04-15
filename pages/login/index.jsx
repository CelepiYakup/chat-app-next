import { useState, useContext } from 'react';
import { API_URL } from '../../constants';
import { useRouter } from 'next/router';
import { AuthContext } from '../../modules/auth_provider';
import Link from 'next/link';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { authenticated } = useContext(AuthContext);
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        const user = {
          username: data.username,
          id: data.id,
        };

        localStorage.setItem('user_info', JSON.stringify(user));
        router.push('/');
      }
    } catch (err) {
      console.log(err);
    }
  };

  
  if (!authenticated && router.pathname === '/') {
    router.push('/login');
    return null; 
  }
  
  return (
    <div className='flex items-center justify-center min-w-full min-h-screen'>
      <form className='flex flex-col md:w-1/5'>
        <div className='text-3xl font-bold text-center'>
          <span className='text-blue'>welcome!</span>
        </div>
        <input
          placeholder='email'
          className='p-3 mt-8 rounded-md border-2 border-grey focus:outline-none focus:border-blue'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='password'
          className='p-3 mt-4 rounded-md border-2 border-grey focus:outline-none focus:border-blue'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className='p-1 mt-2 rounded-md bg-black font-bold text-sm text-black'>
          You don't have an account?
        </p>
        <Link className='p-1 mt font-bold bg-black text-blue text-sm' href={'/signup'}>
          Signup
        </Link>
        <button
          className='p-3 mt-6 rounded-md bg-blue font-bold text-white'
          type='submit'
          onClick={submitHandler}
        >
          login
        </button>
      </form>
    </div>
  );
};

export default Index;
