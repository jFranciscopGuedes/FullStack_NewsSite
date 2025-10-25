from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity,get_jwt
from models import db, News

news_bp = Blueprint("news",__name__)

#Ver todas as noticias
@news_bp.route('/', methods=['GET'])
def get_all_news():
    search = request.args.get("search")
    if search:
        all_news = News.query.filter(News.title.ilike(f"%{search}%")).all()
    else:
        all_news = News.query.all()
    return jsonify([n.to_json() for n in all_news]), 200


#Filtrar noticia
@news_bp.route('/<int:news_id>', methods=['GET'])
def get_news(news_id):
    news = News.query.get(news_id)
    if not news:
        return jsonify({"error": "Noticia nao encontrada"}), 404
    return jsonify(news.to_json()),200


@news_bp.route('/my-news', methods=['GET'])
@jwt_required()
def get_my_news():
    user_id = int(get_jwt_identity())
    claims = get_jwt()
    if claims["role"] != "jornalista":
        return jsonify({"error": "Acesso negado"}), 403
    my_news = News.query.filter_by(author_id=user_id).all()
    return jsonify([n.to_json() for n in my_news]), 200


#Criar Noticia 
@news_bp.route('/create', methods=['POST'])
@jwt_required()
def create_news():
    # Obtém o ID do utilizador autenticado a partir do token JWT
    current_user_id = int(get_jwt_identity())
    
    # Obtém as claims (dados extras) do token, como o papel (role)
    claims = get_jwt()

    # Apenas jornalistas podem criar notícias
    if claims["role"] != "jornalista":
        return jsonify({"error": "Acesso negado"}), 403

    # Extrai os campos diretamente! Em vez de -> data = request.json e -> title=data['title']
    title = request.json.get('title')
    content = request.json.get('content')
    img_url = request.json.get('img_url')
    category_id = request.json.get('category_id')

    # Validação dos campos obrigatórios
    if not all([title, content, img_url, category_id]):
        return jsonify({"error": "Campos obrigatorios em falta"}), 400

    new_news = News(
        title=title, # Em vez de title=data['title']
        content=content,
        img_url=img_url,
        category_id=category_id,
        author_id=current_user_id
    )

    db.session.add(new_news)
    db.session.commit()

    return jsonify({"message": "Noticia Criada"}), 201


#Atualizar a noticia(somente jornalistas)
@news_bp.route('/update/<int:news_id>', methods=['PUT'])
@jwt_required()
def update_news(news_id):
    claims = get_jwt()

    if claims["role"] != "jornalista":
        return jsonify({"error": "Acesso negado"}), 403
    
    news = News.query.get_or_404(news_id) # Guarda em news tudo o que vier da noticia

    data = request.json
    if 'title' in data:
        news.title = data['title'] # OU news.title = data.get("title", news.title)
    if 'content' in data:
        news.content = data['content']
    if 'img_url' in data:
        news.img_url = data['img_url']
    if 'category_id' in data:
        news.category_id = data['category_id']
    if 'published_at' in data:
        news.published_at = data['published_at']

    db.session.commit()
    return jsonify({"message": "Noticia atualizada", "news": news.to_json()}), 200


#Apagar Noticia
@news_bp.route('/delete/<int:news_id>', methods=['DELETE'])
@jwt_required()
def delete_news(news_id):
    claims = get_jwt()

    if claims["role"] != "jornalista":
        return jsonify({"error": "Acesso negado"}), 403
    
    news = News.query.get_or_404(news_id)

    db.session.delete(news)
    db.session.commit()
    return jsonify({"message": "Noticia Eliminada"}),200