function getProblemSlug() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts.includes("problems") ? parts[parts.indexOf("problems") + 1] : null;
}

function captureCode() {
  try {
    if (window.monaco && monaco.editor && monaco.editor.getModels().length > 0) {
      const code = monaco.editor.getModels()[0].getValue();
      const slug = getProblemSlug();
      if (slug && code) {
        window.postMessage({ type: "LEETCODE_CODE_CAPTURED", slug, code }, "*");
      }
    }
  } catch (err) {
    console.error("❌ Failed to capture code:", err);
  }
}

// Run every 5 seconds
setInterval(captureCode, 5000);
