import { redirect } from 'next/navigation';

export default function Home() {
  // Server-side redirect to index.html
  redirect('/index.html');
}
