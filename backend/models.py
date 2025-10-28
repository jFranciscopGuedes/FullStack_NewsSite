# Database Models / interaction
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Users(db.Model):
    __tablename__ = "users"  # Nome da tabela no banco

    id = db.Column(db.Integer, primary_key=True)  # Chave primária única
    name = db.Column(db.String, nullable=False, unique=False)
    email = db.Column(db.String(20), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False) 
    role = db.Column(db.String, default="normal")  # Define o tipo de utilizador (ex: normal, jornalista, admin)
    
    def set_password(self, password):
        # Gera e guarda o hash da password (não armazena a senha em texto simples)
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        # Verifica se a senha informada corresponde ao hash guardado
        return check_password_hash(self.password_hash, password)

    # Relações
    # User vai se relacionar (um para muitos) com News (1 User -> 1..x News). 1 Author pode ter várias notícias
    news = db.relationship("News", backref="author", lazy=True)  # porque cada notícia tem um autor (author_id).

    # User vai se relacionar (um para muitos) com Likes (1 User -> 1..x Likes). 1 User pode dar vários likes
    likes = db.relationship("Likes", backref="user", lazy=True)  # porque cada like é feito por um utilizador (user_id).

    def to_json(self):
        # Converte o objeto User num dicionário JSON para retorno em APIs
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role
        }


class News(db.Model):
    __tablename__ = "news"  # Nome da tabela no banco

    id = db.Column(db.Integer, primary_key=True)  # Chave primária única
    title = db.Column(db.String, nullable=False, unique=False)
    content = db.Column(db.String, nullable=False, unique=False)
    img_url = db.Column(db.String, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # Ligação com a tabela users (autor da notícia)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))  # Ligação com a tabela categories
    published_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # Data e hora da publicação

    # News vai se relacionar (um para muitos) com Likes (1 News -> 1..x Likes). 1 notícia pode ter vários likes
    likes = db.relationship("Likes", backref="news", lazy=True, cascade="all, delete-orphan")
    # cascade="all, delete-orphan" -> garante que se uma notícia for apagada, os likes associados também são

    def to_json(self):
        # Converte o objeto News num dicionário JSON, incluindo autor, categoria e likes
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "img_url": self.img_url,
            "authorId": self.author_id,
            "authorName": self.author.name if self.author else "Desconhecido",
            "categoryId": self.category_id,
            "categoryName": self.category.name if self.category else "Sem categoria",
            "publishedAt": self.published_at.isoformat() if self.published_at else None,  # <-- Adicionado
            "likes": [like.to_json() for like in self.likes]  # Retorna os likes da notícia
        }


class Category(db.Model):
    __tablename__ = "categories"  # Nome da tabela no banco

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)

    # Categoria vai se relacionar (um para muitos) com News (1 categoria -> 1..x News). 1 categoria pode ter várias notícias
    news = db.relationship("News", backref="category", lazy=True)

    def to_json(self):
        # Converte o objeto Category num dicionário JSON, incluindo as notícias associadas
        return {
            "id": self.id,
            "name": self.name,
            "news": [news.to_json() for news in self.news]  # Retorna as notícias associadas à categoria
        }


class Likes(db.Model):
    __tablename__ = "likes"  # Nome da tabela no banco

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # Nome da tabela.coluna = users.id
    news_id = db.Column(db.Integer, db.ForeignKey('news.id'))  # Nome da tabela.coluna = news.id

    # Garante que o mesmo utilizador não possa dar mais de um like na mesma notícia
    __table_args__ = (db.UniqueConstraint("user_id", "news_id", name="unique_user_news_like"),)

    def to_json(self):
        # Converte o objeto Like num dicionário JSON
        return {
            "id": self.id,
            "userId": self.user_id,
            "newsId": self.news_id,
        }
