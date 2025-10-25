import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

function EditProfilePage() {
  const { user, loading, handleUpdate, handleDelete } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Quando o user for carregado, preenche os inputs com os dados atuais
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  if (loading) return <p>Carregando perfil...</p>;
  if (!user) return <p>Erro: utilizador não encontrado.</p>;

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const updatedData = {
        name: name || user.name,
        email: email || user.email,
        password: password || undefined,
      };

      const res = await handleUpdate(updatedData);

      if (res?.message) {
        setMessage("Perfil atualizado com sucesso!");
        setPassword("");
      } else {
        setError("Falha ao atualizar perfil");
      }
    } catch {
      setError("Erro ao atualizar perfil");
    }
  }

  async function handleDeleteAccount() {
    const confirmDelete = confirm("Tem certeza que deseja apagar a sua conta?");
    if (!confirmDelete) return;

    try {
      await handleDelete();
      navigate("/login");
    } catch {
      setError("Erro ao apagar conta");
    }
  }

  return (
    <div className="edit-profile">
      <h2>Perfil do Utilizador</h2>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <label>Nome</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label>Nova Palavra-passe</label>
        <input
          type="password"
          placeholder="Deixe em branco para não alterar"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit" className="update-btn">
          Atualizar Perfil
        </button>
      </form>

      <button onClick={handleDeleteAccount} className="delete-btn">
        Apagar Conta
      </button>
    </div>
  );
}

export default EditProfilePage;
