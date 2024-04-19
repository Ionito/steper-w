import "./styles.css";
import MyForm from "./views/MyForm";

export default function App() {
  return (
    <div className="App">
      <h1>Wizard demo</h1>
      <p>
        {`based on this `}
        <a href="https://thesametech.com/state-machines-in-react/?utm_source=newsletter.reactdigest.net&utm_medium=newsletter&utm_campaign=state-machines-in-react">
          article
        </a>
      </p>
      <MyForm />
    </div>
  );
}
