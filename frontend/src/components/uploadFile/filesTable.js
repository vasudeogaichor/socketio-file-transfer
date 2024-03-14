import { Table } from 'react-bootstrap';

const FilesTable = ({ uploadedFiles: files }) => {
    return (
        <Table hover bordered>
            <thead>
                <tr>
                    <th colSpan={3}>
                        <h5 className="text-dark text-center w-100">Uploaded Files</h5>
                    </th>

                </tr>
                <tr>
                    <th>File Name</th>
                    <th>Created At</th>
                    <th>Size (kB)</th>
                </tr>
            </thead>
            <tbody>
                {files?.map(file => (
                    <tr key={file.name}>
                        <td>{file.name}</td>
                        <td>{new Date(file.created_at).toLocaleString()}</td>
                        <td>{file.size}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
};

export default FilesTable;