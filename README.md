# 🚀 No-Code ML Pipeline Builder

A full-stack web application that empowers users to build, configure, and execute Machine Learning pipelines visually—**without writing a single line of code**.

Designed for simplicity and scalability, this tool separates the visual workflow (Frontend) from the heavy computational logic (Backend).

## 🌟 Key Features

* **🎨 Visual Workflow:** Drag-and-drop interface powered by **React Flow**.
* **📂 Data Ingestion:** Supports CSV and Excel uploads with automatic column detection.
* **⚙️ Smart Preprocessing:** Toggle between `StandardScaler` and `MinMaxScaler` instantly.
* **🧠 Model Training:** Train **Logistic Regression** or **Decision Tree** models in real-time.
* **📊 Instant Results:** View Accuracy scores and Confusion Matrix immediately after execution.
* **⚡ Scalable Architecture:** Decoupled Frontend and Backend for independent scaling.

---

## 🏗️ System Architecture

The application follows a modern **Microservices-style Architecture**:

| Layer | Technology | Responsibility |
| :--- | :--- | :--- |
| **Frontend** | **React.js + React Flow** | Handles the UI, state management, and the visual canvas. |
| **Backend** | **Python (FastAPI)** | REST API that manages file uploads and orchestration. |
| **ML Engine** | **Scikit-Learn + Pandas** | Executes the heavy lifting: data splitting, preprocessing, and training. |

---

## 🛠️ How to Run Locally

Follow these steps to run the application on your own machine.

### 1. Backend Setup (The Brain)
Open a terminal and navigate to the `backend` folder:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
