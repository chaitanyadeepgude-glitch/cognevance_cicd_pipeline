# Screenshot Evidence Submission Checklist

**Organization:** Cognevance Technologies  
**Project:** CI/CD Pipeline Automation System (Level 2)

As part of your internship evaluation, capture actual screenshots of the executed pipeline and application, and save them in this directory.

---

## Required Screenshots Checklist:

1. **`01_application_homepage.png`**  
   Screenshot of the web application homepage in your browser at `http://localhost:5000` or the live dashboard URL.

2. **`02_devops_dashboard.png`**  
   Screenshot of the DevOps CI/CD Automation Dashboard showing system status, telemetry cards, and metrics.

3. **`03_health_endpoint.png`**  
   Screenshot of the `/health` endpoint returning JSON (`"status": "healthy"`) in your browser or Postman/curl.

4. **`04_api_status_endpoint.png`**  
   Screenshot of the `/api/status` endpoint returning JSON metadata.

5. **`05_pytest_test_results.png`**  
   Screenshot of your terminal showing successful execution of `pytest tests/ -v` (all 6 tests passing in green).

6. **`06_docker_image_build.png`**  
   Screenshot of the terminal running `docker build -t cicd-automation-app .` successfully.

7. **`07_running_docker_container.png`**  
   Screenshot of terminal running `docker ps` showing the container in running and healthy state.

8. **`08_github_actions_workflow.png`**  
   Screenshot of the GitHub Actions workflow definition in `.github/workflows/ci-cd.yml` on GitHub.

9. **`09_successful_cicd_pipeline.png`**  
   Screenshot of the GitHub Actions run showing all jobs and stages with green checkmarks.

10. **`10_dockerhub_repository.png`**  
    Screenshot of your Docker Hub account showing the `cognevance-cicd-automation` repository with `:latest` and Git SHA tags.

11. **`11_final_deployment.png`**  
    Screenshot of the deployed application running live on your AWS EC2 public IP or domain at port 5000.
