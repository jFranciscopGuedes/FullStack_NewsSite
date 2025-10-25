#Main Routes/Endpoints
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from models import db
from routes import register_blueprints


# Cria instância principal da aplicação Flask
app = Flask(__name__)

# Ativa CORS (necessário para comunicação entre frontend e backend)
CORS(app)

# Inicializa JWT (gestão de autenticação)
jwt= JWTManager(app)

# Carrega configurações definidas em config.py
app.config.from_object(Config)

# Liga a base de dados ao Flask
db.init_app(app)

# Função auxiliar para criar todas as tabelas no banco (executa db.create_all())
def create_tables():
    db.create_all()
    
# Registra todos os blueprints (auth, users, news, likes, categories)
register_blueprints(app)

# Rota principal — simples endpoint para verificar se a API está online
@app.route('/')
def index():
    return jsonify({"Status": "API News"})

# Executa o servidor Flask em modo debug
if __name__ == '__main__':
    with app.app_context():
        create_tables()
    app.run(debug=True)
