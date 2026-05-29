import React from "react";

function DynamicForm({ fields, onChange, values }) {
  return (
    <form>
      {fields.map((field) => (
        <div className="mb-3" key={field.name}>
          <label className="form-label">{field.label}</label>

          {/* Render input type dynamically */}
          {field.type === "text" && (
            <input
              type="text"
              className="form-control"
              name={field.name}
              placeholder={field.placeholder}
              value={values[field.name] || ""}
              onChange={(e) => onChange(field.name, e.target.value)}
            />
          )}

          {field.type === "file" && (
            <input
              type="file"
              className="form-control"
              name={field.name}
              accept={field.accept}
              onChange={(e) => onChange(field.name, e.target.files[0])}
            />
          )}

          {field.type === "select" && (
            <select
              className="form-select"
              name={field.name}
              value={values[field.name] || ""}
              onChange={(e) => onChange(field.name, e.target.value)}
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
    </form>
  );
}

export default DynamicForm;
