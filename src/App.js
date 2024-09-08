import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const schemaOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState(schemaOptions);

  const handleAddSchema = (value) => {
    const schema = availableSchemas.find((option) => option.value === value);
    if (schema) {
      setSelectedSchemas([...selectedSchemas, schema]);
      setAvailableSchemas(
        availableSchemas.filter((option) => option.value !== value)
      );
    }
  };

  const handleRemoveSchema = (index) => {
    const removedSchema = selectedSchemas[index];
    setSelectedSchemas(selectedSchemas.filter((_, i) => i !== index));
    setAvailableSchemas([...availableSchemas, removedSchema]);
  };

  const handleSaveSegment = () => {
    const data = {
      segment_name: segmentName,
      schema: selectedSchemas.map((schema) => ({
        [schema.value]: schema.label,
      })),
    };

    axios
      .post("https://webhook.site/4a5d45ee-6b7b-4069-a7c9-ab2793c1b1c2", data)
      .then((response) => {
        alert("Segment saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving segment", error);
      });
  };

  return (
    <div className="App">
      <button onClick={() => setShowPopup(true)}>Save segment</button>

      {showPopup && (
        <div className="popup">
          <h3>Save Segment</h3>
          <input
            type="text"
            placeholder="Segment name"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
          />

          <div className="schema-dropdown">
            <select
              onChange={(e) => handleAddSchema(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Add schema to segment
              </option>
              {availableSchemas.map((schema) => (
                <option key={schema.value} value={schema.value}>
                  {schema.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() =>
              handleAddSchema(
                document.querySelector(".schema-dropdown select").value
              )
            }
          >
            + Add new schema
          </button>

          <div className="schema-list">
            {selectedSchemas.map((schema, index) => (
              <div key={index} className="schema-item">
                <span>{schema.label}</span>
                <button onClick={() => handleRemoveSchema(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button onClick={handleSaveSegment}>Save the segment</button>
        </div>
      )}
    </div>
  );
}

export default App;
