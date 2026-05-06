from flask import Flask, request, jsonify

from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)

from flask_cors import CORS

from config import Config

from models import db, User, Project, Task

import bcrypt


app = Flask(__name__)

app.config.from_object(Config)

db.init_app(app)

jwt = JWTManager(app)

CORS(app)


# Create DB
with app.app_context():
    db.create_all()


# --------------------------------
# Signup
# --------------------------------
@app.route('/signup', methods=['POST'])

def signup():

    data = request.json

    hashed_password = bcrypt.hashpw(
        data['password'].encode('utf-8'),
        bcrypt.gensalt()
    )

    user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password.decode('utf-8'),
        role=data.get('role', 'member')
    )

    db.session.add(user)

    db.session.commit()

    return jsonify({
        "message": "User created"
    })


# --------------------------------
# Login
# --------------------------------
@app.route('/login', methods=['POST'])

def login():

    data = request.json

    user = User.query.filter_by(
        email=data['email']
    ).first()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    if bcrypt.checkpw(
        data['password'].encode('utf-8'),
        user.password.encode('utf-8')
    ):

        token = create_access_token(identity=str(user.id))
        

        return jsonify({
            "token": token,
            "role": user.role,
            "name": user.name
        })

    return jsonify({
        "message": "Invalid password"
    }), 401


# --------------------------------
# Create Project
# --------------------------------
@app.route('/projects', methods=['POST'])

@jwt_required()

def create_project():

    user_id = get_jwt_identity()

    data = request.json

    project = Project(
        name=data['name'],
        description=data['description'],
        created_by=user_id
    )

    db.session.add(project)

    db.session.commit()

    return jsonify({
        "message": "Project created"
    })


# --------------------------------
# Get Projects
# --------------------------------
@app.route('/projects', methods=['GET'])

@jwt_required()

def get_projects():

    projects = Project.query.all()

    result = []

    for project in projects:

        result.append({
            "id": project.id,
            "name": project.name,
            "description": project.description
        })

    return jsonify(result)


# --------------------------------
# Create Task
# --------------------------------
@app.route('/tasks', methods=['POST'])

@jwt_required()

def create_task():

    data = request.json

    task = Task(
        title=data['title'],
        description=data['description'],
        status=data['status'],
        due_date=data['due_date'],
        assigned_to=data['assigned_to'],
        project_id=data['project_id']
    )

    db.session.add(task)

    db.session.commit()

    return jsonify({
        "message": "Task created"
    })


# --------------------------------
# Get Tasks
# --------------------------------
@app.route('/tasks', methods=['GET'])

@jwt_required()

def get_tasks():

    tasks = Task.query.all()

    result = []

    for task in tasks:

        result.append({
            "id": task.id,
            "title": task.title,
            "status": task.status,
            "due_date": task.due_date
        })

    return jsonify(result)


# --------------------------------
# Dashboard
# --------------------------------
@app.route('/dashboard', methods=['GET'])

@jwt_required()

def dashboard():

    total_tasks = Task.query.count()

    completed_tasks = Task.query.filter_by(
        status="Done"
    ).count()

    pending_tasks = Task.query.filter_by(
        status="Todo"
    ).count()

    return jsonify({
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks
    })


if __name__ == '__main__':

    app.run(debug=True)