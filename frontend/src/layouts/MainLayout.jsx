import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-dark-900">
    <Navbar />
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">{children}</main>
    </div>
    <Footer />
  </div>
);

export default MainLayout;