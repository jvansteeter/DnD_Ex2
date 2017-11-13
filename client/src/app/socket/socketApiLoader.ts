export class SocketApiLoader {
    load(): Promise<void> {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = '/socket.io/socket.io.js';
            script.onload = (() => resolve());
            script.onerror = (error => reject(error));

            document.body.appendChild(script);
        });
    }
}