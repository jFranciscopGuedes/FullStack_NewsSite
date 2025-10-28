from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from models import db, Users

auth_users_bp = Blueprint('auth_users',__name__)

@auth_users_bp.route('/register', methods=['POST'])
def register_user():
    data = request.json
 
    if not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Campos obrigatorios em falta"}), 400

    role = "normal" # Sempre "normal" ao registrar via front-end
    new_user = Users(
        name = data['name'],
        email= data['email'],
        role = role
        )
    new_user.set_password(data['password']) #Metodo criado na Class Users

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Utilizador criado"}), 200

@auth_users_bp.route('/login', methods=['POST'])
def login():
    data = request.json # Extrai o corpo JSON enviado pelo frontend (contém email e password)

    #Procurar na tbl o primeiro user com o email passado
    user = Users.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Dados invalidos"}), 401
    
    token = create_access_token( #Cria o token para o jwt_required() validar
        identity=str(user.id),
        additional_claims={"role": user.role}
    )

    return jsonify({
        "token": token,
        "role": user.role,
        "user_id": user.id
    }), 200