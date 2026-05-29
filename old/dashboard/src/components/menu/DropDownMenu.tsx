import { useState, useRef, useEffect } from 'react';

import { User } from 'lucide-react';

import './DropDownMenu.css';

// const apps = [
//     { name: "Option 1", icon: User },
//     { name: 'Konto', icon: User },
//     { name: 'Konto', icon: User },
//     { name: 'Konto', icon: User },
//     { name: 'Konto', icon: User },
//     { name: 'Konto', icon: User },
// ];

export default function GoogleAppsLauncher() {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const outsideClick = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    }

    const escapeClick = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', outsideClick);
            document.addEventListener('keydown', escapeClick);
        }

        return () => {
            document.removeEventListener('mousedown', outsideClick);
            document.removeEventListener('keydown', escapeClick);
        }
    }, [isOpen]);

    return (
        <>
            <button
                className='apps-trigger'
                onClick={() => setIsOpen(!isOpen)}
                aria-label='General apps'
                title="General Apps"
            >
                <User />

            </button>

            {isOpen && (
                <div className="apps-modal-overlay">
                    <div className="apps-modal" ref={modalRef}>
                        <div className="apps-grid">
                            <div className='app-item'>
                                <button className='app-item-button'>
                                    IKON
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}