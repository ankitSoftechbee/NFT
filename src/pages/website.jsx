import React, { useEffect, useRef } from 'react';

const WebPage = () => {
    const iframeRef = useRef(null);

    useEffect(() => {
        // Optional: Resize iframe to match content
        const iframe = iframeRef.current;
        if (iframe) {
            iframe.onload = () => {
                iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
            };
        }
    }, []);

    return (
        <iframe
            ref={iframeRef}
            src="/index.html"
            width="100%"
            style={{
                border: 'none',
                minHeight: '500px',
            }}
        />
    );
};

export default WebPage;
