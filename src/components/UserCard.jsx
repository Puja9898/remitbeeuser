import React from "react";

export default function UserCard({ user, onClick, isSelected }) {
  return (
    <div
      className={`card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <h3>{user.name}</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Company:</strong> {user.company?.name}</p>
      <p><strong>City:</strong> {user.address?.city}</p>
    </div>
  );
}
