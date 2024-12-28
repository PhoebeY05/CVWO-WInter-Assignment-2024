import React, { useEffect, useState } from 'react';
import { create } from "../functions/requests"
import { getUsername } from "../functions/username"

const NewComment =({ identifier, text, post_id, parent_id }) => {
  const [anonymous, setAnonymous] = useState(false);
  const [body, setBody] = useState("");
  const [name, setName] = useState(null);

  // Get username of current user
  useEffect(() => {
      getUsername().then((res) => res.message ? setName(null) : setName(res.username));
    }, [post_id])
  
  // Sending variables to backend to create a new comment
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = `/api/v1/comments/create`;
    if (body.length == 0)
      return;
    const request_body = {
      body,
      post_id: post_id, 
      parent_id: parent_id,
      author: name,
      anonymous
    };
    const token = document.getElementsByName("csrf-token")[0].getAttribute('content')!;

    create(url, token, request_body)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => location.reload())
      .catch((error) => console.log(error.message));
  };

  // Autofocus in text area
  useEffect(() => {
    const myModal = document.getElementById(`Modal${identifier}`);
    const myInput = document.getElementById(`body${identifier}`)
    if (myModal) {
      myModal.addEventListener('shown.bs.modal', () => {
        myInput?.focus();
      });
    }
  }, []);

  return (
    <>
      {/* Button to open modal */}
      <button
        type="button"
        className="btn btn-link fst-italic fs-5 pt-0 px-0 text-reset"
        data-bs-toggle="modal"
        data-bs-target={`#Modal${identifier}`}
      >
        {text}
      </button>
      {/* Modal */}
      <div className="modal fade" id={`Modal${identifier}`} tabIndex={-1} aria-labelledby={`modalTitle_${identifier}`} aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <p className="modal-title fs-5 h1" id={`modalTitle_${identifier}`}>Comment</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            {/* Input fields */}
            <form onSubmit={onSubmit}>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  id={`body${identifier}`}
                  name={`body${identifier}`}
                  rows={5}
                  required
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                />
                <div className="form-check mt-3">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange ={(event: React.ChangeEvent<HTMLInputElement>) => {setAnonymous(!anonymous)}}></input>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Comment Anonymously
                </label>
              </div>
              {/* Buttons at the bottom to close/submit */}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-success">Comment</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewComment;
