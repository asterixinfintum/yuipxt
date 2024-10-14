if (process.client) {
    let script = document.createElement('script');
    script.src = 'https://unpkg.com/lightweight-charts@4.0.1/dist/lightweight-charts.standalone.production.js';
    script.async = true;
    document.head.appendChild(script);
}
