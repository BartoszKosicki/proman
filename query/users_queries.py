import data_manager


def get_one_user(name):
    return data_manager.execute_select(
        """SELECT *
        FROM proman_users
        WHERE name = %(name)s;""", {'name': name}, fetchall=False
    )


def create_new_user(user_data):
    return data_manager.execute_insert("""
        INSERT INTO proman_users(name, password, email) 
        VALUES (%(name)s, %(password)s, %(email)s)
        RETURNING id;""", {'name': user_data['name'],
         'password': user_data['password'],
         'email': user_data['email']})
