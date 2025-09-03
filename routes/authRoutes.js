const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Define a rota para registrar um novo usuário.
// POST /auth/register
router.post("/register", authController.register);

// Define a rota para login de um usuário.
// POST /auth/login
router.post("/login", authController.login);

module.exports = router;
