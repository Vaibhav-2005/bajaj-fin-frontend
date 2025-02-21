import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

const filterOptions = [
  { value: "alphabets", label: "Alphabets" },
  { value: "numbers", label: "Numbers" },
  { value: "highest_alphabet", label: "Highest Alphabet" },
];

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(input);
      const res = await axios.post("https://your-backend.onrender.com/bfhl", parsedInput);
      setResponse(res.data);
      setError(null);
    } catch (err) {
      setError("Invalid JSON or API error");
      setResponse(null);
    }
  };

  const filteredResponse = selectedFilters.reduce((acc, filter) => {
    if (response) {
      if (filter.value === "alphabets") {
        acc[filter.label] = [...(response["alphabets"] || []), ...(response["highest_alphabet"] || [])];
      } else if (response[filter.value]) {
        acc[filter.label] = response[filter.value];
      }
    }
    return acc;
  }, {});

  return (
    <div className="container">
      <label className="label">JSON Processor</label>
      <textarea
        className="json-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows="4"
      />
      <button className="submit-button" onClick={handleSubmit}>Submit</button>
      {error && <p className="error-message">{error}</p>}
      {response && (
        <div className="response-container">
          <label className="label">Filter</label>
          <Select
            isMulti
            options={filterOptions}
            className="dropdown"
            onChange={setSelectedFilters}
          />
          <h3>Response</h3>
          <pre className="filtered-response">{JSON.stringify(filteredResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;