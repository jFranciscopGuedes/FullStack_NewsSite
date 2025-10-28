from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from models import db, Category

category_bp= Blueprint('category',__name__)

@category_bp.route('/', methods=['GET'])
def get_all_categories():
    categories = Category.query.all()
    return jsonify([c.to_json() for c in categories])


@category_bp.route('/', methods=['POST'])
@jwt_required()
def create_category():
    claims = get_jwt()  # pega o dict com additional_claims

    if claims.get("role") != "jornalista":
        return jsonify({"error": "Acesso negado"}), 403
    
    data = request.json

    if not data.get('name'):
        return jsonify({"error": "Campos obrigatorios em falta"}), 400
    
    new_category = Category(
        name=data['name']
    )
    db.session.add(new_category)
    db.session.commit()

    return jsonify({"message": "Categoria Criada"}), 201