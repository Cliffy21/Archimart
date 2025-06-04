import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-default')
    DATABASE_URL = os.getenv('DATABASE_URL')

