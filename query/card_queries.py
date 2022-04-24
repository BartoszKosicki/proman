import data_manager


def create_new_card(card_data):
    return data_manager.execute_insert("""
        INSERT INTO cards(board_id, columns_id, title, card_order, user_id, active) 
        VALUES (%(board_id)s, %(columns_id)s, %(title)s, %(card_order)s, %(user_id)s, %(active)s)
        RETURNING id;""", {'board_id': card_data['board_id'], 'columns_id': card_data['columns_id'],
                           'title': card_data['title'], 'card_order': card_data['card_order'],
                           'user_id': card_data['user_id'], 'active': card_data['active']})


def delete_card(card_id):
    return data_manager.execute_delete("""DELETE FROM proman.public.cards
    WHERE cards.id = %(card_id)s;""", {'card_id': card_id})


def edit_card(card_id, title):
    return data_manager.execute_edit("""UPDATE cards 
    SET title = %(title)s
    WHERE cards.id = %(card_id)s
    RETURNING *;""", {'card_id': card_id, 'title': title})


def get_cards_for_board(board_id):
    return data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        AND cards.active = true
        ;
        """, {"board_id": board_id})


def get_card_status(status_id):
    return data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})


def change_column(card_id, column_id):
    return data_manager.execute_edit("""UPDATE cards 
        SET columns_id = %(column_id)s
        WHERE cards.id = %(card_id)s
        RETURNING *;""", {'card_id': card_id, 'column_id': column_id})


def columns_name_for_the_board(board_id):
    return data_manager.execute_select("""
SELECT title FROM columns
WHERE columns.board_id = %(board_id)s
;
""", {"board_id": board_id})


def archive_card(card_id):
    return data_manager.execute_edit("""UPDATE cards 
        SET active = false
        WHERE cards.id = %(card_id)s
        RETURNING *;""", {'card_id': card_id})


def un_archive_card(card_id):
    return data_manager.execute_edit("""UPDATE cards 
        SET active = true
        WHERE cards.id = %(card_id)s
        RETURNING *;""", {'card_id': card_id})


def all_archived_cards_for_the_board(board_id):
    return data_manager.execute_select("""
SELECT * FROM cards
WHERE cards.board_id = %(board_id)s
AND cards.active = false
;
""", {"board_id": board_id})

def get_cards():
    cards = data_manager.execute_select(""" 
    SELECT id, board_id, columns_id, title, card_order, user_id, active FROM cards
    WHERE board_id = 1;
    """)
    return cards


def change_order(id, card_order):
    return data_manager.execute_edit("""UPDATE cards 
    SET card_order = %(card_order)s
    WHERE id = %(id)s
    RETURNING *;""", {'card_order': card_order, 'id': id})