import { Table } from 'react-bootstrap';
import { socket } from '../../socket';

const FilesTable = ({ uploadedFiles: files }) => {

    const deleteFile = (file) => {
        socket.emit('file:delete', { name: file.name });
    };

    return (
        <Table hover bordered>
            <thead>
                <tr>
                    <th colSpan={4}>
                        <h5 className="text-dark text-center w-100">Uploaded Files</h5>
                    </th>

                </tr>
                <tr>
                    <th>File Name</th>
                    <th>Created At</th>
                    <th colSpan={2}>Size (kB)</th>
                </tr>
            </thead>
            <tbody>
                {files?.map(file => (
                    <tr key={file.name}>
                        <td>{file.name}</td>
                        <td>{new Date(file.created_at).toLocaleString()}</td>
                        <td>{file.size}</td>
                        <td>
                            <div role="button" onClick={() => deleteFile(file)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
};

export default FilesTable;