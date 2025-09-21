try {
  // Inject our helper script into the page
  if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("inject.js");
    (document.head || document.documentElement).appendChild(script);
  }
} catch (err) {
  console.error("DotPush: Failed to inject script:", err);
}

// Listen for messages from inject.js
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data.type === "LEETCODE_CODE_CAPTURED") {
    const { slug, code } = event.data;
    try {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ lastProblem: slug, lastCode: code });
        console.log("✅ Stored full code for:", slug);
      }
    } catch (err) {
      console.error("DotPush: Failed to store code:", err);
    }
  }
});
