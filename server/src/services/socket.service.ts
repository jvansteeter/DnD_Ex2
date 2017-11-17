let currentUserService = require('./loggedInUserSocket.service');

export class SocketService {
    onConnect = (socket) => {
        let userId: string = '';
        socket.emit('init');

        socket.on('login', (_userId) => {
            userId = _userId;
            currentUserService.addUser(userId, socket);
            socket.join(userId);
        });

        socket.on('disconnect', () => {
            currentUserService.removeUser(userId);
        });

        socket.on('echo', (data) => {
            socket.emit('echo', data);
        });

        socket.on('requestRequest', () => {
            socket.emit('friendRequest', 'system');
        })
    };
}

export default new SocketService().onConnect;