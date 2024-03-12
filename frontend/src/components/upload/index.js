import { useState } from 'react';
import ss from 'socket.io-stream';
import { socket } from '../../socket';

export default function UploadFile () {
    const [file, setFile] = useState(null);
    return (
        <div>
            this is upload page
        </div>
    )
}