import { useState } from "react";
import { ListChecks} from "lucide-react";

import DynamicForm from "./DymamicForm";

function Modal({
        buttonName,
        innerTitle,
        fields
}) {
    const [showModal, setShowModal] = useState(false);

    const handleModalClick = () => {
        setShowModal(true);
    };

  const [formValues, setFormValues] = useState({});

  const handleChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };


    return (
        <>
            {/* M3U Playlist card opens modal */}
            <div
                className="media-card p-4 text-center"
                onClick={handleModalClick}
            >
                <div className="media-icon mb-2">
                    <ListChecks size={36} />
                </div>
                <h5 className="fw-semibold mb-0">{buttonName}</h5>
            </div>

            {showModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">{innerTitle}</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <DynamicForm
                                    fields={fields}
                                    values={formValues}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="modal-footer border-0">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                                <button className="btn btn-primary">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

}

export default Modal;