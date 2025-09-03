const usuariosRepository = require("../repositories/usuariosRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

// Schema de validação para o registro de um novo usuário.
const registerSchema = z.object({
  nome: z.string({ required_error: "O campo 'nome' é obrigatório." }),
  email: z.string().email({ message: "Formato de e-mail inválido." }),
  senha: z
    .string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
    .regex(/[a-z]/, {
      message: "A senha deve conter pelo menos uma letra minúscula.",
    })
    .regex(/[A-Z]/, {
      message: "A senha deve conter pelo menos uma letra maiúscula.",
    })
    .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "A senha deve conter pelo menos um caractere especial.",
    }),
});

// Schema de validação para o login.
const loginSchema = z.object({
  email: z.string().email({ message: "E-mail ou senha inválidos." }),
  senha: z.string().min(1, { message: "E-mail ou senha inválidos." }),
});

const register = async (req, res) => {
  try {
    const dadosUsuario = registerSchema.parse(req.body);
    const usuarioExistente = await usuariosRepository.findByEmail(
      dadosUsuario.email
    );
    if (usuarioExistente) {
      return res.status(400).json({ message: "Este e-mail já está em uso." });
    }
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(dadosUsuario.senha, saltRounds);
    const [novoUsuario] = await usuariosRepository.create({
      nome: dadosUsuario.nome,
      email: dadosUsuario.email,
      senha: senhaHash,
    });
    const { senha, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json(usuarioSemSenha);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Dados inválidos.", errors: error.errors });
    }
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const login = async (req, res) => {
  try {
    const dadosLogin = loginSchema.parse(req.body);
    const usuario = await usuariosRepository.findByEmail(dadosLogin.email);
    if (!usuario) {
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }
    const senhaCorreta = await bcrypt.compare(dadosLogin.senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }
    const payload = { id: usuario.id, email: usuario.email };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: "1h" };
    const token = jwt.sign(payload, secret, options);
    res.status(200).json({ access_token: token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Verifica se o usuário tentando apagar é ele mesmo ou um admin (lógica de admin não implementada)
    if (req.user.id !== parseInt(id)) {
      return res
        .status(403)
        .json({
          message: "Acesso negado. Você só pode excluir sua própria conta.",
        });
    }
    const sucesso = await usuariosRepository.remove(id);
    if (!sucesso) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const logout = (req, res) => {
  // Para JWT sem estado, o logout é uma operação do lado do cliente.
  // O servidor não pode invalidar o token antes que ele expire.
  // Este endpoint está aqui para confirmar o pedido de logout.
  res
    .status(200)
    .json({
      message:
        "Logout realizado com sucesso. O cliente deve descartar o token.",
    });
};

module.exports = {
  register,
  login,
  deleteUser,
  logout,
};
