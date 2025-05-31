import React, { useState } from "react";
import api from "../../api/api";

const formStyle = {
  margin: "1.5em 0",
  padding: "1.5em",
  border: "1px solid #1976d2",
  borderRadius: 8,
  background: "#f7faff",
  maxWidth: 400,
};

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: 14,
  padding: "0.5em",
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: 16,
};

const buttonStyle = {
  padding: "0.5em 1.2em",
  borderRadius: 4,
  border: "none",
  background: "#1976d2",
  color: "#fff",
  fontWeight: 500,
  cursor: "pointer",
  marginRight: 8,
};

const cancelButtonStyle = {
  ...buttonStyle,
  background: "#aaa",
};

const ServiceForm = ({ category, onClose, onServiceAdded }) => {
  const [name, setName] = useState("");
  const [prices, setPrices] = useState({ Normal: "", Premium: "", Luxury: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setPrices({ ...prices, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Enhanced validation
    if (!name.trim()) {
      setError("Service name is required.");
      return;
    }
    
    if (!prices.Normal || Number(prices.Normal) <= 0) {
      setError("Normal price is required and must be a positive number.");
      return;
    }

    if (prices.Premium && Number(prices.Premium) <= 0) {
      setError("Premium price must be a positive number.");
      return;
    }

    if (prices.Luxury && Number(prices.Luxury) <= 0) {
      setError("Luxury price must be a positive number.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/categories/${category._id}/services`, {
        name: name.trim(),
        prices: {
          Normal: Number(prices.Normal),
          ...(prices.Premium && { Premium: Number(prices.Premium) }),
          ...(prices.Luxury && { Luxury: Number(prices.Luxury) }),
        },
      });
      
      if (response.data) {
        setName("");
        setPrices({ Normal: "", Premium: "", Luxury: "" });
        setSuccess("Service added successfully!");
        if (onServiceAdded) onServiceAdded();
        setTimeout(() => {
          setSuccess("");
          if (onClose) onClose();
        }, 1200);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to add service. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={formStyle} aria-label={`Add service to ${category.name}`}>
      <h4 style={{ marginTop: 0, color: "#1976d2" }}>
        Add Service to <span style={{ fontWeight: 600 }}>{category.name}</span>
      </h4>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label>
          Service Name:
          <input
            type="text"
            placeholder="e.g. Premium Wash"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
            disabled={loading}
            autoFocus
          />
        </label>
        <label>
          Normal Price (required):
          <input
            type="number"
            name="Normal"
            placeholder="Normal Price"
            value={prices.Normal}
            onChange={handleChange}
            required
            style={inputStyle}
            min="0"
            disabled={loading}
          />
        </label>
        <label>
          Premium Price (optional):
          <input
            type="number"
            name="Premium"
            placeholder="Premium Price"
            value={prices.Premium}
            onChange={handleChange}
            style={inputStyle}
            min="0"
            disabled={loading}
          />
        </label>
        <label>
          Luxury Price (optional):
          <input
            type="number"
            name="Luxury"
            placeholder="Luxury Price"
            value={prices.Luxury}
            onChange={handleChange}
            style={inputStyle}
            min="0"
            disabled={loading}
          />
        </label>
        <div>
          <button
            type="submit"
            style={buttonStyle}
            disabled={loading || !name.trim() || !prices.Normal}
          >
            {loading ? "Adding..." : "Add Service"}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={cancelButtonStyle}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
        {success && (
          <div style={{ color: "green", marginTop: 10 }}>{success}</div>
        )}
      </form>
    </div>
  );
};

export default ServiceForm;
