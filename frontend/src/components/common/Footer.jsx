import {trophy} from 'lucide-react';
import {Link} from 'rect-router-dom';

const Footer = () => (
  <footer className="border-t border-brand-900/40 mt-12 py-8">
    <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center">
          <Trophy size={12} className="text-white" />
        </div>
        <span className="font-display text-lg text-brand-500">CricConnect</span>
      </div>
      <div className="flex gap-6 text-xs text-brand-800">
        <Link to="/home" className="hover:text-brand-500 transition-colors">Feed</Link>
        <Link to="/matches" className="hover:text-brand-500 transition-colors">Matches</Link>
        <Link to="/search" className="hover:text-brand-500 transition-colors">Search</Link>
      </div>
      <p className="text-xs text-brand-900">© 2025 CricConnect. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;