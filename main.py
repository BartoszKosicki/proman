from flask import Flask, render_template, url_for, session, request, redirect
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from util import json_response, only_column_names
import mimetypes
from query import users_queries, board_queries, card_queries, columns_queries




mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()
app.secret_key = 'proman'


@app.route("/")
def index():
    if session.get("user_id"):
        return render_template('index.html', user_id=session['user_id'])
    else:
        return render_template('index.html')


@app.route("/save_new_board", methods=['POST', 'GET'])
@json_response
def save_new_board():
    print(request.get_json())
    try:
        data = request.get_json()
        return board_queries.save_new_board_data(data)
    except:
        return 'failed to save data'


@app.route("/api/boards")
@json_response
def get_boards():
    return board_queries.get_boards()


@app.route("/api/boards/<int:user_id>")
@json_response
def get_boards_for_user(user_id: int):
    return board_queries.get_boards_for_user(user_id)


@app.route("/api/columns/<int:board_id>")
@json_response
def get_columns_for_board(board_id: int):
    return columns_queries.get_columns(board_id)


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    return card_queries.get_cards_for_board(board_id)


def main():
    app.run(debug=True)
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        name = request.form['name']
        password = request.form['password']
        my_user = users_queries.get_one_user(name)
        if my_user and check_password_hash(my_user['password'], password):
            session['login'] = True
            session['user'] = my_user['name']
            session['user_id'] = my_user['id']
            return redirect(url_for('index'))
        else:
            return render_template('login.html', message="Incorrect user name or password")
    return render_template('login.html')


@app.route('/logout')
def logout():
    if session['login'] == True:
        session.pop('login')
        session.pop('user')
        session.pop('user_id')
    return render_template('login.html', message="You are logged out")


@app.route('/register', methods=['POST', 'GET'])
def register():
    if 'login' in session:
        return redirect('/')
    elif request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        if users_queries.get_one_user(name):
            return render_template('register.html', message="Username already exists, please choose another one!")

        user_data = {'name': name,
                     'email': email,
                     'password': generate_password_hash(request.form['password'])}
        users_queries.create_new_user(user_data)
        return render_template('login.html', message="Successful registration. Log in to continue.")
    return render_template('register.html')


@app.route("/api/boards/<int:board_id>/cards/add", methods=['POST'])
@json_response
def create_new_card(board_id: int):
    column_name = request.get_json()['column_name']
    column_new_id = columns_queries.get_column_new_for_board(board_id, column_name)
    card_data = {
        'board_id': board_id,
        'columns_id': column_new_id['id'],
        'title': request.get_json()['title'],
        'card_order': 0,
        'user_id': session['user_id'],
        'active': True
    }
    card_id = card_queries.create_new_card(card_data)
    card_data['id'] = card_id['id']
    return card_data


@app.route("/api/cards/<int:card_id>/delete", methods=['DELETE'])
@json_response
def delete_card(card_id: int):
    card_queries.delete_card(card_id)
    return 'DELETED'


@app.route("/api/cards/<int:card_id>/edit", methods=['PUT'])
@json_response
def edit_card_title(card_id: int):
    title = request.get_json()['title']
    return card_queries.edit_card(card_id, title)


@app.route('/api/columns/<int:board_id>/add', methods=['POST'])
@json_response
def add_new_column_to_board(board_id: int):
    title = request.get_json()['title']
    return columns_queries.add_new_column(board_id, title)


@app.route('/api/column/<column_title>/<int:board_id>')
@json_response
def get_new_column_content(column_title, board_id: int):
    column_data = columns_queries.get_new_column_data(column_title, board_id)
    return column_data


@app.route('/api/columns/<int:column_id>/delete', methods=['DELETE'])
@json_response
def delete_column_from_board(column_id: int):
    columns_queries.delete_column(column_id)
    return "Column deleted"


@app.route("/api/cards/<int:card_id>/change-column", methods=['PUT'])
@json_response
def change_column_card(card_id: int):
    column = request.get_json()
    card_id = column['card_id']
    column_id = column['column_id']
    print(column_id)
    return card_queries.change_column(card_id, column_id)


@app.route("/api/get-order-list", methods=['POST'])
@json_response
def order_cards_list():
    if request.method == 'POST':
        ordered_list = {}
        i = 0
        card_list = request.json['cardList']
        # print(card_list)
        for card in card_list:
            i += 1
            dicts = {int(card): i}
            ordered_list.update(dicts)
            dicts = {}
        for k, v in ordered_list.items():
            card_queries.change_order(k, v)
        return card_list



@app.route("/api/columns_name/<int:board_id>")
@json_response
def api_columns_name_for_the_board(board_id: int):
    names = card_queries.columns_name_for_the_board(board_id)
    return only_column_names(names)


@app.route("/api/card/<int:card_id>/archive", methods=['PUT'])
@json_response
def api_archive_card(card_id: int):
    return card_queries.archive_card(card_id)


@app.route("/api/card/<int:card_id>/unarchive", methods=['PUT'])
@json_response
def api_un_archive_card(card_id: int):
    return card_queries.un_archive_card(card_id)


@app.route("/api/board/<int:board_id>/archived_cards")
@json_response
def api_all_archived_cards_for_boards(board_id: int):
    return card_queries.all_archived_cards_for_the_board(board_id)


@app.route("/api/board/<int:board_id>/delete", methods=['DELETE'])
@json_response
def api_delete_board(board_id: int):
    board_queries.delete_board(board_id)
    return "deleted"


@app.route('/api/columns/<int:column_id>/rename', methods=['PUT'])
@json_response
def rename_column_name(column_id: int):
    title = request.get_json()['title']
    return columns_queries.rename_column(column_id, title)


@app.route('/api/boards/<int:board_id>/rename', methods=['PUT'])
@json_response
def rename_board_name(board_id: int):
    title = request.get_json()['title']
    return board_queries.rename_column(board_id, title)


if __name__ == '__main__':
    main()
