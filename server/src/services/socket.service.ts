let currentUserService = require('./currentUsers.service');

export class SocketService {
    onConnect = (socket) => {
        socket.emit('init');
        console.log("\n\n" + socket.id + "\n\n")

        socket.on('connect', (userId) => {
            currentUserService.addUser(userId);
        });

        socket.on('disconnect', () => {
            console.log('socket has been disconnected')
        });

        socket.on('echo', (data) => {
            socket.emit('echo', data);
        });
    };
}

export default new SocketService().onConnect;