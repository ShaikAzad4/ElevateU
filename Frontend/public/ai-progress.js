// public/ai-progress.js
(function () {
  const API = {
    progressBase: (window.PROGRESS_BASE || "http://localhost:5001"),
    flowiseHost: (window.FLOWISE_HOST || "https://cloud.flowiseai.com"),
    chatflowId: (window.FLOWISE_CHATFLOWID || "76037c3f-89d7-4a13-8719-09c180361eb2"),
    list(clerkId) {
      return fetch(`${this.progressBase}/progress/java/topics?clerk_id=${encodeURIComponent(clerkId)}`)
        .then(r => r.json());
    },
    listPython(clerkId) {
      return fetch(`${this.progressBase}/progress/python/topics?clerk_id=${encodeURIComponent(clerkId)}`)
        .then(r => r.json());
    },
    complete(clerkId, topicKey) {
      return fetch(`${this.progressBase}/progress/java/complete`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ clerk_id: clerkId, topic_key: topicKey })
      }).then(r => r.json());
    }
  };

  // Helper: open Flowise with prefilled Java progress message
  async function openJavaChatWithProgress() {
    const clerkId = window.Clerk?.user?.id;
    if (!clerkId) {
      alert("Please sign in first to track progress.");
      return;
    }

    // Load current topics
    const data = await API.list(clerkId);
    const topics = (data.topics || []).map(t => `${t.done ? "✅" : "⬜"} ${t.key}: ${t.title}`).join("\n");

    const msg = `I'm continuing my Java course.

My current topic checklist:
${topics}

Rules:
- When I say "mark tN done", mark that topic as complete
- After every update, tell me the new % complete (10/20/30/.../100)
- If I say "what's next?", suggest the next not-done topic
- Keep responses short.

Let's begin. What’s the next topic?`;

    try {
      if (window.FlowiseChat) {
        window.FlowiseChat.open();
        setTimeout(() => {
          const input = document.querySelector('input[placeholder*="Type your question"], textarea');
          const send = document.querySelector('button, [role="button"]');
          if (input) {
            input.value = msg;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
          if (send) send.click();
        }, 400);
      } else {
        alert("Chat is not loaded yet. Please click the chat bubble and paste this:\n\n" + msg);
      }
    } catch (e) {
      console.error(e);
      alert("Open the chat and paste:\n\n" + msg);
    }
  }

  async function openPythonChatWithProgress() {
    const clerkId = window.Clerk?.user?.id;
    if (!clerkId) { alert("Please sign in first to track progress."); return; }
    const data = await API.listPython(clerkId);
    const topics = (data.topics || []).map(t => `${t.done ? "✅" : "⬜"} ${t.key}: ${t.title}`).join("\n");
    const msg = `I'm continuing my Python course.\n\nMy current topic checklist:\n${topics}\n\nPlease guide me next.`;
    try {
      if (window.FlowiseChat) {
        window.FlowiseChat.open();
        setTimeout(() => {
          const input = document.querySelector('input[placeholder*="Type your question"], textarea');
          const send = document.querySelector('button, [role="button"]');
          if (input) { input.value = msg; input.dispatchEvent(new Event('input', { bubbles: true })); }
          if (send) send.click();
        }, 400);
      } else {
        alert("Chat is not loaded yet. Please click the chat bubble and paste this:\n\n" + msg);
      }
    } catch (e) {
      console.error(e);
      alert("Open the chat and paste:\n\n" + msg);
    }
  }

  // Utility: find the Java course card on MyCourse and wire Details/Flowise buttons
  function wireDetailsButtons() {
    // Scan all cards periodically (MyCourse renders after fetch)
    const scan = () => {
      const cards = Array.from(document.querySelectorAll(".course-progress-card"));
      cards.forEach(card => {
        const title = (card.querySelector("h3")?.textContent || "").trim().toLowerCase();
        if (title.includes("java")) {
          const targets = Array.from(card.querySelectorAll("a,button"));
          const opener = targets.find(el => /(details|powered\s*by\s*flowise|flowise)/i.test(el.textContent || ""));
          if (opener && !opener.dataset.aiHooked) {
            opener.dataset.aiHooked = "1";
            opener.addEventListener("click", async (ev) => {
              // If the element is a link to details, prevent default and open chat
              const isDetails = /details/i.test(opener.textContent || "");
              if (isDetails) ev.preventDefault();
              openJavaChatWithProgress();
            });
          }
        }
      });
    };
    // Observe changes (React re-render)
    const observer = new MutationObserver(scan);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    scan();
  }

  // Run when page is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireDetailsButtons);
  } else {
    wireDetailsButtons();
  }

  async function uploadImagesToFlowise(files) {
    const toDataUrl = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const uploads = [];
    for (const f of files) {
      const dataUrl = await toDataUrl(f);
      uploads.push({ data: dataUrl, type: "file", name: f.name, mime: f.type || "image/png" });
    }
    const body = {
      question: "Please analyze these images and explain.",
      chatId: (window.Clerk?.user?.id || undefined),
      uploads,
    };
    const resp = await fetch(`${API.flowiseHost}/api/v1/prediction/${API.chatflowId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await resp.json();
  }

  window.JavaProgressAPI = API;
  window.openJavaChatWithProgress = openJavaChatWithProgress;
  window.openPythonChatWithProgress = openPythonChatWithProgress;
  window.uploadImagesToFlowise = uploadImagesToFlowise;
})();
