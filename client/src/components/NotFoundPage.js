import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div>
      <div>
        <h3>Oops!</h3>
        <h1>404</h1>
      </div>
      <div>
        <p>Sorry, the page you are looking for doesn't exist.</p>
        <p>Don't worry, we'll get you back on track.</p>
        <Link to="/">
          <button>Let's go back</button>
        </Link>
      </div>
    </div>
  );
}
