"use client";

import React, { useState } from "react";

export function DeleteTripButton({
  tripName,
  confirmAction,
}: {
  tripName: string;
  confirmAction: () => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="danger" type="button" onClick={() => setOpen(true)}>
        Delete
      </button>
      {open ? (
        <DeleteDialog
          tripName={tripName}
          confirmAction={confirmAction}
          onCancel={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

export function DeleteDialog({
  tripName,
  confirmAction,
  onCancel,
}: {
  tripName: string;
  confirmAction: () => void | Promise<void>;
  onCancel: () => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-trip-title"
      >
        <h2 id="delete-trip-title">Delete {tripName}</h2>
        <form action={confirmAction}>
          <p>Permanently delete {tripName} and its days? This cannot be undone.</p>
          <div className="actions">
            <button className="danger" type="submit">
              Delete trip
            </button>
            <button className="secondary" type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
