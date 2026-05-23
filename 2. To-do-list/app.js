const express = require("express");
const path = require("path");

const app = express();
const PORT = 8000;



app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let todos = [
  {
    id: "1712210000000",
    title: "Finalize UI Design",
    description: "Implement glassmorphism and bento grids",
    priority: "High",
    status: "In Progress",
  },
];

const getStats = () => ({
  total: todos.length,
  pending: todos.filter((t) => t.status === "Pending").length,
  completed: todos.filter((t) => t.status === "Completed").length,
});

const buildAddFormData = (body = {}) => ({
  title: body.title || "",
  description: body.description || "",
  priority: body.priority || "Medium",
});

app.get("/", (req, res) => {
  res.render("dashboard", {
    tasks: todos,
    stats: getStats(),
    message: req.query.msg || "",
    type: req.query.type || "info",
  });
});

app.get("/add", (req, res) => {
  res.render("add-task", {
    error: "",
    formData: buildAddFormData(),
  });
});

app.post("/add", (req, res) => {
  const { title, description, priority } = req.body;
  const formData = buildAddFormData(req.body);

  if (!title || !title.trim()) {
    return res.status(400).render("add-task", {
      error: "Task title is required.",
      formData,
    });
  }

  todos.push({
    id: Date.now().toString(),
    title: title.trim(),
    description: (description || "").trim(),
    priority: priority || "Medium",
    status: "Pending",
  });

  res.redirect("/?msg=Task created successfully&type=success");
});

app.get("/edit/:id", (req, res) => {
  const todo = todos.find((t) => t.id === req.params.id);

  if (!todo) {
    return res.redirect("/?msg=Task not found&type=danger");
  }

  res.render("edit-task", { task: todo, error: "" });
});

app.post("/update/:id", (req, res) => {
  const index = todos.findIndex((t) => t.id === req.params.id);

  if (index === -1) {
    return res.redirect("/?msg=Update failed&type=danger");
  }

  if (!req.body.title || !req.body.title.trim()) {
    return res.status(400).render("edit-task", {
      error: "Task title is required.",
      task: {
        ...todos[index],
        ...req.body,
      },
    });
  }

  todos[index] = {
    ...todos[index],
    title: req.body.title.trim(),
    description: (req.body.description || "").trim(),
    priority: req.body.priority || "Medium",
    status: req.body.status || todos[index].status,
  };

  res.redirect("/?msg=Update successful&type=success");
});

app.post("/status/:id", (req, res) => {
  const todo = todos.find((t) => t.id === req.params.id);

  if (!todo) {
    return res.redirect("/?msg=Task not found&type=danger");
  }

  const flow = {
    Pending: "In Progress",
    "In Progress": "Completed",
    Completed: "Pending",
  };

  todo.status = flow[todo.status];
  res.redirect("/?msg=Status advanced&type=info");
});

app.get("/delete/:id", (req, res) => {
  todos = todos.filter((t) => t.id !== req.params.id);
  res.redirect("/?msg=Task removed&type=warning");
});

app.listen(PORT, () => {
  console.log(`Server active on http://localhost:${PORT}`);
});
