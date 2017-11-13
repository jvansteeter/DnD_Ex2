export class SocketService {
    onConnect = (socket) => {
        socket.emit('init');

        socket.on('disconnect', () => {
            console.log('socket has been disconnected')
        });

        socket.on('echo', (data) => {
            socket.emit('echo', data);
        });
    };
}

export default new SocketService().onConnect;