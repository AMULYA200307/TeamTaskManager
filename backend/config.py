from datetime import timedelta
class Config:
    SECRET_KEY = "secretkey"

    SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = "jwt-secret-key"

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)