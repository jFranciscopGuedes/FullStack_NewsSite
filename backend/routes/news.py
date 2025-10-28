from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity,get_jwt
from models import db, News

news_bp = Blueprint("news",__name__)

# Rota para VER TODAS as notícias
@news_bp.route('/', methods=['GET'])
def get_all_news():
    # Lê o parâmetro "search" enviado na URL (ex: /news?search=portugal)
    search = request.args.get("search")

    # Se o utilizador pesquisou algo, filtra as notícias cujo título contenha esse texto (case-insensitive)
    if search:
        all_news = News.query.filter(News.title.ilike(f"%{search}%")).all()
    # Caso contrário, devolve todas as notícias existentes
    else:
        all_news = News.query.all()

    # Retorna todas as notícias em formato JSON + status 200 (OK)
    return jsonify([n.to_json() for n in all_news]), 200


# Rota para VER UMA notícia específica (filtra por ID)
@news_bp.route('/<int:news_id>', methods=['GET'])
def get_news(news_id):
    # Procura a notícia com o ID fornecido
    news = News.query.get(news_id)

    # Se não encontrar, devolve erro 404
    if not news:
        return jsonify({"error": "Noticia nao encontrada"}), 404

    # Se existir, retorna a notícia em JSON + status 200
    return jsonify(news.to_json()), 200


# Rota para VER APENAS as notícias criadas pelo utilizador autenticado
@news_bp.route('/my-news', methods=['GET'])
@jwt_required()  # Requer token JWT válido (utilizador autenticado)
def get_my_news():
    # Obtém o ID do utilizador atual a partir do token JWT
    user_id = int(get_jwt_identity())

    # Obtém as claims adicionais (como a role) do token JWT
    claims = get_jwt()

    # Verifica se o utilizador tem permissão (apenas "jornalista" pode listar as suas próprias notícias)
    if claims["role"] != "jornalista":
        return jsonify({"error": "Acesso negado"}), 403

    # Filtra as notícias criadas por este utilizador (pelo author_id)
    my_news = News.query.filter_by(author_id=user_id).all()

    # Retorna as notícias em JSON + status 200 (OK)
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