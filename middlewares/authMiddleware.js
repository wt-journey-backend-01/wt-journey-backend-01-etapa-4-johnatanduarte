const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // 1. Pega o header de autorização da requisição.
  const authHeader = req.headers["authorization"];

  // 2. Verifica se o header existe.
  if (!authHeader) {
    return res.status(401).json({ message: "Token de acesso não fornecido." });
  }

  // 3. O header vem no formato "Bearer <token>". Precisamos separar o token.
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token mal formatado." });
  }

  try {
    // 4. Verifica se o token é válido usando o segredo.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Adiciona os dados do usuário (payload do token) ao objeto `req`.
    // Isso permite que as rotas seguintes saibam quem é o usuário autenticado.
    req.user = decoded;

    // 6. Chama a próxima função (o controlador da rota) para continuar.
    next();
  } catch (error) {
    // 7. Se o token for inválido (expirado, assinatural ilegal, etc.), retorna um erro.
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

module.exports = authMiddleware;
