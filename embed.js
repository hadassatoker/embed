(function () {
    // --- Config & State ---
    const API_BASE = 'http://localhost:9016/vibe_coding';
    const DEFAULT_WIDTH = '500px';
    const DEFAULT_HEIGHT = '650px';

    const currentScript = document.currentScript;
    const width = currentScript.getAttribute('data-width') || DEFAULT_WIDTH;
    const height = currentScript.getAttribute('data-height') || DEFAULT_HEIGHT;
    const pathnameParts = window.location.pathname.split('/').filter(Boolean);
    const projectId = pathnameParts[pathnameParts.length - 1].split('.')[0];

    let isMinimized = true;
    let iframe = null;

    // --- Initialization ---
    function init() {
        fetch(`${API_BASE}/api/project/${projectId}`).then((response) => {
            if (response.ok) {
                createIframe();
            }
        });
    }

    // --- Iframe Management ---
    function createIframe() {
        if (!iframe) {
            iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            iframe.src = `${API_BASE}?isMinimized=${isMinimized}&projectId=${projectId}`;
            iframe.setAttribute('id', `fiverr-embed-${projectId}`);
            iframe.style.position = 'fixed';
            iframe.style.bottom = '20px';
            iframe.style.right = '20px';
            iframe.style.border = 'none';
        } else {
            iframe.contentWindow.postMessage({ type: 'fiverr-embed-size', isMinimized }, '*');
        }

        if (isMinimized) {
            iframe.style.width = '40px';
            iframe.style.height = '40px';
            iframe.style.borderRadius = '50%';
        } else {
            iframe.style.width = width;
            iframe.style.height = height;
            iframe.style.borderRadius = '0';
        }
    }

    // --- Event Handlers ---
    function handleMessage(event) {
        if (event.data.event === 'toggle-fiverr-embed') {
            isMinimized = !isMinimized;
            createIframe();
        }
    }

    function handleFirstOpenIframe() {
        if (!iframe) {
            fetch(`${API_BASE}/api/project/${projectId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                if (response.ok) {
                    isMinimized = false;
                    createIframe();
                }
            });
        }
    }

    // --- Register Event Listeners ---
    window.addEventListener('message', handleMessage);
    window.addEventListener('open-iframe', handleFirstOpenIframe);

    // --- Auto-initialize ---
    init();
})();
