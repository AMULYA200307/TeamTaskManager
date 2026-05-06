import { useState } from "react";
import axios from "axios";

function App() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const [dashboard, setDashboard] = useState(null);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [status, setStatus] = useState("Todo");

  const [taskMessage, setTaskMessage] = useState("");

  const [tasks, setTasks] = useState([]);


  // ------------------------
  // LOGIN
  // ------------------------
  const loginUser = async () => {

    try {

      const response = await axios.post(
        "http://127.0.0.1:5000/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      setMessage("Login Successful ✅");

      fetchDashboard(response.data.token);

      fetchTasks(response.data.token);

    } catch (error) {

      setMessage("Login Failed ❌");

      console.log(error);
    }
  };


  // ------------------------
  // FETCH DASHBOARD
  // ------------------------
  const fetchDashboard = async (token) => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:5000/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setDashboard(response.data);

    } catch (error) {

      console.log(error);
    }
  };


  // ------------------------
  // FETCH TASKS
  // ------------------------
  const fetchTasks = async (token) => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:5000/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTasks(response.data);

    } catch (error) {

      console.log(error);
    }
  };


  // ------------------------
  // CREATE TASK
  // ------------------------
  const createTask = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://127.0.0.1:5000/tasks",
        {
          title,
          description,
          status,
          due_date: "2026-05-10",
          assigned_to: 1,
          project_id: 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTaskMessage("Task Created ✅");

      fetchDashboard(token);

      fetchTasks(token);

      setTitle("");

      setDescription("");

      setStatus("Todo");

    } catch (error) {

      setTaskMessage("Task Creation Failed ❌");

      console.log(error);
    }
  };


  // ------------------------
  // LOGOUT
  // ------------------------
  const logoutUser = () => {

    localStorage.removeItem("token");

    window.location.reload();
  };


  return (

    <div style={{
      padding: "40px",
      fontFamily: "Arial",
      backgroundColor: "#0f172a",
      minHeight: "100vh",
      color: "white"
    }}>

      <h1 style={{
        textAlign: "center",
        marginBottom: "40px",
        fontSize: "50px"
      }}>
        Team Task Manager
      </h1>


      {/* LOGIN FORM */}

      <div style={{
        width: "300px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "none"
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "none"
          }}
        />

        <button
          onClick={loginUser}
          style={{
            padding: "10px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Login
        </button>

        <p>{message}</p>

      </div>


      {/* DASHBOARD SECTION */}

      {dashboard && (

        <div style={{
          marginTop: "40px",
          display: "flex",
          gap: "30px",
          flexWrap: "wrap"
        }}>

          {/* DASHBOARD CARD */}

          <div style={{
            border: "1px solid gray",
            padding: "20px",
            width: "300px",
            borderRadius: "10px",
            backgroundColor: "#111827"
          }}>

            <h2>Dashboard</h2>

            <p>
              Total Tasks:
              {" "}
              {dashboard.total_tasks}
            </p>

            <p>
              Completed Tasks:
              {" "}
              {dashboard.completed_tasks}
            </p>

            <p>
              Pending Tasks:
              {" "}
              {dashboard.pending_tasks}
            </p>


            <button
              onClick={logoutUser}
              style={{
                padding: "10px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "20px",
                width: "100%"
              }}
            >
              Logout
            </button>

          </div>


          {/* CREATE TASK */}

          <div style={{
            border: "1px solid gray",
            padding: "20px",
            width: "300px",
            borderRadius: "10px",
            backgroundColor: "#111827",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>

            <h2>Create Task</h2>

            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "none"
              }}
            />

            <input
              type="text"
              placeholder="Task Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "none"
              }}
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "none"
              }}
            >

              <option>Todo</option>

              <option>In Progress</option>

              <option>Done</option>

            </select>


            <button
              onClick={createTask}
              style={{
                padding: "10px",
                backgroundColor: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Create Task
            </button>

            <p>{taskMessage}</p>

          </div>


          {/* TASK LIST */}

          <div style={{
            border: "1px solid gray",
            padding: "20px",
            width: "300px",
            borderRadius: "10px",
            backgroundColor: "#111827"
          }}>

            <h2>Tasks List</h2>

            {tasks.map((task) => (

              <div
                key={task.id}
                style={{
                  marginBottom: "15px"
                }}
              >

                <p>
                  <strong>{task.title}</strong>
                </p>

                <p>
                  Status:
                  {" "}
                  {task.status}
                </p>

                <hr />

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  )
}

export default App;