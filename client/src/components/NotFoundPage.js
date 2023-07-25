import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="not-found-cont">
      <div className="not-found-title-cont">
        <h3 className="header">Oops!</h3>
        <h1 className="primary-color feature-text-1">404</h1>
      </div>
      <div>
        <p className="info-font">The page you are looking for can't be found.</p>
        <Link to="/">
          <button className="margin-top-4">Let's go back</button>
        </Link>
      </div>
    </div>
  );
}
