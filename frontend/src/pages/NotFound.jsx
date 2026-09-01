import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
    <div className="text-center space-y-5">
      <div className="text-8xl">🏏</div>
      <h1 className="text-5xl font-display tracking-wide text-brand-500">404</h1>
      <p className="text-brand-700">This page has been caught behind the boundary.</p>
      <Link to="/home" className="btn-primary inline-flex items-center gap-2">
        <Trophy size={15} /> Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;