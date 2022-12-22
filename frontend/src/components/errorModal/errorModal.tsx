import { Modal } from '@mantine/core';
import { useCallback } from 'react';

const ErrorModal = ({ error, setError }: { error: string, setError: (error: string) => void }) => {
    return (
        <Modal
        opened={error !== ''}
        onClose={useCallback(() => setError(''), [setError])}
        title="Error"
        size="sm"
        >
        {error}
        </Modal>
    );
};

export default ErrorModal;