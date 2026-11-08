/**
 * Cognevance Technologies - CI/CD Dashboard Client Script
 * Fetches dynamic health and status metrics from backend endpoints.
 */
document.addEventListener("DOMContentLoaded", function () {
    console.log("Cognevance CI/CD Automation Dashboard loaded.");

    // Fetch live status from /api/status
    fetch("/api/status")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var statusEl = document.getElementById("app-status");
            if (statusEl && data.status) {
                statusEl.textContent = data.status.toUpperCase();
            }
        })
        .catch(function (err) {
            console.warn("Could not fetch status API:", err);
        });
});
