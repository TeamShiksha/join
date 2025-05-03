from flask import current_app
import os
import psycopg2


class Database:
    def get_connection(self):
       try:
           conn = psycopg2.connect(
               dbname=os.getenv('DB_NAME'),
               user=os.getenv('DB_USER'),
               password=os.getenv('DB_PASSWORD'),
               host=os.getenv('DB_HOST'),
               port=os.getenv('DB_PORT')
           )
           return conn
       except Exception as e:
           current_app.logger.error(f"Error connecting to database: {e}")
           return None
       
    def close_connection(self, conn):
        if conn:
            conn.close()

    def execute_query(self, query, params=None):
        current_app.logger.info(f"Executing query: {query} with params: {params}")
        conn = self.get_connection()
        if conn:
            try:
                with conn.cursor() as cursor:
                    cursor.execute(query, params)
                    if query.strip().lower().startswith("select"):
                        return cursor.fetchall()
                    else:
                        conn.commit()
            except Exception as e:
                current_app.logger.error(f"Error executing query: {e}")
            finally:
                self.close_connection(conn)
        else:
            current_app.logger.error("No connection to the database.")
            return None
        
