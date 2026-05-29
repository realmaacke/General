import "./Loading.css";

interface props {
    text: string
}

export default function Loading(props : props) {
    return (
        <>
        <div className="loading-container">

            <div className="loading-body">
                <span className="loader"></span>
                <p>{props.text}</p>
            </div>

        </div>
        </>
    );
}