const SocketIO = require('socket.io');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');

const http = require('./server.js');

const io = SocketIO(http);
// const io_register = SocketIO(http, { path: '/register' });

const ENCDEC = require("./api/function/encdec.js");
const GENERAL = require("./api/function/general.js");
const RES = require("./api/function/res.js");

require("dotenv").config();

io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        // console.log('token', socket.handshake.query.token)
        jwt.verify(socket.handshake.query.token, process.env.JWT_KEY, function (err, decoded) {
            if (err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
})
io.on('connection', (socket) => {
    let token = socket.handshake.query.token;
    // console.log(socket);

    io.of('/').adapter.clients(async (err, clients) => {
        RES.socket_connection({
            'port': process.env.PORT,
            'status': 'IN',
            'barcode': socket.decoded['barcode'],
            "user_type": socket.decoded['user_type'],
            'socket_id': socket.id
        });
        console.log(chalk.cyan('Connected Users: ' + clients.length));
        console.log(chalk.yellow(`Socket ON -- ${socket.decoded['barcode']} -- ${socket.decoded['email']} -- ${socket.id} ==> ${GENERAL.get_dateTime()}`))
    });

    socket.on('disconnect', () => {
        io.of('/').adapter.clients(async (err, clients) => {
            RES.socket_connection({
                'port': process.env.PORT,
                'status': 'OUT',
                'barcode': socket.decoded['barcode'],
                "user_type": socket.decoded['user_type'],
                'socket_id': socket.id
            });
            console.log(chalk.cyan('Connected Users: ' + clients.length));
            console.log(chalk.yellow(`Socket OFF -- ${socket.decoded['barcode']} -- ${socket.decoded['email']} -- ${socket.id} ==> ${GENERAL.get_dateTime()}`))
        });
    });
});

module.exports = io;

// let emit_to_all = (event, data) => {
//     io.sockets.emit(event, data);
// };
// module.exports.emit_to_all = emit_to_all;