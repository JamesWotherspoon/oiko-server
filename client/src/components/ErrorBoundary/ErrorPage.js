
export default function ErrorFallbackPage(props) {
    return (
        <div className={"error-page"}>
            <div className={"oops"}>Oops!</div>
            <div className={"message"}>Something went wrong...</div>
            <div className={"message"}>{JSON.stringify(props.error)}</div>
            {props.resetErrorBoundary && (
                <div>
                    <button className={"retry-button"} onClick={props.resetErrorBoundary}>
                        Try Again!
                    </button>
                </div>
            )}
        </div>
    );
}