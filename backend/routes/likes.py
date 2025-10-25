from flask import Blueprint, jsonify
from flask_jwt_extended import  jwt_required, get_jwt_identity
from models import db, Likes

likes_bp = Blueprint('likes', __name__)

@likes_bp.route('/mylikes', methods=['GET'])
@jwt_required()
def get_user_likes():
    user_id = int(get_jwt_identity())
    likes = Likes.query.filter_by(user_id=user_id).all()

    valid_likes = [like.news.to_json() for like in likes if like.news is not None]
    return jsonify(valid_likes), 200


@likes_bp.route('/like/<int:news_id>', methods=['POST'])
@jwt_required()
def like_news(news_id):
    user_id = int(get_jwt_identity())

    #Verificar se user ja deu like
    existing_like = Likes.query.filter_by(user_id = user_id, news_id=news_id).first()
    if existing_like:
        return jsonify({"error": "Ja deu like"}),400
    
    like= Likes(user_id=user_id, news_id=news_id)

    db.session.add(like)
    db.session.commit()
    return jsonify({"message": "Like adicionado"}), 200

@likes_bp.route('/unlike/<int:news_id>', methods=['DELETE'])
@jwt_required()
def unlike_news(news_id):
    user_id = int(get_jwt_identity())
    like = Likes.query.filter_by(user_id=user_id, news_id=news_id).first()

    if not like:
        return jsonify({"error": "Like não encontrado"}), 404
    
    db.session.delete(like)
    db.session.commit()
    return jsonify({"message": "Like removido"}), 200
