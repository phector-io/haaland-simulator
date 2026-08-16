type FailModalProps = {
    score: number;
    onRetry: () => void;
};

export const FailModal = ({ score, onRetry }: FailModalProps) => (
    <div className="fail-modal-backdrop" role="dialog" aria-modal="true">
        <div className="fail-modal">
            <h2>FAIL</h2>
            <p>Score: {score}</p>
            <p>The ball went out of bounds.</p>
            <div className="fail-modal-actions">
                <button type="button" className="fail-modal-button fail-modal-primary" onClick={onRetry}>
                    Retry
                </button>
                <a
                    href="https://fr.fiverr.com/seller_dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="fail-modal-button fail-modal-secondary"
                >
                    View Akaï Labs
                </a>
            </div>
        </div>
    </div>
);
