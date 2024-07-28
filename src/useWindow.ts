// useWindow.ts
import { useEffect } from 'react';

const useWindow = (content: string, title: string, options: string) => {
    useEffect(() => {
        const newWindow = window.open('', title, options);

        if (newWindow) {
            newWindow.document.write(content);
            newWindow.document.close();

            const handleBeforeUnload = () => {
                newWindow.close();
            };

            window.addEventListener('beforeunload', handleBeforeUnload);

            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
                newWindow.close();
            };
        }
    }, [content, title, options]);
};

export default useWindow;
