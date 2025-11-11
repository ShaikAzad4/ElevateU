import React, { useState } from "react";
import "./AddCourse.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function AddCourse() {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    tutor: "",
    duration: "",
    curriculum: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    // build payload (coerce price to number)
    const payload = {
      ...formData,
      price: formData.price === "" ? null : Number(formData.price),
    };

    try {
      const res = await fetch(`${API_BASE}/api/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to add course");
      }

      setMsg("✅ Course added successfully!");
      // clear form
      setFormData({
        title: "",
        price: "",
        tutor: "",
        duration: "",
        curriculum: "",
      });
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-course-container">
      <h2 className="form-title">Add a New Course</h2>

      {msg && <div className="status-msg">{msg}</div>}

      <form className="add-course-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course Title</label>
          <input style={{color:"black"}}
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter course title"
            required
          />
        </div>

        <div className="form-group">
          <label>Course Price</label>
          <input style={{color:"black"}}
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter course price"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Course Tutor</label>
          <input style={{color:"black"}}
            type="text"
            name="tutor"
            value={formData.tutor}
            onChange={handleChange}
            placeholder="Enter tutor name"
            required
          />
        </div>

        <div className="form-group">
          <label>Course Duration</label>
          <input style={{color:"black"}}
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="8 weeks"
            required
          />
        </div>

        <div className="form-group">
          <label>Course Curriculum</label>
          <textarea style={{color:"black"}}
            name="curriculum"
            value={formData.curriculum}
            onChange={handleChange}
            placeholder="Enter course curriculum details"
            rows="5"
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Adding..." : "Add Course"}
        </button>
      </form>
    </div>
  );
}

export default AddCourse;
