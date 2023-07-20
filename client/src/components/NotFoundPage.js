import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>Oops!</p>
      <p>The page you are looking for does not exist.</p>
      <p>
        You can go back to the <Link to="/">Home Page</Link> or navigate to
        other sections using the navigation menu.
      </p>
    </div>
  );
}
