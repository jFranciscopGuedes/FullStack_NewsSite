from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Likes

# Cria um Blueprint chamado 'likes' para agrupar todas as rotas relacionadas a likes
likes_bp = Blueprint('likes', __name__)


# ------------------------- ROTA: /mylikes -------------------------
@likes_bp.route('/mylikes', methods=['GET'])
@jwt_required()  # Exige autenticação (JWT válido)
def get_user_likes():
    # Obtém o ID do utilizador autenticado a partir do token JWT
    user_id = int(get_jwt_identity())
    
    # Busca todos os likes feitos por este utilizador
    likes = Likes.query.filter_by(user_id=user_id).all()

    # Garante que a notícia associada ainda exista antes de converter para JSON
    valid_likes = [like.news.to_json() for like in likes if like.news is not None]

    # Retorna a lista de notícias que o utilizador curtiu
    return jsonify(valid_likes), 200


# ------------------------- ROTA: /like/<news_id> -------------------------
@likes_bp.route('/like/<int:news_id>', methods=['POST'])
@jwt_required()  # Apenas utilizadores autenticados podem dar like
def like_news(news_id):
    # Obtém o ID do utilizador autenticado
    user_id = int(get_jwt_identity())

    # Verifica se o utilizador já deu like nesta notícia
    existing_like = Likes.query.filter_by(user_id=user_id, news_id=news_id).first()
    if existing_like:
        return jsonify({"error": "Ja deu like"}), 400  # Impede likes duplicados
    
    # Cria novo registo na tabela Likes
    like = Likes(user_id=user_id, news_id=news_id)

    # Adiciona e guarda na base de dados
    db.session.add(like)
    db.session.commit()

    # Resposta de sucesso
    return jsonify({"message": "Like adicionado"}), 200


# ------------------------- ROTA: /unlike/<news_id> -------------------------
@likes_bp.route('/unlike/<int:news_id>', methods=['DELETE'])
@jwt_required()  # Apenas utilizadores autenticados podem remover like
def unlike_news(news_id):
    # Obtém o ID do utilizador autenticado
    user_id = int(get_jwt_identity())

    # Procura o like correspondente do utilizador naquela notícia
    like = Likes.query.filter_by(user_id=user_id, news_id=news_id).first()

    # Se o like não existir, retorna erro
    if not like:
        return jsonify({"error": "Like não encontrado"}), 404

    # Remove o like e confirma no banco de dados
    db.session.delete(like)
    db.session.commit()

    # Resposta de sucesso
    return jsonify({"message": "Like removido"}), 200
