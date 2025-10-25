from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Users

users_bp = Blueprint('users', __name__)

@users_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = int(get_jwt_identity())
    user = Users.query.get(current_user_id)
    if not user:
        return jsonify({"error": "Utilizador nao encontrado"}), 404
    return jsonify(user.to_json()), 200


@users_bp.route('/update', methods=['PUT'])
@jwt_required()
def update_user():
    current_user_id = int(get_jwt_identity())  # ID vem como string

    user = Users.query.get(current_user_id)    # pegar id corretamente

    if not user:
        return jsonify({"error": "Utilizador nao encontrado"}), 404
    
    data = request.json

    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.set_password(data['password'])

    db.session.commit()

    return jsonify({"message": "Utilizador atualizado", "user":user.to_json()}),200

@users_bp.route('/delete', methods=['DELETE'])
@jwt_required() #Valida o Token
def delete_user():
    current_user_id  = int(get_jwt_identity()) # pega id do token
    user = Users.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Utilizador nao encontrado"}), 404
    

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "Conta apagada com sucesso"}), 200
    
    