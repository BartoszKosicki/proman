import data_manager


def get_boards():
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        WHERE type=true
        ORDER BY id DESC;
        """)

def get_boards_for_user(user_id):
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        WHERE type=true
        OR user_id = %(user_id)s
        ORDER BY id DESC;
        """, {'user_id': user_id})


def save_new_board_data(data):
    return data_manager.execute_insert(
        f"""
        WITH ins1 AS (
        INSERT INTO boards (title, type, user_id)
        VALUES (%(board_name)s, %(type)s, %(userid)s)
        RETURNING id)
        INSERT INTO columns (title, board_id)
        VALUES {create_query_values(data)};
        SELECT id, type 
        FROM boards
        GROUP BY id
        HAVING id = max(id);
        """, generate_query_dict(data))


def create_query_values(data):
    column_dict = data.get('columns')
    columns_names = list(column_dict.values())
    values_string = ''
    for name in columns_names:
        if columns_names.index(name) < len(columns_names)-1:
            values_string += f'(%(col{columns_names.index(name)})s, (SELECT id FROM ins1)),'
        else:
            values_string += f'(%(col{columns_names.index(name)})s, (SELECT id FROM ins1))'
    return values_string


def generate_query_dict(data):
    query_dict = {'userid': data.get('userid'), 'type': data.get('type'), 'board_name': data.get('boardTitle')}
    columns_names = list(data.get('columns').values())
    for name in columns_names:
        query_dict[f'col{columns_names.index(name)}'] = name
    return query_dict


def delete_board(board_id):
    return data_manager.execute_delete(
        """
        DELETE FROM boards
        WHERE boards.id = %(board_id)s
        ;
        """, {'board_id': board_id})


def rename_column(board_id, title):
    new_board_name = data_manager.execute_edit(
        """
        UPDATE boards
        SET title = %(title)s
        WHERE id = %(board_id)s
        RETURNING id;
        """, {'board_id': board_id, 'title': title})
    return new_board_name
