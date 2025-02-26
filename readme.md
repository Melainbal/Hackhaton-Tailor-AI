# 🚀 Tailor AI Wizard

Tailor AI Wizard is a full-stack application with both a **frontend (React)** and a **backend (Node.js & Express)**.

A wizard that allows you to match a custom fit llm model to your user task and machine specs.

The problem:

Customer experience around AI model selection and deployment is complex and labor intensive.​

Lacking support for automated model mobilization across Dell platforms and scaling to fit target H/W.

The solution:

Analyze customer H/W and model requirements​

Cloud, servers, PCs/Laptops, edge devices​

Leverage model compression techniques such as quantization and knowledge distillation​

Automate model mobilization + serving at scale​


Steps:

Start​

User Defines Task​

Get Machine Specs​

Analyze Specs vs. Model​

Suggest Models​

Quantize​

Deploy​

End​

---

## ⚙️ **Setup Instructions**

🖥️ Backend Setup (Node.js & Express)

1️⃣ Navigate to the backend folder

cd backend

2️⃣ Install dependencies

npm install

3️⃣ Set up environment variables

Create a .env file in the backend/ folder with the following:

SSH_HOST=your_host

SSH_USER=your_username

SSH_KEY_PATH=path_to_ssh_key

SSH_PASS

DSP_MANAGER_URL

DSP_MANAGER_TOKEN

4️⃣ Start the backend server

node server.js

🚀 The backend should now be running on http://localhost:5000.


---------------------------


🌍 Frontend Setup (React)

1️⃣ Navigate to the frontend folder

cd ../frontend

2️⃣ Install dependencies

npm install

3️⃣ Start the frontend

npm run dev

🚀 The frontend should now be running on http://localhost:3000.

