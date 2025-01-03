import React, { useEffect, useRef } from 'react';

const BtcWidget = () => {
    const widgetRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';

        script.innerHTML = JSON.stringify({
            symbol: 'INDEX:BTCUSD',
            width: '100%',
            height: '100%',
            locale: 'en',
            dateRange: '12M',
            colorTheme: 'dark',
            isTransparent: true,
            autosize: true,
            largeChartUrl: '',
        });

        widgetRef.current.appendChild(script);

        return () => {
            // Cleanup the widget safely
            if (widgetRef.current) {
                widgetRef.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="tradingview-widget-container">
            <div ref={widgetRef} className="tradingview-widget-container__widget"></div>
        </div>
    );
};

export default BtcWidget;
