// Load saved config on popup open
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["githubUser", "githubRepo", "githubToken"], (data) => {
    if (data.githubUser) document.getElementById("ghUser").value = data.githubUser;
    if (data.githubRepo) document.getElementById("ghRepo").value = data.githubRepo;
    if (data.githubToken) document.getElementById("ghToken").value = data.githubToken;
  });
});

// Save config
document.getElementById("saveConfig").addEventListener("click", () => {
  const githubUser = document.getElementById("ghUser").value.trim();
  const githubRepo = document.getElementById("ghRepo").value.trim();
  const githubToken = document.getElementById("ghToken").value.trim();

  chrome.storage.local.set({ githubUser, githubRepo, githubToken }, () => {
    document.getElementById("status").textContent = "✅ Config saved!";
  });
});

// Manual push
document.getElementById("pushBtn").addEventListener("click", async () => {
  const statusDiv = document.getElementById("status");
  statusDiv.textContent = "⏳ Pushing...";

  chrome.storage.local.get(
    ["lastProblem", "lastCode", "githubUser", "githubRepo", "githubToken"],
    async (data) => {
      if (!data.lastProblem || !data.lastCode) {
        statusDiv.textContent = "❌ No problem found. Solve something first.";
        return;
      }

      if (!data.githubUser || !data.githubRepo || !data.githubToken) {
        statusDiv.textContent = "❌ Please save GitHub config first.";
        return;
      }

      const fileName = `${data.lastProblem}.java`; // Java file
      const apiUrl = `https://api.github.com/repos/${data.githubUser}/${data.githubRepo}/contents/leetcode/${fileName}`;

      try {
        const res = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Authorization": `token ${data.githubToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: `Add solution for ${data.lastProblem}`,
            content: btoa(unescape(encodeURIComponent(data.lastCode))),
            branch: "main"
          })
        });

        if (res.ok) {
          statusDiv.textContent = `✅ Pushed ${data.lastProblem}`;
        } else {
          const err = await res.json();
          statusDiv.textContent = `❌ Failed: ${err.message}`;
        }
      } catch (e) {
        statusDiv.textContent = "❌ Error: " + e.message;
      }
    }
  );
});
