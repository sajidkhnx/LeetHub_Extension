const REPO_NAME = "leetcode";


chrome.runtime.onMessage.addListener(async (msg) => {
if (msg.type === "SOLVED") {
const { slug, code } = msg.data;
chrome.storage.sync.get(["githubToken", "githubUser"], async (items) => {
if (!items.githubToken || !items.githubUser) {
console.error("⚠️ GitHub token/username not set");
return;
}
await ensureRepoExists(items.githubUser, items.githubToken);
await pushToGitHub(items.githubUser, items.githubToken, slug, code);
});
}
});


// ✅ Ensure repo exists or create it
async function ensureRepoExists(user, token) {
const url = `https://api.github.com/repos/${user}/${REPO_NAME}`;


const res = await fetch(url, {
headers: { Authorization: `token ${token}` }
});


if (res.status === 404) {
console.log("📦 Repo not found, creating one...");
const createRes = await fetch(`https://api.github.com/user/repos`, {
method: "POST",
headers: {
Authorization: `token ${token}`,
Accept: "application/vnd.github.v3+json",
},
body: JSON.stringify({
name: REPO_NAME,
private: false // set true if you want private repo
}),
});


if (!createRes.ok) {
console.error("❌ Failed to create repo", await createRes.json());
} else {
console.log("✅ Repo created!");
}
}
}


// ✅ Push solution file to GitHub
async function pushToGitHub(user, token, slug, code) {
const path = `leetcode/${slug}.js`;
const url = `https://api.github.com/repos/${user}/${REPO_NAME}/contents/${path}`;
const content = btoa(unescape(encodeURIComponent(code)));


const res = await fetch(url, {
method: "PUT",
headers: {
Authorization: `token ${token}`,
Accept: "application/vnd.github.v3+json",
},
body: JSON.stringify({
message: `Add solution for ${slug}`,
content,
}),
});


if (res.ok) {
console.log(`✅ Pushed ${slug} to GitHub`);
} else {
console.error("❌ Push failed", await res.json());
}}