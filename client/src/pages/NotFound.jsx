import { Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-24 animate-fade-in">
      <div className="text-center max-w-md">
        <span className="block text-xs tracking-[0.25em] uppercase text-gold font-semibold mb-4">
          404 ERROR
        </span>
        <h1 className="font-heading text-6xl md:text-7xl text-ink mb-4">
          Page Not Found
        </h1>
        <p className="text-stone text-base md:text-lg mb-10 leading-relaxed">
          The page you are looking for does not exist, has been moved, or is temporarily unavailable.
        </p>
        <Button to="/" variant="primary" icon={HiOutlineArrowLeft} iconPosition="left">
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
