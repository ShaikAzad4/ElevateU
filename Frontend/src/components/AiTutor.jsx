import React, { useState } from "react";
import { FullPageChat } from "flowise-embed-react";
import { useSearchParams, Link } from "react-router-dom";

export default function AiTutor() {
  const [params] = useSearchParams();
  const course = (params.get("course") || "").toLowerCase();
  const title = course ? `${course.charAt(0).toUpperCase() + course.slice(1)} Tutor` : "AI Tutor";
  const [files, setFiles] = useState([]);

  const onPick = (e) => {
    const f = Array.from(e.target.files || []).slice(0, 2);
    setFiles(f);
  };

  const onUpload = async () => {
    try {
      if (!files.length) return;
      if (window.uploadImagesToFlowise) {
        await window.uploadImagesToFlowise(files);
        alert("Images uploaded. Check the chat for analysis.");
      } else {
        alert("Chat is not ready. Try again after the page loads.");
      }
    } catch (e) {
      alert(String(e.message || e));
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff7ef" }}>
      <div style={{ padding: 12, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <Link to="/mycourse" style={{ textDecoration: "none", color: "#7c3aed" }}>← Back to MyCourse</Link>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <input type="file" accept="image/*" multiple onChange={onPick} />
          <button onClick={onUpload} style={{ background: "#ff9800", color: "#ffffff", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>Upload Images</button>
        </div>
      </div>
      <FullPageChat
        chatflowid="76037c3f-89d7-4a13-8719-09c180361eb2"
        apiHost="https://cloud.flowiseai.com"
        theme={{
          chatWindow: {
            title: title,
            titleBackgroundColor: "#ff9800",
            titleTextColor: "#ffffff",
            backgroundColor: "#fff7ef",
            textColor: "#5d4037",
            welcomeMessage: "Type your question or upload up to 2 images.",
            sendButtonColor: "#ff9800",
          },
        }}
      />
    </div>
  );
}