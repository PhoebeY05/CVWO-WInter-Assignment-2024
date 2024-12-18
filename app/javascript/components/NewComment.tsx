import React, { useEffect } from 'react';

interface NewCommentProps {
  text: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setBody: (value: string) => void;
}

const NewComment: React.FC<NewCommentProps> = ({ text, onSubmit, setBody }) => {
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    event.stopPropagation(); // Prevent bubbling to parent elements
    onSubmit(event); // Call the provided onSubmit handler
  };
  useEffect(() => {
    const myModal = document.getElementById('Modal');
    const myInput = document.getElementById('body');
    if (myModal) {
      myModal.addEventListener('shown.bs.modal', () => {
        myInput?.focus();
      });
    }
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn btn-link fst-italic fs-5 pt-0 px-0 text-reset"
        data-bs-toggle="modal"
        data-bs-target="#Modal"
      >
        {text}
      </button>

      <div className="modal fade" id="Modal" tabIndex={-1} aria-labelledby="modalTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <p className="modal-title fs-5 h1" id="modalTitle">Comment</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  id="body"
                  name="body"
                  rows={5}
                  required
                  onChange={(event) => setBody(event.target.value)}
                />
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
