type FailModalProps = {
    onRetry: () => void;
};

export const FailModal = ({ onRetry }: FailModalProps) => (
    <div className="fail-modal-backdrop" role="dialog" aria-modal="true">
        <div className="fail-modal">
            <h2>FAIL</h2>
            <p>The ball went out of bounds.</p>
            <button type="button" onClick={onRetry}>
                Retry
            </button>
        </div>
    </div>
);
