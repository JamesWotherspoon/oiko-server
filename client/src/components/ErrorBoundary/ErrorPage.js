export default function ErrorFallbackPage(props) {
  return (
    <div className="error-page-cont">
      <div className="error-page-title-cont">
        <h3 className="header">Oops!</h3>
      </div>
      <div>
        <p className="info-font">Something went wrong...</p>
        <p className="info-font">Error code: {props.error.code}</p>
        {props.resetErrorBoundary && (
          <div>
            <button
              className="retry-button margin-top-4"
              onClick={props.resetErrorBoundary}
            >
              Try Again!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
