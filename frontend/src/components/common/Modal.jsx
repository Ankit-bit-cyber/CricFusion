import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full ${sizes[size]} bg-dark-800 border border-brand-900/50 rounded-2xl shadow-2xl animate-slide-up`}>
                <div className="flex items-center justify-between p-5 border-b border-brand-900/40">
                    <h2 className="text-lg font-medium text-brand-50">{title}</h2>
                    <button onClick={onClose} className="text-brand-700 hover:text-brand-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
};

export default Modal;