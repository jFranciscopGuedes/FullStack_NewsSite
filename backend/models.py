#Database Models/ interaction
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Users(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=False)
    email = db.Column(db.String(20), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False) 
    role = db.Column(db.String, default="normal")
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    #Relações
    news = db.relationship("News", backref="author", lazy=True)
    likes = db.relationship("Likes", backref="user", lazy=True)


    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role
        }


class News(db.Model):
    __tablename__ = "news"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False, unique=False)
    content = db.Column(db.String, nullable=False, unique=False)
    img_url = db.Column(db.String, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    published_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

#Relações
#Cria um relacionamento entre a tabela atual e a tabela Likes
#backref="news" -> a partir de um objeto Like, você consegue acessar a notícia correspondente com like.news
# OU SEJA Significa que, a partir de um objeto Like, tu ganhas acesso à News associada, através do atributo .news.
    likes = db.relationship("Likes", backref="news", lazy=True, cascade="all, delete-orphan")

    def to_json(self):
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
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)

    #Uma categoria pode ter várias notícias (news).
    #Cada notícia pertence a uma categoria.
    news = db.relationship("News", backref="category", lazy=True)

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "news": [news.to_json() for news in self.news]  # Retorna as notícias da categoria
        }


class Likes(db.Model):
    __tablename__ = "likes"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id')) #Nome da tabela.coluna = users.id
    news_id = db.Column(db.Integer, db.ForeignKey('news.id'))

    __table_args__ = (db.UniqueConstraint("user_id", "news_id", name="unique_user_news_like"),)

    def to_json(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "newsId": self.news_id,
        }