import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ClientsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: any) {
        console.log('Client connected to ClientsGateway');
    }

    handleDisconnect(client: any) {
        console.log('Client disconnected from ClientsGateway');
    }

    emitClientUpdate(clientId: string, data: any) {
        this.server.emit('clientUpdated', { clientId, ...data });
    }

    emitCallStarted(clientId: string, employeeId: string, employeeName: string) {
        this.server.emit('clientCallStarted', { clientId, employeeId, employeeName });
    }

    emitCallEnded(clientId: string) {
        this.server.emit('clientCallEnded', { clientId });
    }

    emitReminder(clientId: string, name: string) {
        this.server.emit('clientReminder', { clientId, name });
    }

    emitPaymentReminder(clientId: string, name: string) {
        this.server.emit('paymentReminder', { clientId, name });
    }
}
