from .auth import auth_users_bp
from .categories import category_bp
from .likes import likes_bp
from .news import news_bp
from .users import users_bp

def register_blueprints(app):
    # Autenticação (login, registro)
    app.register_blueprint(auth_users_bp, url_prefix='/auth')
    
    # Utilizadores (atualizar, apagar)
    app.register_blueprint(users_bp, url_prefix='/users')
    
    # Notícias (CRUD de notícias)
    app.register_blueprint(news_bp, url_prefix='/news')
    
    # Likes (dar/remover like)
    app.register_blueprint(likes_bp, url_prefix='/likes')
    
    # Categorias (listar, criar)
    app.register_blueprint(category_bp, url_prefix='/categories')
